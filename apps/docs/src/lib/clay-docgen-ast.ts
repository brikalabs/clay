/**
 * AST-only docgen for Clay components. Replaces `react-docgen-typescript`,
 * which runs the full TypeScript checker (~3-4s per file post-warmup) with
 * a pure parser walk (~10-30ms per file).
 *
 * Trade-off: we do not resolve types across files. Props from intersected
 * external types (`React.ComponentProps<'div'>`, `RadixDialog.RootProps`)
 * are not expanded — only props authored directly in the file (inline
 * type literals, local interfaces, local type aliases) appear in output.
 * The previous engine filtered those external props out anyway via the
 * `node_modules` heuristic, so the user-visible result is largely the same
 * for Clay's component patterns.
 */

import { readFileSync } from 'node:fs';
import * as ts from 'typescript';
import { isHookName, isInternalProp } from './docgen-helpers';

export interface AstPropDoc {
  readonly name: string;
  readonly type: string;
  readonly required: boolean;
  readonly defaultValue: string | null;
  readonly description: string;
}

export interface AstComponentDoc {
  readonly displayName: string;
  readonly description: string;
  readonly filePath: string;
  readonly props: readonly AstPropDoc[];
}

const SKIPPED_PROPS = new Set(['key', 'ref', 'children']);

// Generic wrappers we drill through when extracting props. `Readonly<X>`
// and friends don't add or remove keys.
const TRANSPARENT_WRAPPERS = new Set(['Readonly', 'Partial', 'Required', 'NonNullable']);

interface NamedTypeIndex {
  readonly interfaces: Map<string, ts.InterfaceDeclaration>;
  readonly aliases: Map<string, ts.TypeAliasDeclaration>;
}

// Maps `cva(...)` variable names to `{ variant key → option keys }`.
// Lets us replace `VariantProps<typeof buttonVariants>['variant']` with
// the actual literal union (`'default' | 'destructive' | ...`).
type CvaIndex = ReadonlyMap<string, ReadonlyMap<string, readonly string[]>>;

interface FileContext {
  readonly sourceFile: ts.SourceFile;
  readonly source: string;
  readonly namedTypes: NamedTypeIndex;
  readonly cva: CvaIndex;
}

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

function indexCvaCalls(sourceFile: ts.SourceFile): CvaIndex {
  const out = new Map<string, Map<string, string[]>>();
  for (const stmt of sourceFile.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      const cvaEntry = readCvaDeclaration(decl);
      if (cvaEntry) {
        out.set(cvaEntry.name, cvaEntry.variants);
      }
    }
  }
  return out;
}

function readCvaDeclaration(
  decl: ts.VariableDeclaration
): { name: string; variants: Map<string, string[]> } | null {
  if (!ts.isIdentifier(decl.name) || !decl.initializer) return null;
  const call = decl.initializer;
  if (!ts.isCallExpression(call)) return null;
  if (!ts.isIdentifier(call.expression) || call.expression.text !== 'cva') return null;

  const config = call.arguments[1];
  if (!config || !ts.isObjectLiteralExpression(config)) return null;

  const variantsObject = findVariantsObject(config);
  if (!variantsObject) return null;

  const variants = readVariantOptions(variantsObject);
  if (variants.size === 0) return null;

  return { name: decl.name.text, variants };
}

function findVariantsObject(
  config: ts.ObjectLiteralExpression
): ts.ObjectLiteralExpression | null {
  const variantsProp = config.properties.find(
    (p): p is ts.PropertyAssignment =>
      ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === 'variants'
  );
  if (!variantsProp || !ts.isObjectLiteralExpression(variantsProp.initializer)) {
    return null;
  }
  return variantsProp.initializer;
}

function readVariantOptions(
  variants: ts.ObjectLiteralExpression
): Map<string, string[]> {
  const keys = new Map<string, string[]>();
  for (const entry of variants.properties) {
    if (!ts.isPropertyAssignment(entry) || !ts.isObjectLiteralExpression(entry.initializer)) {
      continue;
    }
    const variantKey = staticPropertyName(entry.name);
    if (!variantKey) continue;
    const optionNames: string[] = [];
    for (const opt of entry.initializer.properties) {
      const optName = staticPropertyName(opt.name);
      if (optName) optionNames.push(optName);
    }
    keys.set(variantKey, optionNames);
  }
  return keys;
}

