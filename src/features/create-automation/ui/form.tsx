'use client'

import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-form'
import { z } from 'zod'
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
import { RiMessage2Line, RiLoader2Line } from '@remixicon/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { handleError } from '@shared/utils/handle-error'
import { CreateAutomationSchema } from '../model/validator'
import { ChannelType, GuildType } from '@entities/discord/model/types'

const validateField = (
  name: keyof z.infer<typeof CreateAutomationSchema>,
  value: any
) => {
  const result = CreateAutomationSchema.shape[name].safeParse(value)
  return result.success ? undefined : result.error.issues[0].message
}

export const CreateAutomationForm = ({ guilds }: { guilds: GuildType[] }) => {
  const form = useForm({
    defaultValues: {
      name: '',
      provider: Provider.discord,
      identifier: { guildId: '', channelId: '' } as {
        guildId: string
        channelId: string
      },
      body: { message: '' } as { message: string },
    },
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(value)
    },
  })

  const selectedGuildId = useStore(
    form.baseStore,
    (state) => state.values.identifier.guildId
  )

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

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof CreateAutomationSchema>) => {
      toast.warning('Creating automation...')
    },
    onSuccess: () => {
      toast.success('Automation created successfully!')
    },
    onError: (err) => {
      handleError(err)
    },
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
            validators={{
              onSubmit: ({ value }) => validateField('name', value),
            }}
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Automation Name</FieldLabel>
                <FieldContent>
                  <Input
                    id={field.name}
                    placeholder="e.g., Daily Announcement"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError
                    errors={(field.state.meta.errors as string[]).map(
                      (msg) => ({
                        message: msg?.toString(),
                      })
                    )}
                  />
                </FieldContent>
              </Field>
            )}
          />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Integration</h3>
            <form.Field
              name="provider"
              children={(field) => (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <button
                    type="button"
                    className={`border-primary flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-colors ${
                      field.state.value === Provider.discord
                        ? 'bg-primary/5 text-primary'
                        : 'border-border hover:bg-accent/50'
                    }`}
                    onClick={() => field.handleChange(Provider.discord)}
                  >
                    <RiMessage2Line className="size-6" />
                    <span className="text-sm font-medium">Discord</span>
                  </button>
                </div>
              )}
            />
          </div>

          <form.Field
            name="identifier"
            children={(field) => (
              <Field>
                <FieldLabel>Server</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value.guildId}
                    onValueChange={(val) => {
                      field.handleChange({
                        ...field.state.value,
                        guildId: val,
                        channelId: '',
                      })
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
                  <FieldError
                    errors={(
                      field.state.meta.errors as unknown as string[]
                    ).map((msg) => ({
                      message: msg?.toString(),
                    }))}
                  />
                </FieldContent>
              </Field>
            )}
          />

          <form.Field
            name="identifier"
            children={(field) => (
              <Field>
                <FieldLabel>Channel</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value.channelId}
                    onValueChange={(val) => {
                      field.handleChange({
                        ...field.state.value,
                        channelId: val,
                      })
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
                      {channels?.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id}>
                          #{channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    errors={(
                      field.state.meta.errors as unknown as string[]
                    ).map((msg) => ({
                      message: msg?.toString(),
                    }))}
                  />
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
                  <FieldError
                    errors={(
                      field.state.meta.errors as unknown as string[]
                    ).map((msg) => ({
                      message: msg?.toString(),
                    }))}
                  />
                </FieldContent>
              </Field>
            )}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-end gap-4 border-t sm:flex-row">
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
