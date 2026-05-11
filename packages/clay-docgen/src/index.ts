/**
 * Browser-safe public surface for the Clay docgen package. Pure
 * string/regex helpers + types, no `node:*` runtime imports, so
 * docs-site React components can import from this barrel without
 * dragging filesystem code into the browser bundle.
 *
 * Node-side runtime (the AST extractor, the disk-cache helpers, the
 * Vite plugin) ships from `@brika/clay-docgen/vite`. Server-only
 * consumers who need `extractComponentDocs` directly should import
 * from there.
 *
 * Surface:
 *   - `extractDemoCode(source, fnName)` — extract the JSX returned
 *     from a named demo function in a source string. Pure string
 *     scan, safe in any environment.
 *   - Path / slug helpers (`slugFromPath`, `slugToPascalCase`,
 *     `isHookName`, `isInternalProp`).
 *   - `AstComponentDoc` / `AstPropDoc` / `ClayComponentDoc` /
 *     `ClayPropDoc` — type-only re-exports of the normalised
 *     output shape consumed by the docs UI.
 */

export { extractDemoCode, dedent } from './extract-demo-code';

export { isHookName, isInternalProp, slugFromPath, slugToPascalCase } from './helpers';

export type { AstComponentDoc, AstPropDoc } from './ast';
export type { ClayComponentDoc, ClayPropDoc } from './cache';
