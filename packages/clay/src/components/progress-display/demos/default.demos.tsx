'use client';

import { ProgressDisplay } from '@brika/clay/components/progress-display';
import { useRef } from 'react';

/** In-progress state, spinner, phase label, and a live log stream. */
export default function ProgressDisplayDefaultDemo() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="w-full max-w-md">
      <ProgressDisplay
        progressValue={48}
        phaseLabel="Deploying to production…"
        logs={[
          'Building Docker image',
          'Pushing to registry (sha256:a3f7…)',
          'Starting container on us-east-1a',
          'Health check: waiting for /healthz',
        ]}
        scrollRef={scrollRef}
        error={null}
        success={false}
        isProcessing
      />
    </div>
  );
}
