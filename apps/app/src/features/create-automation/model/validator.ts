import { Provider } from "@prisma/generated/enums";
import z from "zod";

export const CreateAutomationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.enum(Provider),
  identifier: z.json(),
  body: z.json(),
});

export type CreateAutomationType = z.infer<typeof CreateAutomationSchema>;
