"use server";

import { requireAuth } from "@shared/api/auth.guard";
import { withActionErrorHandler } from "@shared/api/server-error-handlers";
import {
  DeleteIntegrationSchema,
  type DeleteIntegrationType,
} from "../model/validator";
import prisma from "@shared/utils/prisma";
import { cache } from "@shared/api/cache";
import { cacheKeys } from "@shared/consts/cache";
import { IntegrationTokenStatus } from "@prisma/generated/enums";

const deleteIntegration = async (values: DeleteIntegrationType) => {
  const user = await requireAuth();

  const { id } = DeleteIntegrationSchema.parse(values);

  await prisma.integrationToken.update({
    where: { id },
    data: {
      revokedAt: new Date(),
      status: IntegrationTokenStatus.revoked,
    },
  });

  await cache.del(cacheKeys.integrationToken(user.id));
  await cache.del(cacheKeys.integrationTokenCount(user.id));
};

export const deleteIntegrationAction =
  withActionErrorHandler(deleteIntegration);
