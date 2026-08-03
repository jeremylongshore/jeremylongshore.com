/**
 * Loads and shapes data/tools.yml — the "what I actually run" list rendered
 * in the homepage Tools section behind category filter pills.
 *
 * Same sync, build-time load pattern as lib/data/projects.ts: no network, no
 * revalidate window. The YAML is parsed once at module load and re-parsed
 * only when the server process restarts (a fresh deploy). A malformed or
 * missing file throws naturally from `readFileSync`/`parse` — there is no
 * meaningful partial state to fall back to for a curated static list.
 *
 * Unlike projects.yml, tools.yml already matches this module's exported
 * shape field-for-field (`categories: [{ name, tools: [{ title, url, note }] }]`),
 * so there is no snake_case-to-camelCase mapping to do here.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

export interface Tool {
  title: string;
  url: string;
  note: string;
}

export interface ToolCategory {
  name: string;
  tools: Tool[];
}

interface RawToolsFile {
  categories: ToolCategory[];
}

const TOOLS_FILE_PATH = join(process.cwd(), 'data', 'tools.yml');

function loadToolCategories(): ToolCategory[] {
  const fileContents = readFileSync(TOOLS_FILE_PATH, 'utf-8');
  const raw = parse(fileContents) as RawToolsFile;
  return raw.categories;
}

const toolCategories = loadToolCategories();

/** Returns every tool, grouped by category, in file order. */
export function getToolCategories(): ToolCategory[] {
  return toolCategories;
}
