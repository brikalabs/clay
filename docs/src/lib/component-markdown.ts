/**
 * Sections must mirror `pages/components/[slug].astro` so the `.md` view
 * stays in sync with what humans see on the rendered page.
 */

import type { ComponentDemo } from '@brika/clay';
import type { ResolvedTokenSpec } from '@brika/clay/tokens';
import type { ComponentEntry } from './component-registry';
import { componentSourceUrl } from './github';
import type { ClayComponentDoc, ClayPropDoc } from './vite-plugin-clay-docgen';

interface RenderInput {
  readonly component: ComponentEntry;
  readonly docgen: readonly ClayComponentDoc[];
  readonly tokens: readonly ResolvedTokenSpec[];
}

export function renderComponentMarkdown({ component, docgen, tokens }: RenderInput): string {
  const codeId = component.displayName.replaceAll(/\s+/g, '');
  const [heroDemo, ...moreDemos] = component.demos;
  const sections = [
    headerSection(component),
    installSection(component),
    usageSection(heroDemo),
    examplesSection(moreDemos),
    accessibilitySection(component.accessibility ?? []),
    tokensSection(component.displayName, tokens),
    apiSection(codeId, docgen),
  ];
  return `${sections.filter(Boolean).join('\n').trimEnd()}\n`;
}

const MARKDOWN_HEADERS = { 'Content-Type': 'text/markdown; charset=utf-8' } as const;

export function markdownResponse(body: string): Response {
  return new Response(body, { headers: MARKDOWN_HEADERS });
}

function headerSection(component: ComponentEntry): string {
  return `# ${component.name}\n\n${component.description}\n\nSource: ${componentSourceUrl(component.slug)}\n`;
}

function installSection(component: ComponentEntry): string {
  const id = component.displayName.replaceAll(/\s+/g, '');
  return [
    '## Install',
    '',
    '```ts',
    `import { ${id} } from "@brika/clay";`,
    '```',
    '',
    'Granular import:',
    '',
    '```ts',
    `import { ${id} } from "@brika/clay/components/${component.slug}";`,
    '```',
    '',
  ].join('\n');
}

function usageSection(demo: ComponentDemo | undefined): string {
  if (!demo) {
    return '';
  }
  return ['## Usage', '', '```tsx', demo.code, '```', ''].join('\n');
}

function examplesSection(demos: readonly ComponentDemo[]): string {
  if (demos.length === 0) {
    return '';
  }
  const blocks = demos.map((demo) => {
    const description = demo.description ? `${demo.description}\n\n` : '';
    return `### ${demo.title}\n\n${description}\`\`\`tsx\n${demo.code}\n\`\`\`\n`;
  });
  return ['## Examples', '', ...blocks].join('\n');
}

function accessibilitySection(items: readonly string[]): string {
  if (items.length === 0) {
    return '';
  }
  const bullets = items.map((item) => `- ${item}`).join('\n');
  return `## Accessibility\n\n${bullets}\n`;
}

function tokensSection(name: string, tokens: readonly ResolvedTokenSpec[]): string {
  if (tokens.length === 0) {
    return '';
  }
  const intro = `Every CSS variable ${name} reads, with its default and the dotted path you'd write in a \`ThemeConfig\` to override it.`;
  const rows = tokens.map((token) => {
    const path = token.themePath ? `\`${token.themePath}\`` : '-';
    return `| \`--${token.name}\` | \`${token.defaultLight}\` | ${path} |`;
  });
  return [
    '## Theme tokens',
    '',
    intro,
    '',
    '| Variable | Default (light) | Theme path |',
    '| --- | --- | --- |',
    ...rows,
    '',
  ].join('\n');
}

function apiSection(name: string, docs: readonly ClayComponentDoc[]): string {
  if (docs.length === 0) {
    return `## API reference\n\n\`${name}\` exposes no wrapper-specific props, all attributes pass through to the underlying primitive.\n`;
  }
  const showHeadings = docs.length > 1;
  const sections = docs.flatMap((doc) => {
    const heading = showHeadings ? [`### ${doc.displayName}`, ''] : [];
    const propLevel = showHeadings ? 4 : 3;
    if (doc.props.length === 0) {
      return [...heading, `No wrapper-specific props, passes through to the underlying primitive.\n`];
    }
    return [...heading, ...doc.props.map((p) => propBlock(p, propLevel))];
  });
  return ['## API reference', '', ...sections].join('\n');
}

function propBlock(prop: ClayPropDoc, headingLevel = 3): string {
  const required = prop.required ? ' (required)' : '';
  const h = '#'.repeat(headingLevel);
  const lines = [`${h} \`${prop.name}\`${required}`, '', `- Type: \`${prop.type}\``];
  if (prop.defaultValue !== null) {
    lines.push(`- Default: \`${prop.defaultValue}\``);
  }
  lines.push('');
  if (prop.description) {
    lines.push(prop.description, '');
  }
  return lines.join('\n');
}
