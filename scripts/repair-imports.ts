/**
 * Repairs .demos.tsx files where `import { defineDemos }` was injected
 * at the wrong position (inside a multi-line import block).
 *
 * Run: bun scripts/repair-imports.ts
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const COMPONENTS_DIR = 'src/components';
const BAD_LINE = "import { defineDemos } from '../_registry';";

function repair(filePath: string): boolean {
  const src = readFileSync(filePath, 'utf-8');

  // Already clean?
  if (!src.includes(BAD_LINE)) return false;

  // Remove all occurrences of the bad import line
  let cleaned = src.split('\n').filter((l) => l.trim() !== BAD_LINE).join('\n');

  // Also handle old ComponentDemo type import if still present
  cleaned = cleaned.replace(/import type \{ ComponentDemo \} from '\.\.\/\_registry';\n/g, '');

  // Already has defineDemos from a registry import? Merge it in.
  if (cleaned.includes("from '../_registry'")) {
    cleaned = cleaned.replace(
      /import (?:type )?\{([^}]+)\} from '\.\.\/\_registry'/,
      (_, names: string) => {
        const parts = names.split(',').map((s) => s.trim()).filter(Boolean);
        if (!parts.includes('defineDemos')) parts.unshift('defineDemos');
        return `import { ${parts.join(', ')} } from '../_registry'`;
      }
    );
    writeFileSync(filePath, cleaned);
    return true;
  }

  // Find the end of the last import statement.
  // Strategy: find the last `} from '...';\n` (multi-line) or `import ...;\n` (single-line).
  const lines = cleaned.split('\n');
  let lastImportEnd = -1;
  let inMultilineImport = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('import ') && line.includes('{') && !line.includes('}')) {
      inMultilineImport = true;
    }
    if (inMultilineImport && line.match(/^} from ['"][^'"]+['"];/)) {
      lastImportEnd = i;
      inMultilineImport = false;
    } else if (!inMultilineImport && line.startsWith('import ') && line.endsWith(';')) {
      lastImportEnd = i;
    }
  }

  if (lastImportEnd >= 0) {
    lines.splice(lastImportEnd + 1, 0, BAD_LINE);
  } else {
    lines.unshift(BAD_LINE);
  }

  writeFileSync(filePath, lines.join('\n'));
  return true;
}

const slugs = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

let fixed = 0;
for (const slug of slugs) {
  const f = join(COMPONENTS_DIR, slug, `${slug}.demos.tsx`);
  if (!existsSync(f)) continue;
  if (repair(f)) {
    console.log(`Fixed: ${slug}`);
    fixed++;
  }
}
console.log(`\nRepaired ${fixed} files.`);
