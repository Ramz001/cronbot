/* eslint-disable react/no-children-prop */
'use client'

import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
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
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { handleError } from '@shared/utils/handle-error'
import { useRouter } from 'next/navigation'
import { throwAuthError } from '@shared/utils/map-authjs-error'
import { LoginSchema } from '@shared/models/auth.schema'

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: LoginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await signIn('credentials', {
          ...value,
          redirect: false,
        })

        if (result?.error) {
          throwAuthError(result.error)
        }

        toast.success('Signed in successfully.')
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
          id="sign-in-form"
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-2">
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
                        autoComplete="current-password"
                      />
                      <InputGroupAddon
                        align="inline-end"
                        onClick={() => setShowPassword(!showPassword)}
                        className="cursor-pointer"
                      >
                        {showPassword ? <Eye /> : <EyeOff />}
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
              <Button type="submit" form="sign-in-form" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Login'}
              </Button>
            )}
          />
          <GithubLoginButton />
          <FieldDescription className="text-center">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up">Sign up</Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  )
}
