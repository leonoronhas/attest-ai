import { readdir, readFile, realpath, stat } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Backtick-wrapped skill references, with or without a leading slash:
// `i-attest`, `/im-a-code-reviewer`. Placeholder patterns like `im-a(n)-<role>`
// never match because both backticks anchor the name.
const skillReferencePattern = /`\/?(im?-[a-z][a-z-]*)`/g;

// Every skill carries these sections (TEMPLATE.md); i-setup is exempt from
// Project Specifics because it is the skill that writes that file.
const requiredSections = ["The Iron Law", "The Pass", "Verdict", "Red Flags", "Rationalizations", "Project Specifics"];
const sectionExemptions = new Map([["i-setup", new Set(["Project Specifics"])]]);

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function isInside(parent, child) {
  const path = relative(parent, child);
  return path && !path.startsWith("..") && !path.includes(`..${"/"}`);
}

async function readText(path) {
  return readFile(path, "utf8");
}

async function readJson(path) {
  try {
    return JSON.parse(await readText(path));
  } catch (error) {
    fail(`${path}: invalid JSON (${error.message})`);
  }
}

function extractMarkedBlock(text, path) {
  const start = "<!-- attest:always-on:start -->";
  const end = "<!-- attest:always-on:end -->";
  const startAt = text.indexOf(start);
  const endAt = text.indexOf(end);

  assert(startAt !== -1 && endAt !== -1 && endAt > startAt, `${path}: missing attest always-on markers`);
  return text.slice(startAt + start.length, endAt).trim();
}

// A section runs from its heading to the next `## ` heading — no copy of the
// spine's text lives in this script, so a legitimate spine edit stays a
// skills-only change.
function extractSection(text, heading, path) {
  const marker = `\n${heading}\n`;
  const startAt = text.indexOf(marker);
  assert(startAt !== -1, `${path}: missing the "${heading}" section`);
  const endAt = text.indexOf("\n## ", startAt + marker.length);
  assert(endAt !== -1, `${path}: nothing follows the "${heading}" section`);
  return text.slice(startAt + 1, endAt).trim();
}

function referencedSkillNames(text) {
  return new Set([...text.matchAll(skillReferencePattern)].map((match) => match[1]));
}

async function validateCodexPlugin() {
  const marketplacePath = resolve(repositoryRoot, ".claude-plugin/marketplace.json");
  const marketplace = await readJson(marketplacePath);
  const entry = marketplace.plugins?.find((candidate) => candidate.name === "attest");

  assert(entry, `${marketplacePath}: attest marketplace entry is required`);
  assert(typeof entry.source === "string" && entry.source.startsWith("./"), `${marketplacePath}: attest source must start with ./`);
  assert(!entry.source.split("/").includes(".."), `${marketplacePath}: attest source must not traverse out of the marketplace root`);

  const pluginRoot = resolve(repositoryRoot, entry.source);
  assert(isInside(repositoryRoot, pluginRoot), `${marketplacePath}: attest source must remain inside the marketplace root`);
  const manifestPath = resolve(pluginRoot, ".codex-plugin/plugin.json");
  const manifest = await readJson(manifestPath);

  for (const field of ["name", "version", "description", "skills"]) {
    assert(typeof manifest[field] === "string" && manifest[field].trim(), `${manifestPath}: ${field} must be a non-empty string`);
  }

  assert(manifest.skills.startsWith("./"), `${manifestPath}: skills must start with ./`);
  assert(!manifest.skills.split("/").includes(".."), `${manifestPath}: skills must not traverse out of the plugin root`);

  const skillsPath = resolve(pluginRoot, manifest.skills);
  assert(isInside(pluginRoot, skillsPath), `${manifestPath}: skills must remain inside the plugin root`);
  assert((await stat(skillsPath)).isDirectory(), `${manifestPath}: skills directory does not exist`);

  return { pluginRoot, skillsPath };
}

