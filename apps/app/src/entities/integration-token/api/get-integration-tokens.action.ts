"use server";

import { requireAuth } from "@shared/api/auth.guard";
import { withActionErrorHandler } from "@shared/api/server-error-handlers";
import { cache } from "@shared/api/cache";
import prisma from "@shared/utils/prisma";
import { cacheKeys } from "@shared/consts/cache";
import { IntegrationTokenStatus } from "@prisma/generated/enums";

const getTokens = async () => {
  const user = await requireAuth();
  const cacheKey = cacheKeys.integrationToken(user.id);

  return await cache.wrap(cacheKey, () =>
    prisma.integrationToken.findMany({
      where: {
        userId: user.id,
        status: IntegrationTokenStatus.active,
      },
      omit: {
        token: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  );
};

const getTokensCount = async () => {
  const user = await requireAuth();
  const cacheKey = cacheKeys.integrationTokenCount(user.id);

  return await cache.wrap(cacheKey, () =>
    prisma.integrationToken.count({
      where: {
        userId: user.id,
        status: IntegrationTokenStatus.active,
      },
    })
  );
};

export const getIntegrationTokens = withActionErrorHandler(getTokens);
export const getIntegrationTokensCount = withActionErrorHandler(getTokensCount);
