import { PROVIDERS } from '../consts/provider-registry';
import type { ProviderType } from '../model/types';
import type { Provider } from '@prisma/generated/enums';

export function getProvider(value: Provider): ProviderType | undefined {
  return PROVIDERS.find((p) => p.value === value);
}
