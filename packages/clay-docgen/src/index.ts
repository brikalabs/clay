/**
 * AST-only React component-docs extractor used by the Clay docs site.
 *
 * Public surface:
 *   - `extractComponentDocs(filePath)` — parse a single `.tsx` file
 *     and return one or more `AstComponentDoc`s. Pure parser walk;
 *     no TypeScript checker, no cross-file resolution.
 *   - `extractDemoCode(source, fnName)` — extract the JSX returned
 *     from a named demo function in a source string.
 *   - Path / slug helpers (`slugFromPath`, `slugToPascalCase`,
 *     `isHookName`, `isInternalProp`).
 *   - `ClayComponentDoc` / `ClayPropDoc` — normalised, slug-keyed
 *     output shape consumed by the docs UI.
 *
 * The Vite plugin entry lives at `@brika/clay-docgen/vite`.
 */

export { extractComponentDocs } from './ast';
export type { AstComponentDoc, AstPropDoc } from './ast';

export { extractDemoCode, dedent } from './extract-demo-code';

export { isHookName, isInternalProp, slugFromPath, slugToPascalCase } from './helpers';

export type { ClayComponentDoc, ClayPropDoc } from './cache';
