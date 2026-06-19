import z from "zod";

export const DeleteAutomationSchema = z.object({
	id: z.string().min(1, "Automation ID is required"),
});

export type DeleteAutomationType = z.infer<typeof DeleteAutomationSchema>;
