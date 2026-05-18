import * as z from 'zod'

const envVariables = z.object({
  BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
  GITHUB_ID: z.string().min(1, 'GITHUB_ID is required'),
  GITHUB_SECRET: z.string().min(1, 'GITHUB_SECRET is required'),
  BETTER_AUTH_URL: z.string().min(1, 'BETTER_AUTH_URL is required'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  TEST_USER_EMAIL: z.email('TEST_USER_EMAIL must be a valid email'),
  TEST_USER_PASSWORD: z
    .string()
    .min(5, 'TEST_USER_PASSWORD must be at least 8 characters long'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  RESEND_SEND_EMAIL: z.email('RESEND_SEND_EMAIL must be a valid email'),
})

export const env = envVariables.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
