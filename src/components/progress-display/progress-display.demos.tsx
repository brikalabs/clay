'use client';

import { ProgressDisplay } from '@brika/clay/components/progress-display';
import { useRef } from 'react';
import { defineDemos } from '../_registry';

/** In-progress state — spinner, phase label, and a live log stream. */
export function ProgressDisplayDefaultDemo() {
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

/** Success state — bar turns green and an optional success message is shown. */
export function ProgressDisplaySuccessDemo() {
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

/** Error state — bar turns destructive and the error message block appears. */
export function ProgressDisplayErrorDemo() {
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

export const demoMeta = defineDemos([
  [ProgressDisplayDefaultDemo, 'Default', { description: `In-progress state — spinner, phase label, and a live log stream.` }],
  [ProgressDisplaySuccessDemo, 'Success', { description: `Success state — bar turns green and an optional success message is shown.` }],
  [ProgressDisplayErrorDemo, 'Error', { description: `Error state — bar turns destructive and the error message block appears.` }],
]);
export const accessibility: readonly string[] = [
  `Log entries update via a live region — AT announces new lines as they stream in.`,
  `Error and success states should also be communicated via a \`toast\` or \`alert\` for AT users in background contexts.`,
  `The scrollable log area should be reachable by keyboard when it overflows.`,
];
