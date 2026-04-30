'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@brika/clay/components/alert-dialog';
import { Button } from '@brika/clay/components/button';
import { useState } from 'react';
import { defineDemos } from '../_registry';

/** Destructive confirmation dialog — blocks all interaction until the user resolves it. */
export function AlertDialogDefaultDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this account?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent. All your projects, history, and data will
            be removed and cannot be recovered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete account</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Controlled dialog where the confirm button shows a loading state while the action runs. */
export function AlertDialogLoadingDemo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleConfirm() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1500);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Remove workspace</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove workspace?</AlertDialogTitle>
          <AlertDialogDescription>
            All members will lose access immediately. Workspace settings and
            integrations will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading ? 'Removing…' : 'Remove workspace'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const demoMeta = defineDemos([
  [AlertDialogDefaultDemo, 'Default', { description: `Destructive confirmation dialog — blocks all interaction until the user resolves it.` }],
  [AlertDialogLoadingDemo, 'Loading', { description: `Controlled dialog where the confirm button shows a loading state while the action runs.` }],
]);
export const accessibility: readonly string[] = [
  `Unlike \`Dialog\`, \`AlertDialog\` does not close on backdrop click — the user must explicitly respond.`,
  `Focus defaults to the cancel action on open, reducing accidental destructive confirmations.`,
  `\`AlertDialogTitle\` and \`AlertDialogDescription\` are announced immediately when the dialog opens.`,
  `Only two outcomes are possible: confirm or cancel. Do not add other interactive elements.`,
];
