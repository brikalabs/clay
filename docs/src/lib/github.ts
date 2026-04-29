import { SITE } from '~/config';

export function componentSourceUrl(slug: string): string {
  return `${SITE.github.repo}/tree/${SITE.github.branch}/src/components/${slug}`;
}

export function repoTreeUrl(path: string): string {
  return `${SITE.github.repo}/tree/${SITE.github.branch}/${path}`;
}

export function repoUrl(path?: string): string {
  return path ? `${SITE.github.repo}/${path}` : SITE.github.repo;
}
