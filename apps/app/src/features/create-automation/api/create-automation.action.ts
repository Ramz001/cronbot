"use server";

import { withActionErrorHandler } from "@shared/api/server-error-handlers";
import { requireAuth } from "@shared/api/auth.guard";
import { CreateAutomationSchema, type CreateAutomationType } from "../model/validator";
import prisma from "@shared/utils/prisma";
import { cache } from "@shared/api/cache";
import { cacheKeys } from "@shared/consts/cache";

const action = async (values: CreateAutomationType) => {
  const user = await requireAuth();
  const { name, provider, body, identifier } = CreateAutomationSchema.parse(values);

  await prisma.automation.create({
    data: {
      name: name || "",
      provider,
      body: body || {},
      identifier: identifier || {},
      userId: user.id,
    },
  });

  await cache.del(cacheKeys.automation(user.id));
};

export const createAutomation = withActionErrorHandler(action);
