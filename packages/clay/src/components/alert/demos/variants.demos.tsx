'use client';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@brika/clay/components/alert';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';

/** All five semantic variants stacked, each with matching icon and copy. */
export default function AlertVariantsDemo() {
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
