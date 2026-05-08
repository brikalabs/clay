import { SITE } from '~/config';

const CLAY_PKG_PATH = 'packages/clay/src';

export function claySourceUrl(path: string): string {
  return `${SITE.github.repo}/tree/${SITE.github.branch}/${CLAY_PKG_PATH}/${path}`;
}

export function componentSourceUrl(slug: string): string {
  return claySourceUrl(`components/${slug}`);
}

export function repoTreeUrl(path: string): string {
  return `${SITE.github.repo}/tree/${SITE.github.branch}/${path}`;
}

export function repoUrl(path?: string): string {
  return path ? `${SITE.github.repo}/${path}` : SITE.github.repo;
}
