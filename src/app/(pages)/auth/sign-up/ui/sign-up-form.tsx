/* eslint-disable react/no-children-prop */
'use client'

import Link from 'next/link'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { SignUpSchema } from '@shared/models/auth.schema'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter } from '@/shared/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from '@shared/ui/input-group'
import { Spinner } from '@/shared/ui/spinner'
import { GithubLoginButton } from '@shared/ui/github-login-button'
import { signUpAction } from '../api/sign-up.action'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { handleError } from '@shared/utils/handle-error'
import { useRouter } from 'next/navigation'
import { throwAuthError } from '@shared/utils/map-authjs-error'
import { isSuccess } from '@shared/api/server-error-handlers'
import { usePostHog } from 'posthog-js/react'

export function SignUpForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const posthog = usePostHog()
  
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: SignUpSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const resAction = await signUpAction(value)

        if (!isSuccess(resAction)) {
          throw new Error(resAction.error?.message || 'Sign up failed')
        }

        const res = await signIn('credentials', {
          email: value.email,
          password: value.password,
          redirect: false,
        })

        if (res?.error) {
          throwAuthError(res.error)
        }

        posthog.capture('signed_up', {
          email: value.email,
        })
        toast.success('Account created! You can now sign in.')
        router.push('/')
      } catch (error) {
        handleError(error)
      }
    },
  })

  return (
    <Card className="w-full sm:max-w-md">
      <CardContent>
        <form
          id="sign-up-form"
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-2">
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Jane Doe"
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
                      placeholder="you@example.com"
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
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        type={showPassword ? 'text' : 'password'}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                      <InputGroupAddon
                        align="inline-end"
                        onClick={() => setShowPassword(!showPassword)}
                        className="cursor-pointer"
                      >
                        {showPassword ? <Eye /> : <EyeOff />}
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm password
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                      <InputGroupAddon
                        align="inline-end"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="cursor-pointer"
                      >
                        {showConfirmPassword ? <Eye /> : <EyeOff />}
                      </InputGroupAddon>
                    </InputGroup>

                    <FieldDescription>
                      Password must be at least 6 characters.
                    </FieldDescription>
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
        <Field>
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button type="submit" form="sign-up-form" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Sign up'}
              </Button>
            )}
          />
          <GithubLoginButton />
          <FieldDescription className="text-center">
            Already have an account? <Link href="/auth/sign-in">Sign in</Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  )
}
