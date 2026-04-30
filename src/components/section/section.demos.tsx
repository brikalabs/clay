import { Badge } from '@brika/clay/components/badge';
import { Button } from '@brika/clay/components/button';
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionIcon,
  SectionInfo,
  SectionTitle,
} from '@brika/clay/components/section';
import { Server, Terminal } from 'lucide-react';
import { defineDemos } from '../_registry';

/** Section card with a header and body content. */
export function SectionDefaultDemo() {
  return (
    <Section className="w-full max-w-md">
      <SectionHeader>
        <SectionInfo>
          <SectionIcon>
            <Server className="size-4" />
          </SectionIcon>
          <div>
            <SectionTitle>Database</SectionTitle>
            <SectionDescription>PostgreSQL 16 — primary cluster</SectionDescription>
          </div>
        </SectionInfo>
      </SectionHeader>
      <SectionContent>
        <p className="text-muted-foreground text-sm">Connection pool: 18 / 100 active.</p>
      </SectionContent>
    </Section>
  );
}

/** Action button and a badge in the header's right slot — for settings panels with inline controls. */
export function SectionWithActionDemo() {
  return (
    <Section className="w-full max-w-md">
      <SectionHeader>
        <SectionInfo>
          <SectionIcon>
            <Terminal className="size-4" />
          </SectionIcon>
          <div>
            <SectionTitle>Hub Control</SectionTitle>
            <SectionDescription>Restart or stop the runtime process.</SectionDescription>
          </div>
        </SectionInfo>
        <div className="flex shrink-0 items-center gap-2">
          <Badge>PID 4823</Badge>
          <Button size="sm" variant="outline">
            Restart
          </Button>
        </div>
      </SectionHeader>
      <SectionContent>
        <p className="text-muted-foreground text-sm">Uptime: 14 days, 3 hours.</p>
      </SectionContent>
    </Section>
  );
}

export const demoMeta = defineDemos([
  [SectionDefaultDemo, 'Default', { description: `Section card with a header and body content.` }],
  [SectionWithActionDemo, 'With Action', { description: `Action button and a badge in the header's right slot — for settings panels with inline controls.` }],
]);
export const accessibility: readonly string[] = [
  `\`SectionTitle\` renders as \`<h2>\` by default — adjust via the \`as\` prop to maintain heading hierarchy.`,
  `Actions in the header slot should have descriptive labels matching the operation.`,
];
