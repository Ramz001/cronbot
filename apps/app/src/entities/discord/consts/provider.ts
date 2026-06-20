import { Provider } from "@prisma/generated/enums";
import { Icon } from "../client";
import type { ProviderType } from "@entities/provider-registry";

export const DISCORD_PROVIDER: ProviderType = {
  value: Provider.discord,
  label: "Discord",
  icon: Icon,
  color: "#5865F2",
};

export enum CHANNEL_TYPE {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_NEWS = 5,
  GUILD_STORE = 6,
  GUILD_NEWS_THREAD = 10,
  GUILD_PUBLIC_THREAD = 11,
  GUILD_PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13,
}
