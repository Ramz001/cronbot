'use client'

import { useQuery } from '@tanstack/react-query'
import axios, { isAxiosError } from 'axios'
import {
  Play,
  Save,
  MessageSquare,
  ArrowDown,
  Trash2,
  Plus,
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

const ACTIONS = [
  {
    id: 'discord',
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

  // Fetch Guilds
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
    // Don't retry if the backend says the token isn't found
    retry: (failureCount, error) => {
      if (isAxiosError(error) && error.response?.status === 404) return false
      return failureCount < 3
    },
  })

  const isDiscordNotLinked =
    isAxiosError(guildsError) && guildsError.response?.status === 404

  // Fetch Channels for the selected guild
  const { data: channelsResponse, isLoading: isLoadingChannels } = useQuery({
    queryKey: ['discord-channels', guildId],
    queryFn: async () => {
      const res = await axios.get(`/api/discord/guilds/${guildId}`)
      return res.data.data
    },
    enabled: !!guildId,
  })

  return (
    <div className="bg-background flex h-full w-full flex-col">
      {/* Top Header */}
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

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="border-border/50 bg-background/50 flex w-72 flex-col border-r">
          <ScrollArea className="flex-1">
            <div className="space-y-6 p-4">
              {/* Actions Section */}
              <div>
                <h2 className="text-muted-foreground mb-3 text-xs font-bold tracking-wider uppercase">
                  Available Actions
                </h2>
                <div className="space-y-1">
                  {ACTIONS.map((a) => {
                    const Icon = a.icon
                    const isActive = action === a.id
                    return (
                      <button
                        key={a.id}
                        onClick={() => setAction(a.id)}
                        className={`hover:bg-muted/50 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-muted/80 font-medium'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <div className="bg-background border-border/50 flex size-7 items-center justify-center rounded-md border shadow-sm">
                          <Icon className={`size-4 ${a.color}`} />
                        </div>
                        {a.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Main Canvas */}
        <div className="bg-muted/10 relative flex-1 overflow-y-auto p-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center pb-20">
            {/* Entry Node */}
            <div className="border-border/50 bg-background flex items-center gap-3 rounded-full border px-6 py-3 shadow-sm">
              <Workflow className="text-muted-foreground size-4" />
              <span className="text-sm font-medium">
                Workflow Execution Starts
              </span>
            </div>

            <div className="py-4">
              <ArrowDown className="text-muted-foreground size-5" />
            </div>

            {/* Action Node */}
            {action === 'discord' ? (
              <Card className="border-border/50 w-full max-w-md shadow-sm">
                <div className="border-border/50 bg-muted/20 flex items-center justify-between border-b px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-500">
                      <MessageSquare className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Discord Action</h3>
                      <p className="text-muted-foreground text-xs">
                        Send a message to a channel
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground h-8 w-8"
                    onClick={() => setAction(null)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="space-y-4 p-4">
                  {isDiscordNotLinked ? (
                    <div className="border-destructive/50 bg-destructive/10 rounded-md border border-dashed p-4 text-center">
                      <p className="text-destructive text-sm font-medium">
                        Discord not connected
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Please link your Discord account to use this action.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs">Select Guild (Server)</Label>
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
                        <div className="space-y-2">
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
                                <SelectItem key={channel.id} value={channel.id}>
                                  #{channel.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-xs">Message Content</Label>
                        <Textarea
                          className="min-h-25 resize-none"
                          placeholder="Type your message here..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                        <p className="text-muted-foreground mt-1 text-[10px]">
                          Markdown is supported in future updates.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ) : action ? (
              <Card className="flex w-full max-w-md flex-col items-center justify-center gap-3 border-2 border-dashed bg-transparent p-8 shadow-sm">
                <div className="bg-muted rounded-full p-4">
                  <Plus className="text-muted-foreground size-6" />
                </div>
                <h3 className="font-medium">Action Selected</h3>
                <p className="text-muted-foreground text-sm">
                  Configure the selected action details
                </p>
              </Card>
            ) : (
              <Card className="flex w-full max-w-md flex-col items-center justify-center gap-3 border-2 border-dashed bg-transparent p-8 shadow-sm">
                <div className="bg-muted rounded-full p-4">
                  <Plus className="text-muted-foreground size-6" />
                </div>
                <h3 className="font-medium">Add an Action</h3>
                <p className="text-muted-foreground text-sm">
                  Select an action to continue the workflow
                </p>
              </Card>
            )}

            {action && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  className="text-muted-foreground gap-2 border-dashed"
                >
                  <Plus className="size-4" />
                  Add next step
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
