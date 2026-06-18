import { PROVIDERS } from "../consts/provider-registry";
import { ProviderType } from "../model/types";
import { Provider } from "@prisma/generated/enums";

export function getProvider(value: Provider): ProviderType | undefined {
	return PROVIDERS.find((p) => p.value === value);
}
