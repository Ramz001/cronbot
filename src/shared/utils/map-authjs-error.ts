const AUTH_ERROR_MESSAGE: Record<string, string> = {
  OAuthSignin: 'OAuth sign-in failed. Please try again.',
  OAuthCallback: 'OAuth callback failed. Please try again.',
  OAuthCreateAccount: 'Unable to create account using OAuth.',
  EmailCreateAccount: 'Unable to create account using email.',
  Callback: 'Authentication callback error.',
  OAuthAccountNotLinked:
    'This email is already linked to another sign-in method.',
  EmailSignin: 'Email sign-in failed. Please try again.',
  CredentialsSignin: 'Invalid email or password.',
  SessionRequired: 'You must be signed in to continue.',
  Default: 'Authentication failed. Please try again.',
}

/**
 * Handles errors thrown from `signIn({ redirect: false })`
 */
export function throwAuthError(error: string) {
  const message =
    error in AUTH_ERROR_MESSAGE
      ? AUTH_ERROR_MESSAGE[error]
      : AUTH_ERROR_MESSAGE.Default

  throw new Error(message)
}
