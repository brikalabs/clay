/**
 * Type-node walker: descends through intersection types, transparent
 * wrappers (`Readonly`, `Partial`, …), and local interface / type-alias
 * references to enumerate the props declared directly in this file.
 * External references (Radix, `React.ComponentProps`) are silently
 * skipped to match the previous engine's filter behaviour.
 */

import * as ts from 'typescript';

import { type CvaIndex, expandVariantPropsType } from './cva';
import { getJsDocSummary } from './jsdoc';

export interface AstPropDoc {
  readonly name: string;
  readonly type: string;
  readonly required: boolean;
  readonly defaultValue: string | null;
  readonly description: string;
}

export interface NamedTypeIndex {
  readonly interfaces: Map<string, ts.InterfaceDeclaration>;
  readonly aliases: Map<string, ts.TypeAliasDeclaration>;
}

export interface FileContext {
  readonly sourceFile: ts.SourceFile;
  readonly source: string;
  readonly namedTypes: NamedTypeIndex;
  readonly cva: CvaIndex;
}

// Generic wrappers we drill through when extracting props.
// `Readonly<X>` and friends don't add or remove keys.
const TRANSPARENT_WRAPPERS = new Set(['Readonly', 'Partial', 'Required', 'NonNullable']);

export function indexNamedTypes(sourceFile: ts.SourceFile): NamedTypeIndex {
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

export function collectProps(
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
  if (ts.isIdentifier(name)) return name.text;
  // Qualified name like `React.ComponentProps` — the last segment is
  // what we'd compare against, but those are always external; return
  // null.
  return null;
}

function addProp(
  member: ts.PropertySignature,
  out: Map<string, AstPropDoc>,
  ctx: FileContext
): void {
  const name = propertyName(member.name);
  if (!name) return;
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
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return null;
}

function cleanTypeText(text: string): string {
  // Collapse whitespace runs (TS preserves indentation from source).
  return text.replace(/\s+/g, ' ').trim();
}