async function validateSkills(skillsPath) {
  const sourceVerdict = extractSection(
    await readText(resolve(skillsPath, "i-attest/SKILL.md")),
    "## Verdict",
    "plugins/attest/skills/i-attest/SKILL.md",
  );
  const entries = await readdir(skillsPath, { withFileTypes: true });
  const names = new Set();
  const progressLines = [];

  for (const entry of entries.filter((candidate) => candidate.isDirectory())) {
    const skillPath = resolve(skillsPath, entry.name, "SKILL.md");
    const text = await readText(skillPath);
    const frontMatter = text.match(/^---\n([\s\S]*?)\n---\n/);
    assert(frontMatter, `${skillPath}: missing YAML front matter`);

    const name = frontMatter[1].match(/^name: (.+)$/m)?.[1];
    const description = frontMatter[1].match(/^description: (.+)$/m)?.[1];
    assert(name === entry.name, `${skillPath}: name must match its directory name`);
    assert(description, `${skillPath}: description is required`);
    assert(!names.has(name), `${skillPath}: duplicate skill name ${name}`);
    assert(!text.includes("[TODO:"), `${skillPath}: TODO placeholder found`);
    assert(text.includes("**Core principle:**"), `${skillPath}: missing the Core principle line`);

    const exempt = sectionExemptions.get(entry.name);
    for (const section of requiredSections) {
      if (exempt?.has(section)) continue;
      assert(text.includes(`\n## ${section}`), `${skillPath}: missing the "## ${section}" section`);
    }

    assert(extractSection(text, "## Verdict", skillPath) === sourceVerdict, `${skillPath}: shared verdict spine drifted`);

    const progressLine = text.match(/^Publish these steps as a live checklist.*$/m)?.[0];
    if (progressLine) progressLines.push({ name: entry.name, line: progressLine });

    names.add(name);
  }

  assert(names.size > 0, `${skillsPath}: no skills found`);

  // The progress-protocol paragraph is a second spine (TEMPLATE.md rule 8):
  // byte-identical wherever it appears.
  for (const { name, line } of progressLines) {
    assert(line === progressLines[0].line, `${name}: progress-protocol spine drifted from ${progressLines[0].name}`);
  }

  return names;
}

async function validateAdapters() {
  const agentsPath = resolve(repositoryRoot, "AGENTS.md");
  const cursorPath = resolve(repositoryRoot, ".cursor/rules/attest.mdc");
  const agentsContract = extractMarkedBlock(await readText(agentsPath), agentsPath);
  const cursorContract = extractMarkedBlock(await readText(cursorPath), cursorPath);

  assert(agentsContract === cursorContract, "AGENTS.md and Cursor's always-on contract drifted");
}

async function validateDispatchTables(skillNames) {
  // These four list the whole family: every skill referenced, every reference real.
  for (const relativePath of ["AGENTS.md", ".cursor/rules/attest.mdc", "README.md", "TEMPLATE.md"]) {
    const referenced = referencedSkillNames(await readText(resolve(repositoryRoot, relativePath)));
    for (const name of referenced) {
      assert(skillNames.has(name), `${relativePath}: references unknown skill ${name}`);
    }
    for (const name of skillNames) {
      assert(referenced.has(name), `${relativePath}: missing skill ${name}`);
    }
  }

  // Other docs may reference a subset, but every reference must be real.
  for (const entry of await readdir(resolve(repositoryRoot, "docs"))) {
    if (!entry.endsWith(".md")) continue;
    const referenced = referencedSkillNames(await readText(resolve(repositoryRoot, "docs", entry)));
    for (const name of referenced) {
      assert(skillNames.has(name), `docs/${entry}: references unknown skill ${name}`);
    }
  }
}

async function validateManifestVersions(pluginRoot) {
  const claudeManifest = await readJson(resolve(pluginRoot, ".claude-plugin/plugin.json"));
  const codexManifest = await readJson(resolve(pluginRoot, ".codex-plugin/plugin.json"));

  assert(
    claudeManifest.version === codexManifest.version,
    `plugin manifest versions disagree: .claude-plugin ${claudeManifest.version} vs .codex-plugin ${codexManifest.version}`,
  );
}

const { pluginRoot, skillsPath } = await validateCodexPlugin();
const skillNames = await validateSkills(await realpath(skillsPath));
await validateAdapters();
await validateDispatchTables(skillNames);
await validateManifestVersions(pluginRoot);
console.log(`release validation passed: ${skillNames.size} skills, manifests, and cross-host contracts`);
