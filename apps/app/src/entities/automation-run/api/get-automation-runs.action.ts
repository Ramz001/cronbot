"use server";

import { requireAuth } from "@shared/api/auth.guard";
import { cache } from "@shared/api/cache";
import { withActionErrorHandler } from "@shared/api/server-error-handlers";
import { cacheKeys } from "@shared/consts/cache";
import prisma from "@shared/utils/prisma";

const action = async () => {
  const user = await requireAuth();
  const cacheKey = cacheKeys.automationRun(user.id);

  return await cache.wrap(cacheKey, () =>
    prisma.automationRun.findMany({
      where: {
        deletedAt: null,
        automation: {
          userId: user.id,
          deletedAt: null,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        automation: true,
      },
    }),
  );
};

export const getAutomationRuns = withActionErrorHandler(action);
