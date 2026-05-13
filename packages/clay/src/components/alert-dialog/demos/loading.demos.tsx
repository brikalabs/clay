'use client';

import {
  AlertDialog,
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

/** Controlled dialog where the confirm button shows a loading state while the action runs. */
export default function AlertDialogLoadingDemo() {
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
