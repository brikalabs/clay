import { SectionLabel } from '@brika/clay/components/section-label';
import { AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';
import { defineDemos } from '../_registry';

/** Simple uppercase group divider above a list of cards. */
export function SectionLabelDefaultDemo() {
  return <SectionLabel>Recent activity</SectionLabel>;
}

/** Semantic tones map to status colors — `destructive`, `warning`, `success`, `info`. */
export function SectionLabelTonesDemo() {
  return (
    <div className="flex flex-col gap-3">
      <SectionLabel tone="destructive" icon={AlertTriangle}>
        2 errors
      </SectionLabel>
      <SectionLabel tone="warning" icon={Zap}>
        1 needs attention
      </SectionLabel>
      <SectionLabel tone="success" icon={CheckCircle}>
        All checks passed
      </SectionLabel>
      <SectionLabel tone="info" icon={Info}>
        3 pending review
      </SectionLabel>
    </div>
  );
}

/** Inline count makes quantities scannable at a glance. */
export function SectionLabelWithCountDemo() {
  return (
    <div className="flex flex-col gap-3">
      <SectionLabel>Pipelines (12)</SectionLabel>
      <SectionLabel>Services (4)</SectionLabel>
    </div>
  );
}

export const demoMeta = defineDemos([
  [SectionLabelDefaultDemo, 'Default', { description: `Simple uppercase group divider above a list of cards.` }],
  [SectionLabelTonesDemo, 'Tones', { description: `Semantic tones map to status colors — \`destructive\`, \`warning\`, \`success\`, \`info\`.` }],
  [SectionLabelWithCountDemo, 'With Count', { description: `Inline count makes quantities scannable at a glance.` }],
]);
export const accessibility: readonly string[] = [
  `Renders as \`<p>\` by default — use \`as="h3"\` when it semantically introduces a group.`,
  `Tone colors are visual only; pair with an icon that has a meaningful \`aria-label\` when tone conveys status.`,
];
