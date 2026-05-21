'use client'

import { useForm } from '@tanstack/react-form'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@shared/ui/card'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select'
import { createIntegrationAction } from '../api/create-integration.action'
import { Provider } from '@prisma/generated/enums'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function CreateIntegrationForm() {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      provider: Provider.discord,
      token: '',
      title: '',
      expiresIn: '30',
    },
    onSubmit: async ({ value }) => {
      const expiresInDays = parseInt(value.expiresIn, 10)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + expiresInDays)

      const res = await createIntegrationAction({
        provider: value.provider as Provider,
        title: value.title || undefined,
        token: value.token,
        // @ts-ignore
        expiresAt: expiresAt,
      })

      if (res.success) {
        toast.success('Integration created successfully!')
        router.refresh()
      } else {
        toast.error(res.error?.message || 'Failed to create integration')
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Create Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form.Field
            name="provider"
            validators={{
              onChange: ({ value }) =>
                !value ? 'A provider is required' : undefined,
            }}
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Provider</Label>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val as Provider)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Provider.discord}>Discord</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <form.Field
            name="token"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Auth Token</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  type="password"
                  required
                  placeholder="User Auth Token..."
                />
              </div>
            )}
          />
          <form.Field
            name="title"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name (Optional)</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="My Discord Bot"
                />
              </div>
            )}
          />
          <form.Field
            name="expiresIn"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Expires In</Label>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? 'Creating...' : 'Create Integration'}
              </Button>
            )}
          />
        </CardFooter>
      </Card>
    </form>
  )
}
