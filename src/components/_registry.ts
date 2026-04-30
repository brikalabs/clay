/**
 * Component metadata shape — co-located with the components themselves.
 *
 * Each component folder ships a `meta.ts` exporting `meta: ComponentMeta`.
 * Discovery happens in user code (the docs site uses `import.meta.glob`
 * to assemble the runtime list), so adding a new component is zero
 * edits in this package — drop a folder with `meta.ts` and you're done.
 *
 * This file is the package-level shape contract. It exports types only;
 * no runtime list lives here, which is what keeps Clay free of
 * generated files and bundler-specific build hooks.
 */

export type ComponentGroup =
  | 'Primitives'
  | 'Forms'
  | 'Overlays'
  | 'Navigation'
  | 'Feedback'
  | 'Layout'
  | 'Data';

export interface ExternalDoc {
  /** Human-readable label shown in the docs page header. */
  readonly label: string;
  /** Full URL to the external resource. */
  readonly url: string;
}

/** Full resolved demo record as used by the docs renderer. */
export interface ComponentDemo {
  /** Exported function name in the `.demos.tsx` file. */
  readonly name: string;
  /** Short heading shown above the live demo. */
  readonly title: string;
  /** One-sentence explanation rendered between the heading and the demo. */
  readonly description?: string;
  /** Minimal JSX snippet shown in the code panel — auto-extracted if omitted. */
  readonly code: string;
}

/**
 * What you write in a `.demos.tsx` file.
 * `code` is optional — the registry extracts it from the function source automatically.
 */
export interface DemoInput {
  readonly name: string;
  readonly title: string;
  readonly description?: string;
  readonly code?: string;
}

/**
 * Type-safe, concise way to declare demos inside a `.demos.tsx` file.
 *
 * Pass the actual function references (not strings!) so TypeScript catches
 * undefined function names at compile time. The `name` string is derived
 * automatically from `fn.name`. The `code` snippet is extracted from the
 * function source by the docs registry — no need to maintain it manually.
 *
 * @example
 * ```ts
 * export const demoMeta = defineDemos([
 *   [ButtonDefaultDemo, 'Default'],
 *   [ButtonVariantsDemo, 'Variants', { description: 'Six emphasis tiers.' }],
 * ]);
 * ```
 */
export function defineDemos(
  entries: ReadonlyArray<
    | readonly [fn: { name: string }, title: string]
    | readonly [fn: { name: string }, title: string, extra: { description?: string }]
  >
): readonly DemoInput[] {
  return entries.map(([fn, title, extra]) => ({
    name: fn.name,
    title,
    description: extra?.description,
  }));
}

export interface ComponentMeta {
  /** Folder name. Matches the kebab-case CSS prefix used by tokens (`appliesTo`). */
  readonly name: string;
  /** Human-friendly name used as the docs page title and sidebar label. */
  readonly displayName: string;
  /** Coarse grouping used by the docs sidebar. */
  readonly group: ComponentGroup;
  /** One-paragraph blurb shown at the top of the component's docs page. */
  readonly description: string;
  /** Links to external libraries or specifications this component wraps or depends on. */
  readonly externalDocs?: readonly ExternalDoc[];
}
