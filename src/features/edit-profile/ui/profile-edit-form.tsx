/* eslint-disable react/no-children-prop */
'use client'

import { useSession } from 'next-auth/react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { Spinner } from '@/shared/ui/spinner'
import { editProfileAction } from '../api/edit-profile.action'
import { EditProfileSchema } from '../schemas/edit-profile.schema'
import { handleError } from '@shared/utils/handle-error'
import { isSuccess } from '@shared/api/server-error-handlers'

export function ProfileEditForm() {
  const { data: session, update } = useSession()

  const form = useForm({
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    },
    validators: {
      onSubmit: EditProfileSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await editProfileAction(value)

        if (!isSuccess(res)) {
          throw new Error(res.error?.message || 'Failed to update profile')
        }

        await update(res.data)

        toast.success('Profile updated successfully')
      } catch (error) {
        handleError(error)
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your profile information below</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="edit-profile-form"
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-4">
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="your@email.com"
                      autoComplete="email"
                      disabled
                    />
                    <p className="text-muted-foreground text-sm">
                      Email address cannot be changed.
                    </p>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button
                type="submit"
                form="edit-profile-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner /> : 'Save Changes'}
              </Button>
            )}
          />
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
