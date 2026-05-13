/**
 * Component metadata shape, co-located with the components themselves.
 *
 * Each component folder ships a `meta.ts` exporting `meta: ComponentMeta`.
 * Discovery happens in user code (the docs site uses `import.meta.glob`
 * to assemble the runtime list), so adding a new component is zero
 * edits in this package, drop a folder with `meta.ts` and you're done.
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
  /** Kebab filename of the demo file (e.g. `default`, `code-editor`). */
  readonly name: string;
  /** Short heading shown above the live demo. */
  readonly title: string;
  /** One-sentence explanation rendered between the heading and the demo. */
  readonly description?: string;
  /** Full file source, shown verbatim in the docs code block. */
  readonly code: string;
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
  /**
   * Accessibility callouts shown in a dedicated section on the docs page.
   * Each entry is a short markdown sentence. Use single-quoted strings
   * so inline-code refs (`aria-label`, `--ring`, ...) sit unescaped:
   *
   * ```ts
   * accessibility: [
   *   'Focus ring uses `--ring` token for WCAG contrast.',
   *   'Icon-only buttons (`size="icon"`) REQUIRE an `aria-label`.',
   * ],
   * ```
   *
   * Lives on `meta.ts` rather than the demos file because:
   *   - it's static text metadata, no React/JSX involvement
   *   - it can be imported without pulling in component code, icons, or
   *     example helpers (better tree-shaking for tools that just want
   *     a11y info, e.g. a CLI auditor)
   *   - it sits next to `description` and `displayName`, the other
   *     prose-shaped metadata
   */
  readonly accessibility?: readonly string[];
}
