'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@shared/ui/button';
import {
  ToggleAutomationStatusSchema,
  type ToggleAutomationStatusType,
} from '../model/validator';
import { toggleAutomationStatusAction } from '../api/toggle-automation-status.action';
import { RiLoader2Fill, RiPauseLine, RiPlayLine } from '@remixicon/react';

export const ToggleStatusButton = (
  props: ToggleAutomationStatusType & {
    isActive: boolean;
    variant?: 'outline' | 'ghost';
    size?: 'icon-sm' | 'sm';
    className?: string;
    title?: string;
  },
) => {
  const { id } = ToggleAutomationStatusSchema.parse(props);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleAutomationStatusAction({ id });

      if (res.success) {
        toast.success(res.data ? 'Automation activated' : 'Automation paused');
        router.refresh();
      } else {
        toast.error(res.error?.message || 'Failed to toggle automation status');
      }
    });
  };

  return (
    <Button
      variant={props.variant || 'outline'}
      size={props.size || 'icon-sm'}
      onClick={handleToggle}
      disabled={isPending}
      title={props.title}
      className={props.className}
    >
      {isPending ? (
        <RiLoader2Fill className="size-4 animate-spin" />
      ) : props.isActive ? (
        <RiPauseLine className="size-4" />
      ) : (
        <RiPlayLine className="size-4" />
      )}
    </Button>
  );
};
