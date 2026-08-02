/**
 * Loads and shapes data/projects.yml — the project grid data.
 *
 * Unlike the other fetchers in this directory, this is a build-time,
 * synchronous local file read (no network, no revalidate window): the YAML
 * is parsed once at module load and re-parsed only when the server process
 * restarts (a fresh deploy). A malformed/missing file throws naturally from
 * `readFileSync`/`parse` — there is nothing to catch gracefully here, since
 * the project grid has no meaningful "partial" state to fall back to.
 *
 * The YAML shape is top-level category keys, each holding an ordered list
 * of projects (see data/projects.yml). Category order and project order
 * within each category are preserved from the file.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

export interface Project {
  id: string;
  title: string;
  url?: string;
  icon?: string;
  githubRepo?: string;
  visibility?: 'public' | 'private';
  clientWork?: boolean;
  purposeShort?: string;
  purposeLong?: string;
  useCases?: string[];
  techStack?: string[];
  agentFramework?: string[];
}

export interface ProjectCategory {
  category: string;
  projects: Project[];
}

interface RawProject {
  id: string;
  title: string;
  url?: string;
  icon?: string;
  github_repo?: string;
  visibility?: 'public' | 'private';
  client_work?: boolean;
  purpose_short?: string;
  purpose_long?: string;
  use_cases?: string[];
  tech_stack?: string[];
  agent_framework?: string[];
}

type RawProjectsFile = Record<string, RawProject[]>;

/** Known category keys -> display labels, taken from the file's section comments. */
const CATEGORY_LABELS: Record<string, string> = {
  intent_solutions_repos: 'Intent Solutions',
  products: 'Products & Services',
  personal_repos: 'Open Source',
  client_projects: 'Client Projects',
  n8n_workflows: 'N8N Workflows',
};

function humanizeCategory(key: string): string {
  const known = CATEGORY_LABELS[key];
  if (known) return known;
  return key
    .split('_')
    .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');
}

function toProject(raw: RawProject): Project {
  return {
    id: raw.id,
    title: raw.title,
    url: raw.url,
    icon: raw.icon,
    githubRepo: raw.github_repo,
    visibility: raw.visibility,
    clientWork: raw.client_work,
    purposeShort: raw.purpose_short,
    purposeLong: raw.purpose_long,
    useCases: raw.use_cases,
    techStack: raw.tech_stack,
    agentFramework: raw.agent_framework,
  };
}

const PROJECTS_FILE_PATH = join(process.cwd(), 'data', 'projects.yml');

function loadProjectCategories(): ProjectCategory[] {
  const fileContents = readFileSync(PROJECTS_FILE_PATH, 'utf-8');
  const raw = parse(fileContents) as RawProjectsFile;

  return Object.entries(raw).map(([key, projects]) => ({
    category: humanizeCategory(key),
    projects: projects.map(toProject),
  }));
}

const projectCategories = loadProjectCategories();

/** Returns every project, grouped by category, in file order. */
export function getProjects(): ProjectCategory[] {
  return projectCategories;
}

/**
 * Returns the first `n` projects (across categories, in file order) that
 * have a `githubRepo` or `url` — i.e. something to link to.
 */
export function getFeaturedProjects(n: number): Project[] {
  const featured: Project[] = [];
  for (const { projects } of projectCategories) {
    for (const project of projects) {
      if (featured.length >= n) return featured;
      if (project.githubRepo || project.url) {
        featured.push(project);
      }
    }
  }
  return featured;
}
