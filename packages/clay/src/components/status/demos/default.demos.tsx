'use client';

import { Status, StatusIndicator, StatusLabel } from '@brika/clay/components/status';

/** A status pill: a pulsing colored dot plus your own label. */
export default function StatusDefaultDemo() {
  return (
    <Status variant="success">
      <StatusIndicator />
      <StatusLabel>Operational</StatusLabel>
    </Status>
  );
}
