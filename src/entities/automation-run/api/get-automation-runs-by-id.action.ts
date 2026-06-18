"use server";

import { requireAuth } from "@shared/api/auth.guard";
import { withActionErrorHandler } from "@shared/api/server-error-handlers";
import { cache } from "@shared/api/cache";
import prisma from "@shared/utils/prisma";
import { AutomationRunSchema, AutomationRunType } from "../model/validator";
import { cacheKeys } from "@shared/consts/cache";

const action = async (values: AutomationRunType) => {
	const user = await requireAuth();
	const { id } = AutomationRunSchema.parse(values);
	const cacheKey = cacheKeys.automationRunById(user.id, id);

	return await cache.wrap(cacheKey, () =>
		prisma.automationRun.findMany({
			where: {
				automationId: id,
				deletedAt: null,
				automation: {
					userId: user.id,
					deletedAt: null,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		}),
	);
};

export const getAutomationRunsById = withActionErrorHandler(action);
