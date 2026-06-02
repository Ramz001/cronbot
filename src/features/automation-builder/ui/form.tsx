'use client'

import { useForm } from '@tanstack/react-form'
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
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { RiMessage2Line, RiSendPlaneLine, RiTeamLine } from '@remixicon/react'
import { useStore } from '@tanstack/react-form'

const schema = z.object({
  name: z.string().min(1, 'Automation name is required'),
  description: z.string().optional(),
  provider: z.enum(Provider),
  guildId: z.string().min(1, 'Server is required'),
  channelId: z.string().min(1, 'Channel is required'),
  message: z.string().min(1, 'Message is required'),
})

const validateField = (name: keyof z.infer<typeof schema>, value: any) => {
  const result = schema.shape[name].safeParse(value)
  return result.success ? undefined : result.error.issues[0].message
}

export const CreateAutomationForm = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      provider: Provider.discord,
      guildId: '',
      channelId: '',
      message: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted', value)
    },
  })

  const selectedGuildId = useStore(
    form.baseStore,
    (state) => state.values.guildId
  )
  const { data: guildsResponse, isLoading: isLoadingGuilds } = useQuery({
    queryKey: ['discord-guilds'],
    queryFn: async () => {
      const res = await axios.get('/api/discord/guilds')
      return res.data.data
    },
  })

  const { data: channelsResponse, isLoading: isLoadingChannels } = useQuery({
    queryKey: ['discord-channels', selectedGuildId],
    queryFn: async () => {
      const res = await axios.get(`/api/discord/guilds/${selectedGuildId}`)
      return res.data.data
    },
    enabled: !!selectedGuildId,
  })

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
              onChange: ({ value }) => validateField('name', value),
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
                    errors={field.state.meta.errors.map((msg) => ({
                      message: msg?.toString(),
                    }))}
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
            name="guildId"
            validators={{
              onChange: ({ value }) => validateField('guildId', value),
            }}
            children={(field) => (
              <Field>
                <FieldLabel>Server</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      field.handleChange(val)
                      form.setFieldValue('channelId', '')
                    }}
                    disabled={isLoadingGuilds}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoadingGuilds
                            ? 'Loading servers...'
                            : 'Select a server...'
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
                  <FieldError
                    errors={field.state.meta.errors.map((msg) => ({
                      message: msg?.toString(),
                    }))}
                  />
                </FieldContent>
              </Field>
            )}
          />

          <form.Field
            name="channelId"
            validators={{
              onChange: ({ value }) => validateField('channelId', value),
            }}
            children={(field) => (
              <Field>
                <FieldLabel>Channel</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    disabled={isLoadingChannels || !selectedGuildId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          !selectedGuildId
                            ? 'Select a server first'
                            : isLoadingChannels
                              ? 'Loading channels...'
                              : 'Select a channel...'
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
                  <FieldError
                    errors={field.state.meta.errors.map((msg) => ({
                      message: msg?.toString(),
                    }))}
                  />
                </FieldContent>
              </Field>
            )}
          />

          <form.Field
            name="message"
            validators={{
              onChange: ({ value }) => validateField('message', value),
            }}
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                <FieldContent>
                  <Textarea
                    id={field.name}
                    className="min-h-32 resize-none"
                    placeholder="Type your message here..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError
                    errors={field.state.meta.errors.map((msg) => ({
                      message: msg?.toString(),
                    }))}
                  />
                </FieldContent>
              </Field>
            )}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-end gap-4 border-t sm:flex-row">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Test Automation
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/80 w-full sm:w-auto"
            >
              Create Automation
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