function staticPropertyName(name: ts.PropertyName | undefined): string | null {
  if (!name) {
    return null;
  }
  if (ts.isIdentifier(name)) {
    return name.text;
  }
  if (ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return null;
}

// Replaces `VariantProps<typeof X>['key']` with `'a' | 'b' | ...` when X
// is a cva call we indexed in the same file.
function expandVariantPropsType(typeText: string, cva: CvaIndex): string {
  const match = /^VariantProps<\s*typeof\s+([A-Za-z_$][\w$]*)\s*>\s*\[\s*['"]([^'"]+)['"]\s*\]$/.exec(
    typeText
  );
  if (!match) {
    return typeText;
  }
  const [, variableName, variantKey] = match;
  const options = cva.get(variableName)?.get(variantKey);
  if (!options || options.length === 0) {
    return typeText;
  }
  return options.map((o) => `'${o}'`).join(' | ');
}

function indexNamedTypes(sourceFile: ts.SourceFile): NamedTypeIndex {
  const interfaces = new Map<string, ts.InterfaceDeclaration>();
  const aliases = new Map<string, ts.TypeAliasDeclaration>();
  for (const stmt of sourceFile.statements) {
    if (ts.isInterfaceDeclaration(stmt)) {
      interfaces.set(stmt.name.text, stmt);
    } else if (ts.isTypeAliasDeclaration(stmt)) {
      aliases.set(stmt.name.text, stmt);
    }
  }
  return { interfaces, aliases };
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

function extractPropsFromCallExpression(call: ts.CallExpression, ctx: FileContext): AstPropDoc[] {
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

function collectProps(
  typeNode: ts.TypeNode,
  out: Map<string, AstPropDoc>,
  ctx: FileContext,
  visited: Set<string>
): void {
  if (ts.isParenthesizedTypeNode(typeNode)) {
    collectProps(typeNode.type, out, ctx, visited);
    return;
  }
  if (ts.isIntersectionTypeNode(typeNode)) {
    for (const member of typeNode.types) {
      collectProps(member, out, ctx, visited);
    }
    return;
  }
  if (ts.isTypeLiteralNode(typeNode)) {
    addPropertySignatures(typeNode.members, out, ctx);
    return;
  }
  if (ts.isTypeReferenceNode(typeNode)) {
    collectPropsFromReference(typeNode, out, ctx, visited);
  }
  // Unions, function types, mapped types, etc. — not directly enumerable.
}

function collectPropsFromReference(
  typeNode: ts.TypeReferenceNode,
  out: Map<string, AstPropDoc>,
  ctx: FileContext,
  visited: Set<string>
): void {
  const name = typeReferenceName(typeNode.typeName);
  if (!name) return;

  if (TRANSPARENT_WRAPPERS.has(name)) {
    const arg = typeNode.typeArguments?.[0];
    if (arg) collectProps(arg, out, ctx, visited);
    return;
  }

  // Local named type: drill into its body. Don't follow `extends`
  // clauses — they're typically external (Radix, ComponentProps), and
  // expanding them would require a full type checker. The runtime
  // type still lets users pass those props; we just don't enumerate
  // them in the table, matching the previous engine's filter behavior.
  if (visited.has(name)) return;

  const aliasDecl = ctx.namedTypes.aliases.get(name);
  if (aliasDecl) {
    visited.add(name);
    collectProps(aliasDecl.type, out, ctx, visited);
    return;
  }

  const interfaceDecl = ctx.namedTypes.interfaces.get(name);
  if (interfaceDecl) {
    visited.add(name);
    addPropertySignatures(interfaceDecl.members, out, ctx);
  }
  // Otherwise: external reference — silently skip.
}

function addPropertySignatures(
  members: ts.NodeArray<ts.TypeElement>,
  out: Map<string, AstPropDoc>,
  ctx: FileContext
): void {
  for (const member of members) {
    if (ts.isPropertySignature(member)) {
      addProp(member, out, ctx);
    }
  }
}

function typeReferenceName(name: ts.EntityName): string | null {
  if (ts.isIdentifier(name)) {
    return name.text;
  }
  // Qualified name like `React.ComponentProps` — the last segment is what
  // we'd compare against, but those are always external; return null.
  return null;
}

function addProp(
  member: ts.PropertySignature,
  out: Map<string, AstPropDoc>,
  ctx: FileContext
): void {
  const name = propertyName(member.name);
  if (!name) {
    return;
  }
  const rawType = member.type ? cleanTypeText(member.type.getText(ctx.sourceFile)) : 'unknown';
  // Last write wins (matches TypeScript's intersection merge semantics).
  out.set(name, {
    name,
    type: expandVariantPropsType(rawType, ctx.cva),
    required: !member.questionToken,
    defaultValue: null,
    description: getJsDocSummary(member, ctx.source),
  });
}

function propertyName(name: ts.PropertyName): string | null {
  if (ts.isIdentifier(name)) {
    return name.text;
  }
  if (ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return null;
}

function cleanTypeText(text: string): string {
  // Collapse whitespace runs (TS preserves indentation from source).
  return text.replace(/\s+/g, ' ').trim();
}

// JSDoc extraction. The TS parser exposes attached JSDoc nodes on most
// declarations (FunctionDeclaration, PropertySignature, etc.) under the
// non-public `jsDoc` field; we use it via a typed accessor and fall back
// to leading comment ranges for nodes that don't carry attached JSDoc.
interface JSDocCarrier {
  readonly jsDoc?: readonly ts.JSDoc[];
}

function getJsDocSummary(node: ts.Node, source: string): string {
  const attached = (node as unknown as JSDocCarrier).jsDoc;
  const last = attached?.at(-1);
  if (last) {
    const text = jsDocCommentToText(last.comment);
    if (text) {
      return text;
    }
  }
  // Fallback: scan leading /** ... */ comment if the parser didn't attach
  // JSDoc (rare for the node kinds we walk, but cheap to handle).
  const ranges = ts.getLeadingCommentRanges(source, node.getFullStart()) ?? [];
  for (let i = ranges.length - 1; i >= 0; i--) {
    const range = ranges[i];
    if (range.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
      const raw = source.slice(range.pos, range.end);
      if (raw.startsWith('/**')) {
        return cleanCommentBody(raw);
      }
    }
  }
  return '';
}

function jsDocCommentToText(
  comment: string | ts.NodeArray<ts.JSDocComment> | undefined
): string {
  if (!comment) {
    return '';
  }
  if (typeof comment === 'string') {
    return comment.trim();
  }
  return comment
    .map((c) => {
      if ('text' in c && typeof c.text === 'string') {
        return c.text;
      }
      return '';
    })
    .join('')
    .trim();
}

function cleanCommentBody(raw: string): string {
  return raw
    .replace(/^\/\*\*?/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, ''))
    .join('\n')
    .trim();
}
