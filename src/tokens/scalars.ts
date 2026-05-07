/**
 * Layer 0, Scalars
 * One knob per concern. Themes set these; everything downstream cascades.
 *
 * Definitions live in [`./scalars.data.json`](./scalars.data.json).
 * Keeping them in JSON pulls the structurally-repeating object literal
 * scaffold out of TS so Sonar's CPD doesn't flag every entry as
 * duplication. The runtime shape is identical.
 */

import SCALAR_DEFS from './scalars.data.json' with { type: 'json' };
import {
  TAILWIND_NAMESPACES,
  TOKEN_CATEGORIES,
  type TailwindNamespace,
  type TokenCategory,
  type TokenSpec,
} from './types';

const CATEGORY_SET: ReadonlySet<TokenCategory> = new Set(TOKEN_CATEGORIES);
const NAMESPACE_SET: ReadonlySet<TailwindNamespace> = new Set(TAILWIND_NAMESPACES);

function isCategory(value: string): value is TokenCategory {
  return (CATEGORY_SET as ReadonlySet<string>).has(value);
}

function isNamespace(value: string): value is TailwindNamespace {
  return (NAMESPACE_SET as ReadonlySet<string>).has(value);
}

interface RawScalarDef {
  readonly name: string;
  readonly category: string;
  readonly defaultLight: string;
  readonly description: string;
  readonly themePath: string;
  readonly tailwindNamespace?: string;
  readonly utilityAlias?: string;
}

function toScalar(def: RawScalarDef): TokenSpec {
  if (!isCategory(def.category)) {
    throw new Error(`[clay] invalid category in scalar "${def.name}": ${def.category}`);
  }
  let tailwindNamespace: TailwindNamespace | undefined;
  if (def.tailwindNamespace !== undefined) {
    if (!isNamespace(def.tailwindNamespace)) {
      throw new Error(
        `[clay] invalid tailwindNamespace in scalar "${def.name}": ${def.tailwindNamespace}`
      );
    }
    tailwindNamespace = def.tailwindNamespace;
  }
  return {
    name: def.name,
    layer: 'scalar',
    category: def.category,
    defaultLight: def.defaultLight,
    description: def.description,
    themePath: def.themePath,
    tailwindNamespace,
    utilityAlias: def.utilityAlias,
  };
}

export const SCALARS: readonly TokenSpec[] = SCALAR_DEFS.map(toScalar);
