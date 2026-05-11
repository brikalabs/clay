/**
 * Index `cva(...)` declarations so prop tables can replace
 * `VariantProps<typeof X>['variantKey']` with the actual literal
 * union (`'default' | 'destructive' | ...`). Pure parser walk; no
 * checker needed.
 */

import * as ts from 'typescript';

// Maps `cva(...)` variable names to `{ variant key → option keys }`.
export type CvaIndex = ReadonlyMap<string, ReadonlyMap<string, readonly string[]>>;

export function indexCvaCalls(sourceFile: ts.SourceFile): CvaIndex {
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
  if (!name) return null;
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return null;
}

/**
 * Replace `VariantProps<typeof X>['key']` with `'a' | 'b' | ...` when
 * X is a cva call we indexed in the same file.
 */
export function expandVariantPropsType(typeText: string, cva: CvaIndex): string {
  const match = /^VariantProps<\s*typeof\s+([A-Za-z_$][\w$]*)\s*>\s*\[\s*['"]([^'"]+)['"]\s*\]$/.exec(
    typeText
  );
  if (!match) return typeText;
  const [, variableName, variantKey] = match;
  const options = cva.get(variableName)?.get(variantKey);
  if (!options || options.length === 0) return typeText;
  return options.map((o) => `'${o}'`).join(' | ');
}
