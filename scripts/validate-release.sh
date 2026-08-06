#!/usr/bin/env bash
# Release validator — dependency-free bash (BSD/GNU portable, bash 3.2+).
# Checks: marketplace → manifest → skills resolution, per-skill template
# conformance, the byte-identical verdict spine, the progress-protocol
# spine, always-on contract sync (AGENTS.md ↔ Cursor), dispatch tables
# matching the skill directories, skill references in docs, and equal
# plugin-manifest versions.
set -euo pipefail
cd "$(dirname "$0")/.."

fail() { printf 'Error: %s\n' "$1" >&2; exit 1; }

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT

# First value of a top-level-ish "key": "value" line. The JSON files are
# ours and machine-formatted — this is extraction, not a JSON parser.
json_field() { sed -n 's/.*"'"$2"'": *"\([^"]*\)".*/\1/p' "$1" | head -n 1; }

# A section runs from its heading to the next `## ` heading — no copy of
# the spine's text lives in this script.
verdict_section() { awk '/^## Verdict$/{f=1} f && /^## / && !/^## Verdict$/{exit} f' "$1"; }

marked_block() { awk '/<!-- attest:always-on:start -->/{f=1; next} /<!-- attest:always-on:end -->/{f=0} f' "$1"; }

# Backtick-wrapped skill references, with or without a leading slash:
# `i-attest`, `/im-a-code-reviewer`. Placeholders like `im-a(n)-<role>`
# never match because both backticks anchor the name.
skill_refs() { { grep -oE '`/?im?-[a-z][a-z-]*`' "$1" || true; } | tr -d '`/' | sort -u; }

# --- marketplace → manifest → skills resolution ---------------------------

mp=.claude-plugin/marketplace.json
[ -f "$mp" ] || fail "$mp: missing"
src=$(json_field "$mp" source)
[ -n "$src" ] || fail "$mp: attest marketplace entry with a source is required"
case "$src" in ./*) : ;; *) fail "$mp: attest source must start with ./" ;; esac
case "/$src/" in */../*) fail "$mp: attest source must not traverse out of the marketplace root" ;; esac

plugin_root=${src#./}
manifest=$plugin_root/.codex-plugin/plugin.json
[ -f "$manifest" ] || fail "$manifest: missing"
for key in name version description skills; do
    [ -n "$(json_field "$manifest" "$key")" ] || fail "$manifest: $key must be a non-empty string"
done

skills_rel=$(json_field "$manifest" skills)
case "$skills_rel" in ./*) : ;; *) fail "$manifest: skills must start with ./" ;; esac
case "/$skills_rel/" in */../*) fail "$manifest: skills must not traverse out of the plugin root" ;; esac
skills_dir=$plugin_root/${skills_rel#./}
skills_dir=${skills_dir%/}
[ -d "$skills_dir" ] || fail "$manifest: skills directory does not exist"

# --- per-skill checks ------------------------------------------------------

spine=$(verdict_section "$skills_dir/i-attest/SKILL.md")
[ -n "$spine" ] || fail "$skills_dir/i-attest/SKILL.md: missing the \"## Verdict\" section"

count=0
progress_ref=""
progress_ref_name=""
: > "$tmpdir/dirs"

for dir in "$skills_dir"/*/; do
    name=$(basename "$dir")
    f=${dir%/}/SKILL.md
    [ -f "$f" ] || fail "$f: missing"
    grep -q "^name: $name\$" "$f" || fail "$f: name must match its directory name"
    grep -q '^description: .' "$f" || fail "$f: description is required"
    if grep -q '\[TODO:' "$f"; then fail "$f: TODO placeholder found"; fi
    grep -q '\*\*Core principle:\*\*' "$f" || fail "$f: missing the Core principle line"

    for section in "The Iron Law" "The Pass" "Verdict" "Red Flags" "Rationalizations"; do
        grep -q "^## $section" "$f" || fail "$f: missing the \"## $section\" section"
    done
    # i-setup is exempt from Project Specifics: it is the skill that writes that file.
    if [ "$name" != "i-setup" ]; then
        grep -q '^## Project Specifics' "$f" || fail "$f: missing the \"## Project Specifics\" section"
    fi

    [ "$(verdict_section "$f")" = "$spine" ] || fail "$f: shared verdict spine drifted"

    # The progress-protocol paragraph is a second spine (TEMPLATE.md rule 8):
    # byte-identical wherever it appears.
    progress_line=$(grep '^Publish these steps as a live checklist' "$f" || true)
    if [ -n "$progress_line" ]; then
        if [ -z "$progress_ref" ]; then
            progress_ref=$progress_line
            progress_ref_name=$name
        elif [ "$progress_line" != "$progress_ref" ]; then
            fail "$name: progress-protocol spine drifted from $progress_ref_name"
        fi
    fi

    printf '%s\n' "$name" >> "$tmpdir/dirs"
    count=$((count + 1))
done
[ "$count" -gt 0 ] || fail "$skills_dir: no skills found"
sort -o "$tmpdir/dirs" "$tmpdir/dirs"

# --- always-on contract sync ----------------------------------------------

[ -n "$(marked_block AGENTS.md)" ] || fail "AGENTS.md: missing attest always-on markers"
[ -n "$(marked_block .cursor/rules/attest.mdc)" ] || fail ".cursor/rules/attest.mdc: missing attest always-on markers"
[ "$(marked_block AGENTS.md)" = "$(marked_block .cursor/rules/attest.mdc)" ] || fail "AGENTS.md and Cursor's always-on contract drifted"

# --- dispatch tables and doc references -----------------------------------

# These four list the whole family: every skill referenced, every reference real.
for table in AGENTS.md .cursor/rules/attest.mdc README.md TEMPLATE.md; do
    skill_refs "$table" > "$tmpdir/refs"
    unknown=$(comm -23 "$tmpdir/refs" "$tmpdir/dirs" | head -n 1)
    [ -z "$unknown" ] || fail "$table: references unknown skill $unknown"
    missing=$(comm -13 "$tmpdir/refs" "$tmpdir/dirs" | head -n 1)
    [ -z "$missing" ] || fail "$table: missing skill $missing"
done

# Other docs may reference a subset, but every reference must be real.
for doc in CONTRIBUTING.md docs/*.md; do
    skill_refs "$doc" > "$tmpdir/refs"
    unknown=$(comm -23 "$tmpdir/refs" "$tmpdir/dirs" | head -n 1)
    [ -z "$unknown" ] || fail "$doc: references unknown skill $unknown"
done

# --- manifest version equality --------------------------------------------

claude_version=$(json_field "$plugin_root/.claude-plugin/plugin.json" version)
codex_version=$(json_field "$manifest" version)
[ "$claude_version" = "$codex_version" ] || fail "plugin manifest versions disagree: .claude-plugin $claude_version vs .codex-plugin $codex_version"

echo "release validation passed: $count skills, manifests, and cross-host contracts"
