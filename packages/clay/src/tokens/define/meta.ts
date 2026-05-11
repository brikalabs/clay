/**
 * Component meta helper for `defineComponent`. Maps a kebab-case
 * component name to the camelCase `themeKey` used in `ThemeConfig`
 * JSON (`components.<themeKey>.<prop>`).
 */

export interface ComponentMeta {
  /** Component name as it appears in the registry (kebab-case, matches CSS). */
  readonly name: string;
  /** camelCase identifier used in `themePath` (`switchThumb` for `switch-thumb`). */
  readonly themeKey: string;
}

export function meta(name: string, themeKey?: string): ComponentMeta {
  return {
    name,
    themeKey: themeKey ?? name.replaceAll(/-([a-z])/g, (_, c: string) => c.toUpperCase()),
  };
}
