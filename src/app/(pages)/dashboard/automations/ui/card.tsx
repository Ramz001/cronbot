'use client'

import {
  RiPlayLine,
  RiPauseLine,
  RiDeleteBin2Line,
  RiTimeLine,
  RiLoader2Line,
  RiPlayCircleLine,
} from '@remixicon/react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Automation } from '@prisma/generated/client'
import { cn } from '@shared/utils/cn'
import { getProvider } from '@entities/provider-registry'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { handleError } from '@shared/utils/handle-error'
import { BodySchema, IdentifierSchema } from '@entities/discord/client'
import { InfoModal } from './info-modal'
import { useState } from 'react'
import { DeleteAutomationButton } from '@features/delete-automation'
import { ToggleAutomationStatusButton } from '@features/toggle-automation-status'

function AutomationCard({ automation }: { automation: Automation }) {
  const [infoModal, setInfoModal] = useState(false)

  const { data: identifierData, success: identifierSuccess } =
    IdentifierSchema.safeParse(automation.identifier)

  const { data: bodyData, success: bodySuccess } = BodySchema.safeParse(
    automation.body
  )

  const canTest = identifierSuccess && bodySuccess

  const testMutation = useMutation({
    mutationFn: async ({
      channelId,
      message,
    }: {
      channelId: string
      message: string
    }) =>
      await axios.post('/api/discord/send', {
        channelId,
        message,
      }),
    onSuccess: () => {
      toast.success('Test message sent successfully!')
    },
    onError: (err) => {
      handleError(err)
    },
  })
  const handleSendTest = () => {
    if (!identifierSuccess || !bodySuccess)
      return toast.warning('Incomplete configuration for testing')

    testMutation.mutate({
      channelId: identifierData.channelId,
      message: bodyData.message,
    })
  }

  const provider = getProvider(automation.provider)

  if (!provider) {
    return (
      <Card size="sm" className="relative overflow-hidden">
        <CardContent className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">
            Unknown provider: {automation.provider}
          </span>
        </CardContent>
      </Card>
    )
  }

  const { label, color, icon: ProviderIcon } = provider

  return (
    <Card
      size="sm"
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:shadow-lg',
        automation.isActive && 'border-l-[3px]'
      )}
      style={
        automation.isActive
          ? ({ borderLeftColor: color } as React.CSSProperties)
          : {}
      }
      onClick={() => setInfoModal(true)}
    >
      {/* Subtle gradient accent on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
        }}
      />

      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {/* Provider icon badge */}
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors',
              automation.isActive
                ? 'text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
            style={automation.isActive ? { backgroundColor: color } : undefined}
          >
            <ProviderIcon className="size-5" />
          </div>

          {/* Automation info */}
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold">
                {automation.name || 'Unnamed Automation'}
              </h3>
              <span
                className={cn(
                  'inline-block size-1.5 shrink-0 rounded-full',
                  automation.isActive
                    ? 'bg-emerald-500'
                    : 'bg-muted-foreground/30'
                )}
              />
              <Badge
                variant={automation.isActive ? 'default' : 'secondary'}
                className="h-5 px-1.5 text-[11px] leading-none font-medium capitalize"
              >
                {automation.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1">
                <RiTimeLine className="size-3" />
                <span>
                  Last run:{' '}
                  {automation.lastRunAt
                    ? new Date(automation.lastRunAt).toLocaleString()
                    : 'Never'}
                </span>
              </span>
              <span className="text-muted-foreground/20">·</span>
              <span className="truncate">{label}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div
          className="flex shrink-0 items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <ToggleAutomationStatusButton
            isActive={automation.isActive}
            id={automation.id}
            variant="outline"
            size="icon-sm"
            title={automation.isActive ? 'Pause' : 'Resume'}
          />

          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleSendTest}
            disabled={testMutation.isPending || !canTest}
            title={canTest ? 'Test automation' : 'Incomplete configuration'}
          >
            {testMutation.isPending ? (
              <RiLoader2Line className="size-4 animate-spin" />
            ) : (
              <RiPlayCircleLine className="size-4" />
            )}
          </Button>
          <InfoModal
            provider={provider}
            automation={automation}
            open={infoModal}
            onOpenChange={setInfoModal}
          />
          <DeleteAutomationButton id={automation.id} />
        </div>
      </CardContent>
    </Card>
  )
}

export default AutomationCard
