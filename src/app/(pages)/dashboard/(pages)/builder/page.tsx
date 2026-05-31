'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios, { isAxiosError } from 'axios'
import {
  DndContext,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core'
import {
  Play,
  Save,
  MessageSquare,
  ArrowDown,
  Trash2,
  Workflow,
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { ScrollArea } from '@/shared/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import { useBuilderStore } from './store'

import ActionItem from './components/ActionItem'
import DraggableActionItem from './components/DraggableActionItem'
import { Provider } from '@prisma/generated/enums'

const ACTIONS = [
  {
    id: Provider.discord,
    label: 'Send Discord Message',
    icon: MessageSquare,
    color: 'text-indigo-500',
  },
]

export default function BuilderPage() {
  const {
    action,
    guildId,
    channelId,
    message,
    setAction,
    setGuildId,
    setChannelId,
    setMessage,
  } = useBuilderStore()

  const {
    data: guildsResponse,
    isLoading: isLoadingGuilds,
    error: guildsError,
  } = useQuery({
    queryKey: ['discord-guilds'],
    queryFn: async () => {
      const res = await axios.get('/api/discord/guilds')
      return res.data.data
    },
    retry: (failureCount, error) => {
      if (
        isAxiosError(error) &&
        (error.response?.status === 404 || error.response?.status === 401)
      )
        return false
      return failureCount < 3
    },
  })

  const isDiscordNotLinked =
    isAxiosError(guildsError) && guildsError.response?.status === 404
  const hasTokenExpired =
    isAxiosError(guildsError) && guildsError.response?.status === 401

  const { data: channelsResponse, isLoading: isLoadingChannels } = useQuery({
    queryKey: ['discord-channels', guildId],
    queryFn: async () => {
      const res = await axios.get(`/api/discord/guilds/${guildId}`)
      return res.data.data
    },
    enabled: !!guildId,
  })

  const { setNodeRef: setCanvasRef, isOver } = useDroppable({
    id: 'canvas-dropzone',
  })

  const [activeId, setActiveId] = useState(null as string | null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleDragStart(e: DragStartEvent) {
    setActiveId(e.active.id as string)
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    setActiveId(null)
    if (over && over.id === 'canvas-dropzone') setAction(active.id as string)
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  return (
    <div className="bg-background flex h-full w-full flex-col">
      <header className="border-border/50 flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Workflow Builder</h1>
          <p className="text-muted-foreground text-sm">
            Define what happens when this workflow runs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Play className="size-4" />
            Test Workflow
          </Button>
          <Button size="sm" className="gap-2">
            <Save className="size-4" />
            Save Workflow
          </Button>
        </div>
      </header>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex flex-1 overflow-hidden">
          <aside className="border-border/50 bg-background/50 w-72 border-r">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h2 className="text-muted-foreground mb-3 text-xs font-bold tracking-wider uppercase">
                  Available Actions
                </h2>
                <div className="space-y-1">
                  {ACTIONS.map((a) => (
                    <DraggableActionItem
                      key={a.id}
                      a={a}
                      isActive={action === a.id}
                      onClick={() => setAction(a.id)}
                    />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </aside>

          <main
            ref={setCanvasRef}
            className={`flex-1 overflow-y-auto p-8 ${isOver ? 'bg-muted/30 ring-primary/20 ring-2 ring-inset' : ''}`}
          >
            <div className="mx-auto flex max-w-2xl flex-col items-center">
              <div className="flex items-center gap-3 rounded-full border px-6 py-3 shadow-sm">
                <Workflow className="text-muted-foreground size-4" />
                <span className="text-sm font-medium">
                  Workflow Execution Starts
                </span>
              </div>

              <div className="py-4">
                <ArrowDown className="text-muted-foreground size-5" />
              </div>

              {/* Action content (unchanged) */}
              {action === 'discord' ? (
                <Card className="w-full max-w-md">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-500">
                        <MessageSquare className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">
                          Discord Action
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          Send a message to a channel
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setAction(null)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    {isDiscordNotLinked ? (
                      <div className="border border-dashed p-4 text-center">
                        Discord not connected
                      </div>
                    ) : hasTokenExpired ? (
                      <div className="border border-dashed p-4 text-center">
                        Token expired
                      </div>
                    ) : (
                      <>
                        <div className="mb-4">
                          <Label className="text-xs">
                            Select Guild (Server)
                          </Label>
                          <Select
                            value={guildId || ''}
                            onValueChange={setGuildId}
                            disabled={isLoadingGuilds}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  isLoadingGuilds
                                    ? 'Loading guilds...'
                                    : 'Select server'
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {guildsResponse?.map((guild: any) => (
                                <SelectItem key={guild.id} value={guild.id}>
                                  {guild.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {guildId && (
                          <div className="mb-4">
                            <Label className="text-xs">Select Channel</Label>
                            <Select
                              value={channelId || ''}
                              onValueChange={setChannelId}
                              disabled={isLoadingChannels}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={
                                    isLoadingChannels
                                      ? 'Loading channels...'
                                      : 'Select channel'
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {channelsResponse?.map((channel: any) => (
                                  <SelectItem
                                    key={channel.id}
                                    value={channel.id}
                                  >
                                    #{channel.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div>
                          <Label className="text-xs">Message Content</Label>
                          <Textarea
                            className="min-h-25 resize-none"
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              ) : (
                <Card className="w-full max-w-md">
                  <div className="p-8 text-center">
                    Select an action to continue the workflow
                  </div>
                </Card>
              )}
            </div>
          </main>
        </div>

        <DragOverlay>
          {activeId ? (
            <ActionItem
              a={ACTIONS.find((a) => a.id === activeId)}
              isActive={false}
              className="w-72"
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
