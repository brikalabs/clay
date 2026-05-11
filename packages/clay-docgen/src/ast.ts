/**
 * AST-only docgen for Clay components. Replaces
 * `react-docgen-typescript`, which runs the full TypeScript checker
 * (~3-4s per file post-warmup) with a pure parser walk (~10-30ms per
 * file).
 *
 * Trade-off: we do not resolve types across files. Props from
 * intersected external types (`React.ComponentProps<'div'>`,
 * `RadixDialog.RootProps`) are not expanded — only props authored
 * directly in the file (inline type literals, local interfaces, local
 * type aliases) appear in output. The previous engine filtered those
 * external props out anyway via the `node_modules` heuristic, so the
 * user-visible result is largely the same for Clay's component
 * patterns.
 *
 * Internals are split across:
 *   - `cva.ts`   : `cva(...)` index + VariantProps expand.
 *   - `types.ts` : type-node walker + prop collection.
 *   - `jsdoc.ts` : JSDoc extraction (attached + leading).
 */

import { readFileSync } from 'node:fs';
import * as ts from 'typescript';

import { indexCvaCalls } from './cva';
import {
  type AstPropDoc,
  type FileContext,
  collectProps,
  indexNamedTypes,
} from './types';
import { getJsDocSummary } from './jsdoc';
import { isHookName, isInternalProp } from './helpers';

export type { AstPropDoc } from './types';

export interface AstComponentDoc {
  readonly displayName: string;
  readonly description: string;
  readonly filePath: string;
  readonly props: readonly AstPropDoc[];
}

const SKIPPED_PROPS = new Set(['key', 'ref', 'children']);

export function extractComponentDocs(filePath: string): readonly AstComponentDoc[] {
  const source = readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX
  );

  const ctx: FileContext = {
    sourceFile,
    source,
    namedTypes: indexNamedTypes(sourceFile),
    cva: indexCvaCalls(sourceFile),
  };
  const components: AstComponentDoc[] = [];
  const seenNames = new Set<string>();

  for (const stmt of sourceFile.statements) {
    for (const candidate of collectComponentCandidates(stmt, ctx)) {
      if (seenNames.has(candidate.displayName)) {
        continue;
      }
      seenNames.add(candidate.displayName);
      components.push({ ...candidate, filePath });
    }
  }

  return components;
}

interface ComponentCandidate {
  readonly displayName: string;
  readonly description: string;
  readonly props: readonly AstPropDoc[];
}

function collectComponentCandidates(
  stmt: ts.Statement,
  ctx: FileContext
): ComponentCandidate[] {
  // function Foo(...) { ... }
  if (ts.isFunctionDeclaration(stmt) && stmt.name && isComponentName(stmt.name.text)) {
    return [
      {
        displayName: stmt.name.text,
        description: getJsDocSummary(stmt, ctx.source),
        props: extractPropsFromFunction(stmt, ctx),
      },
    ];
  }

  // const Foo = ... (one or more declarators per statement)
  if (ts.isVariableStatement(stmt)) {
    const out: ComponentCandidate[] = [];
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || !isComponentName(decl.name.text)) {
        continue;
      }
      const init = decl.initializer;
      if (!init) {
        continue;
      }
      if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) {
        out.push({
          displayName: decl.name.text,
          description: getJsDocSummary(stmt, ctx.source),
          props: extractPropsFromFunction(init, ctx),
        });
      } else if (ts.isCallExpression(init)) {
        // HOC wrappers: withSlot(X, 'name'), forwardRef<...>(...). We
        // can't extract props from the wrapped runtime value via AST,
        // but the component is still real — surface it without props.
        out.push({
          displayName: decl.name.text,
          description: getJsDocSummary(stmt, ctx.source),
          props: extractPropsFromCallExpression(init, ctx),
        });
      }
    }
    return out;
  }

  return [];
}

function isComponentName(name: string): boolean {
  return /^[A-Z]/.test(name) && !isHookName(name);
}

type FunctionLike = ts.FunctionDeclaration | ts.ArrowFunction | ts.FunctionExpression;

function extractPropsFromFunction(fn: FunctionLike, ctx: FileContext): AstPropDoc[] {
  const param = fn.parameters[0];
  if (!param?.type) {
    return [];
  }
  const propsByName = new Map<string, AstPropDoc>();
  collectProps(param.type, propsByName, ctx, new Set());

  // Default values from destructured parameter: `{ asChild = false, ... }: Props`.
  if (param.name && ts.isObjectBindingPattern(param.name)) {
    for (const element of param.name.elements) {
      if (!ts.isBindingElement(element) || !element.initializer) {
        continue;
      }
      const propName = bindingElementPropertyName(element);
      if (!propName) {
        continue;
      }
      const existing = propsByName.get(propName);
      if (!existing) {
        continue;
      }
      propsByName.set(propName, {
        ...existing,
        defaultValue: element.initializer.getText(ctx.sourceFile),
      });
    }
  }

  return finalizeProps(propsByName);
}

function extractPropsFromCallExpression(
  call: ts.CallExpression,
  ctx: FileContext
): AstPropDoc[] {
  // forwardRef<Element, Props>(...): the second type argument is the props.
  if (call.typeArguments && call.typeArguments.length >= 2) {
    const propsByName = new Map<string, AstPropDoc>();
    collectProps(call.typeArguments[1], propsByName, ctx, new Set());
    return finalizeProps(propsByName);
  }
  // withSlot(X, 'name') and friends: no AST-extractable props.
  return [];
}

function bindingElementPropertyName(element: ts.BindingElement): string | null {
  // `{ propName: localName = default }` — propertyName carries the source key.
  if (element.propertyName) {
    if (ts.isIdentifier(element.propertyName)) {
      return element.propertyName.text;
    }
    if (ts.isStringLiteral(element.propertyName)) {
      return element.propertyName.text;
    }
    return null;
  }
  if (ts.isIdentifier(element.name)) {
    return element.name.text;
  }
  return null;
}

function finalizeProps(propsByName: ReadonlyMap<string, AstPropDoc>): AstPropDoc[] {
  return Array.from(propsByName.values())
    .filter((p) => !SKIPPED_PROPS.has(p.name) && !isInternalProp(p.name))
    .sort((a, b) => {
      if (a.required !== b.required) {
        return a.required ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
}
