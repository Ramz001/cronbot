/* eslint-disable react/no-children-prop */
'use client'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { Badge } from '@/shared/ui/badge'
import { Spinner } from '@/shared/ui/spinner'
import { updateUserRoleAction } from '../api/update-role.action'
import { RoleType, role } from '@shared/models/primitive.schema'
import { UpdateRoleSchema } from '../models/update-role.schema'
import { handleError } from '@shared/utils/handle-error'
import { isSuccess } from '@shared/api/server-error-handlers'

export function AdminRoleManager() {
  const form = useForm({
    defaultValues: {
      email: '',
      role: 'USER' as RoleType,
    },
    validators: {
      onSubmit: UpdateRoleSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await updateUserRoleAction(value)

        if (!isSuccess(res)) {
          toast.error(res.error?.message || 'Failed to update user role')
          return
        }

        toast.success(`User role updated to ${value.role}`)
        form.reset()
      } catch (error) {
        handleError(error)
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
        <CardDescription>
          Update user roles. Only administrators can access this section.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="admin-role-form"
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-4">
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>User Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="user@example.com"
                      autoComplete="email"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="role"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>New Role</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as RoleType)
                      }
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">
                          <div className="flex items-center gap-2">
                            <Badge>{role.enum.USER}</Badge>
                            <span className="text-muted-foreground text-xs">
                              Standard user
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="ADMIN">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{role.enum.ADMIN}</Badge>
                            <span className="text-muted-foreground text-xs">
                              Full access
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>

        <div className="mt-6 border-t pt-4">
          <h3 className="mb-2 text-sm font-semibold">Available Roles</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Badge variant="secondary">{role.enum.USER}</Badge>
                <p className="text-muted-foreground mt-1 text-xs">
                  Standard user with basic permissions
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Badge variant="destructive">{role.enum.ADMIN}</Badge>
                <p className="text-muted-foreground mt-1 text-xs">
                  Administrator with full system access
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <form.Subscribe
          selector={(state) => state.isSubmitting}
          children={(isSubmitting) => (
            <Button
              type="submit"
              form="admin-role-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : 'Update Role'}
            </Button>
          )}
        />
      </CardFooter>
    </Card>
  )
}
