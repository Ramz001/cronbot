import {
  RiTimeLine,
  RiCheckLine,
  RiCloseLine,
  RiLoader2Line,
  RiErrorWarningLine,
} from '@remixicon/react';

export const RUN_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'text-amber-500',
    bg: 'bg-amber-500/5 border-amber-500/20',
    Icon: RiTimeLine,
  },
  running: {
    label: 'Running',
    color: 'text-blue-500',
    bg: 'bg-blue-500/5 border-blue-500/20',
    Icon: RiLoader2Line,
  },
  success: {
    label: 'Success',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/5 border-emerald-500/20',
    Icon: RiCheckLine,
  },
  failed: {
    label: 'Failed',
    color: 'text-red-500',
    bg: 'bg-red-500/5 border-red-500/20',
    Icon: RiCloseLine,
  },
  skipped: {
    label: 'Skipped',
    color: 'text-muted-foreground',
    bg: 'bg-muted/30',
    Icon: RiErrorWarningLine,
  },
} as const;
