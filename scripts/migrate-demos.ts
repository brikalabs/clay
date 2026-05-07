/**
 * Migrates demo files from docs/src/components/demos/<slug>.tsx
 * into src/components/<slug>/<slug>.demos.tsx
 *
 * For each component it:
 *   1. Copies the exported demo functions verbatim
 *   2. Derives demoMeta (name, title, description from JSDoc, code from return body)
 *   3. Adds an empty accessibility array as a placeholder
 *
 * Run: bun scripts/migrate-demos.ts
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DEMOS_DIR = 'docs/src/components/demos';
const COMPONENTS_DIR = 'src/components';
const SKIP = new Set(['HomeGrid.tsx', 'ThemesGallery.tsx']);

// Convert slug → PascalCase prefix (e.g. "input-group" → "InputGroup")
function slugToPrefix(slug: string): string {
  return slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

// Extract the title from a function name by removing the component prefix and "Demo" suffix
// e.g. ButtonVariantsDemo, prefix=Button → "Variants"
// e.g. DropdownMenuCheckboxDemo, prefix=DropdownMenu → "Checkboxes", we just split camelCase
function nameToTitle(fnName: string, prefix: string): string {
  const noDemo = fnName.endsWith('Demo') ? fnName.slice(0, -4) : fnName;
  const noPrefix = noDemo.startsWith(prefix) ? noDemo.slice(prefix.length) : noDemo;
  if (!noPrefix) return 'Default';
  // Split camelCase: "AsLink" → "As Link", "WithBadge" → "With Badge"
  return noPrefix.replace(/([A-Z])/g, ' $1').trim();
}

// Extract JSDoc comment immediately preceding an export function
function extractJsDoc(content: string, fnName: string): string | null {
  const idx = content.indexOf(`export function ${fnName}`);
  if (idx === -1) return null;
  // Trim to what comes right before the function declaration
  const before = content.slice(0, idx).trimEnd();
  // Must end with */ for a JSDoc to be immediately before
  if (!before.endsWith('*/')) return null;
  // Find the opening /** for this specific JSDoc block
  const startIdx = before.lastIndexOf('/**');
  if (startIdx === -1) return null;
  const raw = before.slice(startIdx + 3, before.length - 2); // strip /** and */
  return raw
    .split('\n')
    .map((l) => l.replace(/^\s*\*\s?/, ''))
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ');
}

// Extract the body of a function by matching balanced braces
function extractFunctionBody(content: string, fnName: string): string {
  const startIdx = content.indexOf(`export function ${fnName}`);
  if (startIdx === -1) return '';
  const braceIdx = content.indexOf('{', startIdx);
  if (braceIdx === -1) return '';
  let depth = 1;
  let i = braceIdx + 1;
  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    i++;
  }
  return content.slice(braceIdx + 1, i - 1).trim();
}

// Extract the code snippet: the content of the outermost return statement
function extractReturnCode(body: string): string {
  // Find the last `return (` and extract balanced parens
  const lastReturnParen = body.lastIndexOf('return (');
  if (lastReturnParen !== -1) {
    let depth = 0;
    let i = lastReturnParen + 7; // position of '('
    let start = -1;
    while (i < body.length) {
      if (body[i] === '(') { if (depth === 0) start = i + 1; depth++; }
      else if (body[i] === ')') { depth--; if (depth === 0) return body.slice(start, i).trim(); }
      i++;
    }
  }
  // return <JSX>;, single-expression return (last occurrence)
  const lastReturn = body.lastIndexOf('return ');
  if (lastReturn !== -1) {
    const tail = body.slice(lastReturn + 7).replace(/;\s*$/, '').trim();
    if (tail) return tail;
  }
  return body;
}

// Find all export function names ending in Demo
function extractDemoFunctions(content: string): string[] {
  const fns: string[] = [];
  const re = /export\s+function\s+(\w+Demo)\s*\(/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    fns.push(m[1]);
  }
  return fns;
}

// Main migration for one slug
function migrate(slug: string): void {
  const src = join(DEMOS_DIR, `${slug}.tsx`);
  if (!existsSync(src)) {
    console.log(`  skip (no demo file): ${slug}`);
    return;
  }

  const destDir = join(COMPONENTS_DIR, slug);
  if (!existsSync(destDir)) {
    console.log(`  skip (no component dir): ${slug}`);
    return;
  }

  const dest = join(destDir, `${slug}.demos.tsx`);
  const content = readFileSync(src, 'utf-8');
  const prefix = slugToPrefix(slug);
  const fns = extractDemoFunctions(content);

  if (fns.length === 0) {
    console.log(`  skip (no demos): ${slug}`);
    return;
  }

  // Build demoMeta entries
  const metaEntries = fns.map((fnName) => {
    const title = nameToTitle(fnName, prefix);
    const description = extractJsDoc(content, fnName);
    const body = extractFunctionBody(content, fnName);
    const code = extractReturnCode(body);
    return { fnName, title, description, code };
  });

  // Generate the output file
  const lines: string[] = [];

  // Original content (functions + their imports)
  lines.push(content.trimEnd());
  lines.push('');
  lines.push("import type { ComponentDemo } from '../_registry';");
  lines.push('');
  lines.push('export const demoMeta: readonly ComponentDemo[] = [');

  for (const { fnName, title, description, code } of metaEntries) {
    lines.push('  {');
    lines.push(`    name: '${fnName}',`);
    lines.push(`    title: '${title}',`);
    if (description) {
      // Escape backticks and backslashes in the description
      const safeDesc = description.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
      lines.push(`    description: \`${safeDesc}\`,`);
    }
    // Code as template literal
    const safeCode = code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    lines.push(`    code: \`${safeCode}\`,`);
    lines.push('  },');
  }

  lines.push('];');
  lines.push('');
  lines.push('// Fill in component-specific accessibility facts here.');
  lines.push('export const accessibility: readonly string[] = [];');
  lines.push('');

  writeFileSync(dest, lines.join('\n'));
  console.log(`  created ${dest} (${fns.length} demos)`);
}

// Run
const files = readdirSync(DEMOS_DIR)
  .filter((f) => f.endsWith('.tsx') && !SKIP.has(f))
  .sort();

console.log(`Migrating ${files.length} components…\n`);
for (const file of files) {
  const slug = file.replace('.tsx', '');
  process.stdout.write(`[${slug}] `);
  migrate(slug);
}
console.log('\nDone.');

// Append externalDocs to meta.ts files that need them
// Run as a second pass after main migration
