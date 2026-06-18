export const CACHE_KEYS = {
	INTEGRATION_TOKEN: "integration-tokens",
	INTEGRATION_TOKEN_COUNT: "integration-tokens-count",
	DISCORD_GUILD: "discord-guilds",
	DISCORD_CHANNELS: "discord-channels",
	AUTOMATION: "automations",
	AUTOMATION_RUN: "automation-runs",
} as const;

export const cacheKeys = {
	integrationToken: (userId: string) =>
		`${CACHE_KEYS.INTEGRATION_TOKEN}:${userId}`,
	integrationTokenCount: (userId: string) =>
		`${CACHE_KEYS.INTEGRATION_TOKEN_COUNT}:${userId}`,
	automation: (userId: string) => `${CACHE_KEYS.AUTOMATION}:${userId}`,
	automationRun: (userId: string) => `${CACHE_KEYS.AUTOMATION_RUN}:${userId}`,
	automationRunById: (userId: string, automationId: string) =>
		`${CACHE_KEYS.AUTOMATION_RUN}:${userId}:${automationId}`,
	discordGuild: (userId: string) => `${CACHE_KEYS.DISCORD_GUILD}:${userId}`,
	discordChannel: (guildId: string) =>
		`${CACHE_KEYS.DISCORD_CHANNELS}:${guildId}`,
} as const;
