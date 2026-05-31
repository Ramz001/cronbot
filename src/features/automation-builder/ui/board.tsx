'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios, { isAxiosError } from 'axios'
// icons replaced with remixicon font classes (see global import in globals.css)
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import { useBuilderStore } from '../model/store'
import {
  RiFlowChart,
  RiArrowDownSLine,
  RiMessageLine,
  RiDeleteBin2Line,
} from '@remixicon/react'

const AutomationCreationBoard = () => {
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

  return (
    <main className={`flex-1 overflow-y-auto p-8`}>
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <div className="flex items-center gap-3 rounded-full border px-6 py-3 shadow-sm">
          <RiFlowChart className="text-muted-foreground size-4" />
          <span className="text-sm font-medium">
            Automation Execution Starts
          </span>
        </div>

        <div className="py-4">
          <RiArrowDownSLine className="text-muted-foreground size-5" />
        </div>

        {/* Action content (unchanged) */}
        {action === 'discord' ? (
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-500">
                  <RiMessageLine className="size-5" />
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
                className="h-8 w-8"
                onClick={() => setAction(null)}
              >
                <RiDeleteBin2Line className="size-4" />
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
                            <SelectItem key={channel.id} value={channel.id}>
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
  )
}

export default AutomationCreationBoard
