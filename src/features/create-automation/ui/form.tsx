'use client'

import { useForm, useStore } from '@tanstack/react-form'
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Field, FieldLabel, FieldContent, FieldError } from '@/shared/ui/field'
import { Provider } from '@prisma/generated/enums'
import { cn } from '@shared/utils/cn'
import { RiHashtag, RiLoader2Line } from '@remixicon/react'
import { PROVIDERS } from '@entities/provider-registry'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { handleError } from '@shared/utils/handle-error'
import { createAutomation } from '../api/create-automation.action'
import { CreateAutomationType } from '../model/validator'
import { ChannelType, GuildType } from '@entities/discord/model/types'

export const CreateAutomationForm = ({ guilds }: { guilds: GuildType[] }) => {
  const form = useForm({
    defaultValues: {
      name: '',
      provider: Provider.discord,
      identifier: { guildId: '', channelId: '' },
      body: { message: '' },
    },
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(value)
    },
  })

  const selectedGuildId = useStore(
    form.baseStore,
    (state) => state.values.identifier.guildId
  )

  const createMutation = useMutation({
    mutationFn: async (values: CreateAutomationType) => {
      const result = await createAutomation(values)
      if (!result.success) {
        throw new Error(result.error.message)
      }
      return result
    },
    onSuccess: () => {
      toast.success('Automation created successfully!')
      form.reset()
    },
    onError: (err) => {
      handleError(err)
    },
  })

  const {
    data: channels = [],
    isLoading: isLoadingChannels,
    error: channelsError,
  } = useQuery<ChannelType[]>({
    queryKey: ['discord-channels', selectedGuildId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/discord/guilds/${selectedGuildId}`)
      return data.data ?? []
    },
    enabled: !!selectedGuildId,
  })

  const testMutation = useMutation({
    mutationFn: async ({
      channelId,
      message,
    }: {
      channelId: string
      message: string
    }) => {
      const { data } = await axios.post('/api/discord/send', {
        channelId,
        message,
      })
      return data
    },
    onSuccess: () => {
      toast.success('Test message sent successfully!')
    },
    onError: (err) => {
      handleError(err)
    },
  })

  const handleTest = () => {
    const values = form.baseStore.state.values
    const channelId = values.identifier.channelId
    const message = values.body.message

    if (!channelId || !message) {
      toast.error('Please select a channel and enter a message before testing.')
      return
    }

    testMutation.mutate({ channelId, message })
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <h2 className="text-lg font-semibold">Create New Automation</h2>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <CardContent className="space-y-6 pb-6">
          <form.Field
            name="name"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <FieldContent>
                  <Input
                    id={field.name}
                    placeholder="e.g., Daily Announcement"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </FieldContent>
              </Field>
            )}
          />

          <form.Field
            name="provider"
            children={(field) => (
              <Field>
                <FieldLabel>Integrations</FieldLabel>
                <FieldContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {PROVIDERS.map((provider) => {
                    const Icon = provider.icon
                    const isSelected = field.state.value === provider.value

                    return (
                      <Button
                        key={provider.value}
                        type="button"
                        className={cn(
                          'flex h-auto flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-colors',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-accent/50'
                        )}
                        style={
                          { '--primary': provider.color } as React.CSSProperties
                        }
                        onClick={() => field.handleChange(provider.value)}
                      >
                        <Icon className="size-6" />
                        <span className="text-sm font-medium">
                          {provider.label}
                        </span>
                      </Button>
                    )
                  })}
                </FieldContent>
              </Field>
            )}
          />

          <form.Field
            name="identifier.guildId"
            children={(field) => (
              <Field>
                <FieldLabel>Server</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      field.handleChange(val)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a server..." />
                    </SelectTrigger>
                    <SelectContent>
                      {guilds?.map((guild) => (
                        <SelectItem key={guild.id} value={guild.id}>
                          {guild.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={field.state.meta.errors} />
                </FieldContent>
              </Field>
            )}
          />

          <form.Field
            name="identifier.channelId"
            children={(field) => (
              <Field>
                <FieldLabel>Channel</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      field.handleChange(val)
                    }}
                    disabled={isLoadingChannels || !selectedGuildId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          !selectedGuildId
                            ? 'Select a server first'
                            : isLoadingChannels
                              ? 'Loading channels...'
                              : channelsError
                                ? 'Failed to load channels'
                                : 'Select a channel...'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {channels
                        ?.filter((channel) => channel.type === 0)
                        .map((channel) => (
                        <SelectItem key={channel.id} value={channel.id}>
                          <RiHashtag className="mr-1 inline size-3 shrink-0" />
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={field.state.meta.errors} />
                  {channelsError && (
                    <p className="text-destructive mt-1 text-sm">
                      {(channelsError as any)?.error?.message ??
                        (channelsError instanceof Error
                          ? channelsError.message
                          : 'Failed to load channels')}
                    </p>
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <form.Field
            name="body"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                <FieldContent>
                  <Textarea
                    id={field.name}
                    className="min-h-32 resize-none"
                    placeholder="Type your message here..."
                    value={field.state.value.message}
                    onChange={(e) =>
                      field.handleChange({
                        ...field.state.value,
                        message: e.target.value,
                      })
                    }
                    onBlur={field.handleBlur}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </FieldContent>
              </Field>
            )}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-end gap-2 border-t sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            disabled={testMutation.isPending}
            onClick={handleTest}
          >
            {testMutation.isPending ? (
              <>
                <RiLoader2Line className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Test Automation'
            )}
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/80 w-full sm:w-auto"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <RiLoader2Line className="size-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Automation'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
