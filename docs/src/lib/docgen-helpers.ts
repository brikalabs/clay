/**
 * Pure helpers used by the clay-docgen Vite plugin. Live in a separate
 * module from the plugin itself so the helpers stay testable under Bun
 * without the plugin's runtime dependency on `react-docgen-typescript`
 * (which lives in `docs/node_modules` and isn't installed when the
 * root test runner spins up).
 */

/** Extract the component slug from an absolute file path. */
export function slugFromPath(filePath: string): string | null {
  const match = /[/\\]components[/\\]([^/\\]+)[/\\][^/\\]+\.tsx$/.exec(filePath);
  return match?.[1] ?? null;
}

/** "dropdown-menu" → "DropdownMenu" */
export function slugToPascalCase(slug: string): string {
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

/**
 * Looks like a hook (camelCase starting with "use"), not a component.
 * react-docgen-typescript picks these up when their argument type is shaped
 * like a React props object; we drop them from the output.
 */
export function isHookName(name: string): boolean {
  return /^use[A-Z]/.test(name);
}

/** Radix injects `__scope*` context props internally — never surface them. */
export function isInternalProp(name: string): boolean {
  return name.startsWith('__');
}
