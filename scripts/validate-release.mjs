import { readdir, readFile, realpath, stat } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const verdictEnd =
  "**The Unverified List.** Every CAN'T PROVE item must be individually acknowledged by whoever accepts the work — a human reviewer or a gate that records it. A blanket \"confirmed\" covering multiple unverified items is void. If nothing is unverified, say \"Unverified: none\" explicitly; silence is not a clean bill.";

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

function extractVerdict(text, path) {
  const start = "## Verdict\n";
  const startAt = text.indexOf(start);
  const endAt = text.indexOf(verdictEnd, startAt);

  assert(startAt !== -1 && endAt !== -1, `${path}: missing the shared verdict spine`);
  return text.slice(startAt, endAt + verdictEnd.length);
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

  return skillsPath;
}

async function validateSkills(skillsPath) {
  const sourceVerdict = extractVerdict(
    await readText(resolve(skillsPath, "i-attest/SKILL.md")),
    "plugins/attest/skills/i-attest/SKILL.md",
  );
  const entries = await readdir(skillsPath, { withFileTypes: true });
  const names = new Set();
  let count = 0;

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
    assert(extractVerdict(text, skillPath) === sourceVerdict, `${skillPath}: shared verdict spine drifted`);

    names.add(name);
    count += 1;
  }

  assert(count > 0, `${skillsPath}: no skills found`);
  return count;
}

async function validateAdapters() {
  const agentsPath = resolve(repositoryRoot, "AGENTS.md");
  const cursorPath = resolve(repositoryRoot, ".cursor/rules/attest.mdc");
  const agentsContract = extractMarkedBlock(await readText(agentsPath), agentsPath);
  const cursorContract = extractMarkedBlock(await readText(cursorPath), cursorPath);

  assert(agentsContract === cursorContract, "AGENTS.md and Cursor's always-on contract drifted");
}

async function validateJsonFiles() {
  for (const relativePath of [
    "plugins/attest/.claude-plugin/plugin.json",
  ]) {
    await readJson(resolve(repositoryRoot, relativePath));
  }
}

const skillsPath = await validateCodexPlugin();
const skillCount = await validateSkills(await realpath(skillsPath));
await validateAdapters();
await validateJsonFiles();
console.log(`release validation passed: ${skillCount} skills, manifests, and cross-host contracts`);
