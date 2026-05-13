import { SectionLabel } from '@brika/clay/components/section-label';
import { AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';

/** Semantic tones map to status colors, `destructive`, `warning`, `success`, `info`. */
export default function SectionLabelTonesDemo() {
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
