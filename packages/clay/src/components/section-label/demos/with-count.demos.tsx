import { SectionLabel } from '@brika/clay/components/section-label';

/** Inline count makes quantities scannable at a glance. */
export default function SectionLabelWithCountDemo() {
  return (
    <div className="flex flex-col gap-3">
      <SectionLabel>Pipelines (12)</SectionLabel>
      <SectionLabel>Services (4)</SectionLabel>
    </div>
  );
}
