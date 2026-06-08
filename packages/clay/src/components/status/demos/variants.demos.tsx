'use client';

import { Status, StatusIndicator, StatusLabel } from '@brika/clay/components/status';

/** Pick a semantic tone — success, warning, info, destructive, or neutral — and label it yourself. */
export default function StatusVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Status variant="success">
        <StatusIndicator />
        <StatusLabel>Operational</StatusLabel>
      </Status>
      <Status variant="warning">
        <StatusIndicator />
        <StatusLabel>Degraded</StatusLabel>
      </Status>
      <Status variant="info">
        <StatusIndicator />
        <StatusLabel>Maintenance</StatusLabel>
      </Status>
      <Status variant="destructive">
        <StatusIndicator />
        <StatusLabel>Major outage</StatusLabel>
      </Status>
      <Status variant="neutral">
        <StatusIndicator pulse={false} />
        <StatusLabel>Offline</StatusLabel>
      </Status>
    </div>
  );
}
