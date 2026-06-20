import type { Provider } from "@prisma/generated/enums";

export type ProviderType = {
  value: Provider;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};
