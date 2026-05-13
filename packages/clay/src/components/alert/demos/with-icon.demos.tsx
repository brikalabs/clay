'use client';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@brika/clay/components/alert';
import { AlertCircle } from 'lucide-react';

/** Error alert with a leading icon, compose AlertIcon before the text slots. */
export default function AlertWithIconDemo() {
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
