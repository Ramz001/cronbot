"use server";

import { requireAuth } from "@shared/api/auth.guard";
import {
  type ActionResult,
  withActionErrorHandler,
} from "@shared/api/server-error-handlers";
import {
  DeleteAutomationSchema,
  type DeleteAutomationType,
} from "../model/validator";
import prisma from "@shared/utils/prisma";
import { cache } from "@shared/api/cache";
import { cacheKeys } from "@shared/consts/cache";

const deleteAutomation = async (
  values: DeleteAutomationType
): Promise<ActionResult> => {
  const user = await requireAuth();

  const { id } = DeleteAutomationSchema.parse(values);

  await prisma.automation.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });

  await cache.del(cacheKeys.automation(user.id));

  return { success: true };
};

export const deleteAutomationAction = withActionErrorHandler(deleteAutomation);
