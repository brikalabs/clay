'use client';

import { ProgressDisplay } from '@brika/clay/components/progress-display';
import { useRef } from 'react';

/** Error state, bar turns destructive and the error message block appears. */
export default function ProgressDisplayErrorDemo() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="w-full max-w-md">
      <ProgressDisplay
        progressValue={35}
        phaseLabel="Deployment failed"
        logs={[
          'Building Docker image',
          'Pushing to registry',
          'Container failed to start',
        ]}
        scrollRef={scrollRef}
        error="Exit code 1: health check timed out after 30s. The container is not responding on port 8080."
        success={false}
        isProcessing={false}
      />
    </div>
  );
}
