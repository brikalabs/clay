'use client';

import { ProgressDisplay } from '@brika/clay/components/progress-display';
import { useRef } from 'react';

/** Success state, bar turns green and an optional success message is shown. */
export default function ProgressDisplaySuccessDemo() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="w-full max-w-md">
      <ProgressDisplay
        progressValue={100}
        phaseLabel="Deployment complete"
        logs={[
          'Building Docker image',
          'Pushing to registry',
          'Container started',
          'Health check passed',
        ]}
        scrollRef={scrollRef}
        error={null}
        success
        isProcessing={false}
        successMessage="Deployed successfully to production. Traffic is being routed."
      />
    </div>
  );
}
