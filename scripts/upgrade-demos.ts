/**
 * Upgrades all *.demos.tsx files to the defineDemos format.
 *
 * Uses dynamic import to read the actual demoMeta values (no regex parsing of TS),
 * then rewrites each file with the new format.
 *
 * Run: bun scripts/upgrade-demos.ts
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const COMPONENTS_DIR = 'src/components';

// ─── Source parsing helpers ────────────────────────────────────────────────────

interface ParsedEntry { name: string; title: string; description?: string }

/** Extract {name, title, description?} objects from a serialised TS array literal.
 *  Handles single/double/template-literal strings and skips code values. */
function parseEntries(src: string): ParsedEntry[] {
  // Grab the array content between the outermost [ ... ]
  const start = src.indexOf('export const demoMeta');
  if (start === -1) return [];
  // Find the assignment `= [`, skip past type annotations like `ComponentDemo[]`
  const assignIdx = src.indexOf('= [', start);
  if (assignIdx === -1) return [];
  const arrOpen = assignIdx + 2; // position of '['
  let depth = 1, i = arrOpen + 1;
  while (i < src.length && depth > 0) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') depth--;
    i++;
  }
  const arrContent = src.slice(arrOpen + 1, i - 1);

  // Extract each top-level object { ... } (depth-aware, skipping string contents)
  const entries: ParsedEntry[] = [];
  let j = 0;
  while (j < arrContent.length) {
    if (arrContent[j] === '{') {
      let d = 1, k = j + 1;
      // Walk forward, skipping string / template-literal contents
      while (k < arrContent.length && d > 0) {
        const ch = arrContent[k];
        if (ch === "'" || ch === '"') {
          k++;
          while (k < arrContent.length && arrContent[k] !== ch) {
            if (arrContent[k] === '\\') k++;
            k++;
          }
        } else if (ch === '`') {
          k++;
          while (k < arrContent.length && arrContent[k] !== '`') {
            if (arrContent[k] === '\\') k++;
            k++;
          }
        } else if (ch === '{') d++;
        else if (ch === '}') d--;
        k++;
      }
      const objSrc = arrContent.slice(j, k);
      const entry = parseEntry(objSrc);
      if (entry) entries.push(entry);
      j = k;
    } else {
      j++;
    }
  }
  return entries;
}

function readStr(src: string, fromIdx: number): string {
  let i = fromIdx;
  while (i < src.length && (src[i] === ' ' || src[i] === '\t')) i++;
  const delim = src[i];
  if (delim !== "'" && delim !== '"' && delim !== '`') return '';
  let result = '', j = i + 1;
  while (j < src.length) {
    const ch = src[j];
    if (ch === '\\') { result += src[j + 1] ?? ''; j += 2; continue; }
    if (ch === delim) break;
    result += ch;
    j++;
  }
  return result;
}

function parseEntry(objSrc: string): ParsedEntry | null {
  const nm = /\bname\s*:/.exec(objSrc);
  const ti = /\btitle\s*:/.exec(objSrc);
  if (!nm || !ti) return null;
  const name = readStr(objSrc, nm.index + nm[0].length);
  const title = readStr(objSrc, ti.index + ti[0].length);
  if (!name || !title) return null;
  const di = /\bdescription\s*:/.exec(objSrc);
  const description = di ? readStr(objSrc, di.index + di[0].length) : undefined;
  return { name, title, description: description || undefined };
}

function extractAccessibility(src: string): string[] | null {
  const start = src.indexOf('export const accessibility');
  if (start === -1) return null;
  const assignIdx = src.indexOf('= [', start);
  if (assignIdx === -1) return null;
  const arrOpen = assignIdx + 2;
  let depth = 1, i = arrOpen + 1;
  while (i < src.length && depth > 0) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') depth--;
    i++;
  }
  const arrContent = src.slice(arrOpen + 1, i - 1).trim();
  if (!arrContent) return [];
  const items: string[] = [];
  let j = 0;
  while (j < arrContent.length) {
    const ch = arrContent[j];
    if (ch === "'" || ch === '"' || ch === '`') {
      const delim = ch;
      let s = '', k = j + 1;
      while (k < arrContent.length) {
        const c = arrContent[k];
        if (c === '\\') { s += arrContent[k + 1] ?? ''; k += 2; continue; }
        if (c === delim) break;
        s += c; k++;
      }
      items.push(s);
      j = k + 1;
    } else {
      j++;
    }
  }
  return items;
}

