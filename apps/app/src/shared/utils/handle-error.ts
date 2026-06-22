import { toast } from 'sonner';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import axios, { type AxiosError } from 'axios';

type ErrorKind =
  | 'zod'
  | 'prisma'
  | 'axios-validation'
  | 'axios'
  | 'error'
  | 'string'
  | 'unknown';

function classifyError(error: unknown): ErrorKind {
  if (error instanceof ZodError) return 'zod';
  if (error instanceof PrismaClientKnownRequestError) return 'prisma';
  if (axios.isAxiosError(error)) {
    // Server may have returned structured Zod issues via mapError
    const issues = error.response?.data?.error?.issues;
    return Array.isArray(issues) ? 'axios-validation' : 'axios';
  }
  if (error instanceof Error) return 'error';
  if (typeof error === 'string') return 'string';
  return 'unknown';
}

/**
 * Handles client errors (Prisma, Zod v4, Axios, generic) and shows a toast
 * @param error The caught error
 * @param showToast Set to true to suppress toast display
 */
export function handleError(error: unknown, showToast = true) {
  const kind = classifyError(error);
  let message: string;

  switch (kind) {
    case 'zod': {
      const zod = error as ZodError;
      message = zod.issues.map((i) => i.message).join(', ');
      break;
    }
    case 'prisma': {
      const prisma = error as PrismaClientKnownRequestError;
      message = `Database error: ${prisma.message}`;
      break;
    }
    case 'axios-validation': {
      const ax = error as AxiosError<{
        error: { issues: Array<{ message: string }> };
      }>;
      message = ax.response!.data.error.issues.map((i) => i.message).join(', ');
      break;
    }
    case 'axios':
      message = (error as AxiosError).message;
      break;
    case 'error':
      message = (error as Error).message;
      break;
    case 'string':
      message = error as string;
      break;
    default:
      message = 'Something went wrong.';
  }

  if (showToast) {
    toast.error(message);
  }

  console.error('[Client Error]:', error);
}
