'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@shared/ui/alert-dialog';
import { Button } from '@shared/ui/button';
import {
  DeleteAutomationSchema,
  type DeleteAutomationType,
} from '../model/validator';
import { deleteAutomationAction } from '../api/delete-automation.action';
import { RiDeleteBin2Line, RiLoader2Fill } from '@remixicon/react';

export const DeleteButton = (props: DeleteAutomationType) => {
  const { id } = DeleteAutomationSchema.parse(props);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteAutomationAction({ id });

      if (res.success) {
        toast.success('Automation deleted successfully');
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error?.message || 'Failed to delete automation');
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isPending}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          {isPending ? (
            <RiLoader2Fill className="size-4 animate-spin" />
          ) : (
            <RiDeleteBin2Line className="size-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Automation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this automation? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogTrigger>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
