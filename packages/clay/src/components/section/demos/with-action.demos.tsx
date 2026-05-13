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
import { Terminal } from 'lucide-react';

/** Action button and a badge in the header's right slot, for settings panels with inline controls. */
export default function SectionWithActionDemo() {
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
