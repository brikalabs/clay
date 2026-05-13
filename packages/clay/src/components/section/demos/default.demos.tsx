import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionIcon,
  SectionInfo,
  SectionTitle,
} from '@brika/clay/components/section';
import { Server } from 'lucide-react';

/** Section card with a header and body content. */
export default function SectionDefaultDemo() {
  return (
    <Section className="w-full max-w-md">
      <SectionHeader>
        <SectionInfo>
          <SectionIcon>
            <Server className="size-4" />
          </SectionIcon>
          <div>
            <SectionTitle>Database</SectionTitle>
            <SectionDescription>PostgreSQL 16, primary cluster</SectionDescription>
          </div>
        </SectionInfo>
      </SectionHeader>
      <SectionContent>
        <p className="text-muted-foreground text-sm">Connection pool: 18 / 100 active.</p>
      </SectionContent>
    </Section>
  );
}
