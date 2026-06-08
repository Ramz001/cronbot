'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@shared/ui/alert-dialog'
import { Button } from '@shared/ui/button'
import {
  DeleteIntegrationSchema,
  DeleteIntegrationType,
} from '../model/validator'
import { deleteIntegrationAction } from '../api/delete-integration.action'

export const DeleteIntegrationButton = (props: DeleteIntegrationType) => {
  const { id } = DeleteIntegrationSchema.parse(props)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteIntegrationAction({ id })

      if (res.success) {
        toast.success('Integration deleted successfully')
        router.refresh()
      } else {
        toast.error(res.error?.message || 'Failed to delete integration')
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending}>
          {isPending ? 'Deleting...' : 'Delete'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Integration</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this integration? This action cannot
            be undone. The associated bot token will be revoked immediately.
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
  )
}
