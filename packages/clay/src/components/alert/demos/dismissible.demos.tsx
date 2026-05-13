'use client';

import {
  Alert,
  AlertClose,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@brika/clay/components/alert';
import { Info } from 'lucide-react';
import { useState } from 'react';

/** Alert with a dismiss button, controlled visibility via useState. */
export default function AlertDismissibleDemo() {
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
