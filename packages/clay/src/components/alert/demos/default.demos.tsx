'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@brika/clay/components/alert';
/** Plain alert with title and description, the baseline composition. */
export default function AlertDefaultDemo() {
  return (
    <Alert className="w-full max-w-md">
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        Your free trial ends in 3 days. Upgrade to keep access to all features.
      </AlertDescription>
    </Alert>
  );
}
