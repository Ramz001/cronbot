'use server'

import {
  ActionResult,
  withActionErrorHandler,
} from '@shared/api/server-error-handlers'
import { AutomationCreateInput } from '@prisma/generated/models'

const action = async (values: AutomationCreateInput) => {}

export const createAutomation = withActionErrorHandler(action)
