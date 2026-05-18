import * as z from 'zod'

const envVariables = z.object({
  AUTH_SECRET: z.string().min(1, 'AUTH_SECRET is required'),
  AUTH_GITHUB_ID: z.string().min(1, 'AUTH_GITHUB_ID is required'),
  AUTH_GITHUB_SECRET: z.string().min(1, 'AUTH_GITHUB_SECRET is required'),
  AUTH_TRUST_HOST: z.string().min(1, 'AUTH_TRUST_HOST is required'),
  AUTH_URL: z.string().min(1, 'AUTH_URL is required'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  TEST_USER_EMAIL: z.email('TEST_USER_EMAIL must be a valid email'),
  TEST_USER_PASSWORD: z
    .string()
    .min(8, 'TEST_USER_PASSWORD must be at least 8 characters long'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  RESEND_SEND_EMAIL: z.email('RESEND_SEND_EMAIL must be a valid email'),
  DISCORD_USER_TOKEN: z.string().min(1, 'DISCORD_USER_TOKEN is required'),
})

export const env = envVariables.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
