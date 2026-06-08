import { SITE } from '~/config';

const CLAY_PKG_PATH = 'packages/clay/src';

export function claySourceUrl(path: string): string {
  return `${SITE.github.repo}/tree/${SITE.github.branch}/${CLAY_PKG_PATH}/${path}`;
}

/** Blob (single-file) URL — use for linking to one file, not a directory. */
export function clayBlobUrl(path: string): string {
  return `${SITE.github.repo}/blob/${SITE.github.branch}/${CLAY_PKG_PATH}/${path}`;
}

export function componentSourceUrl(slug: string): string {
  return claySourceUrl(`components/${slug}`);
}

/** GitHub URL of a single demo file (`components/<slug>/demos/<kebab>.demos.tsx`). */
export function demoSourceUrl(slug: string, kebab: string): string {
  return clayBlobUrl(`components/${slug}/demos/${kebab}.demos.tsx`);
}

export function repoTreeUrl(path: string): string {
  return `${SITE.github.repo}/tree/${SITE.github.branch}/${path}`;
}

export function repoUrl(path?: string): string {
  return path ? `${SITE.github.repo}/${path}` : SITE.github.repo;
}
