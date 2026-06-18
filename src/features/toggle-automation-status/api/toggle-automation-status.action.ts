"use server";

import { requireAuth } from "@shared/api/auth.guard";
import { withActionErrorHandler } from "@shared/api/server-error-handlers";
import {
	ToggleAutomationStatusSchema,
	ToggleAutomationStatusType,
} from "../model/validator";
import prisma from "@shared/utils/prisma";
import { cache } from "@shared/api/cache";
import { cacheKeys } from "@shared/consts/cache";
import { NotFoundError } from "@shared/api/errors";

const toggleAutomationStatus = async (values: ToggleAutomationStatusType) => {
	const user = await requireAuth();

	const { id } = ToggleAutomationStatusSchema.parse(values);

	const automation = await prisma.automation.findUnique({
		where: { id },
		select: { isActive: true },
	});

	if (!automation) {
		throw new NotFoundError("Automation not found");
	}

	await prisma.automation.update({
		where: { id },
		data: {
			isActive: !automation.isActive,
		},
	});

	await cache.del(cacheKeys.automation(user.id));
};

export const toggleAutomationStatusAction = withActionErrorHandler(
	toggleAutomationStatus,
);
