'use client';

import {
  Alert,
  AlertClose,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@brika/clay/components/alert';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { defineDemos } from '../_registry';

/** Plain alert with title and description — the baseline composition. */
export function AlertDefaultDemo() {
  return (
    <Alert className="w-full max-w-md">
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        Your free trial ends in 3 days. Upgrade to keep access to all features.
      </AlertDescription>
    </Alert>
  );
}

/** All five semantic variants stacked, each with matching icon and copy. */
export function AlertVariantsDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Alert>
        <AlertIcon><Info /></AlertIcon>
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Quiet card-style alert for neutral notices.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertIcon><Info /></AlertIcon>
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>A new version of the API is available.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertIcon><CheckCircle2 /></AlertIcon>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your changes have been published.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertIcon><TriangleAlert /></AlertIcon>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Storage is 90% full. Free up space to continue.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertIcon><AlertCircle /></AlertIcon>
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>Your account has been suspended.</AlertDescription>
      </Alert>
    </div>
  );
}

/** Error alert with a leading icon — compose AlertIcon before the text slots. */
export function AlertWithIconDemo() {
  return (
    <Alert variant="destructive" className="w-full max-w-md">
      <AlertIcon>
        <AlertCircle />
      </AlertIcon>
      <AlertTitle>Could not save changes</AlertTitle>
      <AlertDescription>
        Your session expired. Sign in again to continue.
      </AlertDescription>
    </Alert>
  );
}

/** Alert with a dismiss button — controlled visibility via useState. */
export function AlertDismissibleDemo() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <button
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        onClick={() => setVisible(true)}
      >
        Show alert again
      </button>
    );
  }

  return (
    <Alert variant="info" className="w-full max-w-md">
      <AlertIcon><Info /></AlertIcon>
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>
        The service will be unavailable on Sunday from 02:00 to 04:00 UTC.
      </AlertDescription>
      <AlertClose onClick={() => setVisible(false)} />
    </Alert>
  );
}

export const demoMeta = defineDemos([
  [AlertDefaultDemo, 'Default', { description: `Plain alert with title and description — the baseline composition.` }],
  [AlertVariantsDemo, 'Variants', { description: `All five semantic variants stacked, each with matching icon and copy.` }],
  [AlertWithIconDemo, 'With Icon', { description: `Error alert with a leading icon — compose AlertIcon before the text slots.` }],
  [AlertDismissibleDemo, 'Dismissible', { description: `Alert with a dismiss button — controlled visibility via useState.` }],
]);
export const accessibility: readonly string[] = [
  `Root carries \`role="alert"\` so live-region announcements fire on mount.`,
  `\`AlertTitle\` and \`AlertDescription\` are sibling elements — AT reads them as one block.`,
  `Icon inside \`AlertIcon\` is marked \`aria-hidden\`; the text content carries the meaning.`,
];