// ─── File generator ────────────────────────────────────────────────────────────

function getFunctionSection(src: string): string {
  const demoMetaIdx = src.indexOf('\nexport const demoMeta');
  const fnSection = demoMetaIdx !== -1 ? src.slice(0, demoMetaIdx) : src;
  // Remove old ComponentDemo import, add defineDemos
  return fnSection
    .replace(/import type \{ ComponentDemo \} from ['"]\.\.\/\_registry['"];?\r?\n/g, '')
    .replace(/import \{ ComponentDemo \} from ['"]\.\.\/\_registry['"];?\r?\n/g, '')
    .trimEnd();
}

function buildDefineDemos(entries: ParsedEntry[]): string {
  const tuples = entries.map(({ name, title, description }) => {
    if (description) {
      const safe = description.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
      return `  [${name}, '${title}', { description: \`${safe}\` }],`;
    }
    return `  [${name}, '${title}'],`;
  });
  return ['export const demoMeta = defineDemos([', ...tuples, ']);'].join('\n');
}

function buildAccessibility(items: string[] | null): string {
  if (items === null) return '';
  if (items.length === 0) return '\nexport const accessibility: readonly string[] = [];\n';
  const lines = items.map((s) => {
    const safe = s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    return `  \`${safe}\`,`;
  });
  return ['\nexport const accessibility: readonly string[] = [', ...lines, '];\n'].join('\n');
}

function ensureDefineDemosImport(fnSection: string): string {
  if (fnSection.includes("from '../_registry'")) {
    // Merge defineDemos into the existing registry import
    return fnSection.replace(
      /import (?:type )?\{([^}]+)\} from '\.\.\/\_registry'/,
      (_, names: string) => {
        const parts = names.split(',').map((s) => s.trim()).filter(Boolean);
        if (!parts.includes('defineDemos')) parts.unshift('defineDemos');
        return `import { ${parts.join(', ')} } from '../_registry'`;
      }
    );
  }
  // Find the position of the last import STATEMENT end (`;` that ends an import).
  // Walk through the text and find the last `; ` / `;\n` following a `from '...'`.
  const importEndRegex = /^} from ['"][^'"]+['"];$/gm;
  const singleImportEndRegex = /^import [^;]+;$/gm;
  let lastEnd = -1;
  let m: RegExpExecArray | null;
  while ((m = importEndRegex.exec(fnSection)) !== null) {
    lastEnd = m.index + m[0].length;
  }
  while ((m = singleImportEndRegex.exec(fnSection)) !== null) {
    if (m.index + m[0].length > lastEnd) lastEnd = m.index + m[0].length;
  }
  if (lastEnd > 0) {
    return (
      fnSection.slice(0, lastEnd) +
      "\nimport { defineDemos } from '../_registry';" +
      fnSection.slice(lastEnd)
    );
  }
  return "import { defineDemos } from '../_registry';\n" + fnSection;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

function upgrade(filePath: string): boolean {
  const src = readFileSync(filePath, 'utf-8');
  if (src.includes('defineDemos(')) return false; // already upgraded

  const entries = parseEntries(src);
  if (entries.length === 0) return false;

  const accessibility = extractAccessibility(src);
  let fnSection = getFunctionSection(src);
  fnSection = ensureDefineDemosImport(fnSection);

  const output = fnSection + '\n\n' + buildDefineDemos(entries) + buildAccessibility(accessibility);
  writeFileSync(filePath, output);
  return true;
}

const slugs = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

console.log(`Upgrading ${slugs.length} components…\n`);
let count = 0;
for (const slug of slugs) {
  const f = join(COMPONENTS_DIR, slug, `${slug}.demos.tsx`);
  if (!existsSync(f)) continue;
  process.stdout.write(`[${slug}] `);
  const changed = upgrade(f);
  if (changed) { console.log('upgraded'); count++; }
  else console.log('skip');
}
console.log(`\nDone. Upgraded ${count} / ${slugs.length} files.`);
