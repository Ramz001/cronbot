import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { Automation } from '@prisma/generated/client'
import { RiFileTextLine } from '@remixicon/react'
import { IdentifierSchema, BodySchema } from '@entities/discord/client'
import { ProviderType } from '@entities/provider-registry'

export const InfoModal = ({
  automation,
  provider,
  open,
  onOpenChange,
}: {
  automation: Automation
  provider: ProviderType
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const { label, color, icon: ProviderIcon } = provider
  const identifierResult = IdentifierSchema.safeParse(automation.identifier)
  const { channelId, guildId } = identifierResult.success
    ? identifierResult.data
    : {}
  const bodyResult = BodySchema.safeParse(automation.body)
  const bodyData = bodyResult.success ? bodyResult.data : { message: '' }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-sm" title="View message body">
          <RiFileTextLine className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-4 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{automation.name || 'Unnamed Automation'}</DialogTitle>
        </DialogHeader>

        {/* Provider & Channel info */}
        <div className="rounded-xl border p-3">
          <div className="flex items-center gap-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: color }}
            >
              <ProviderIcon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">{label}</p>
            </div>
          </div>
          <div className="mt-2 space-y-1 pl-12">
            {guildId && (
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="w-12 shrink-0">Server</span>
                <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                  {guildId}
                </code>
              </div>
            )}
            {channelId && (
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="w-12 shrink-0">Channel</span>
                <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                  {channelId}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Message body preview */}
        <div className="space-y-1.5">
          <p className="text-muted-foreground text-xs font-medium">
            Message Body
          </p>
          <div className="bg-muted/50 max-h-64 min-h-16 overflow-y-auto rounded-xl border p-3 text-sm wrap-break-word whitespace-pre-wrap">
            {bodyData?.message || (
              <span className="text-muted-foreground italic">
                No message content
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
