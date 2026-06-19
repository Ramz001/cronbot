import { DISCORD_API } from "../consts/api";
import { authHeaders } from "../utils/auth-headers";
import { requireAuth } from "@shared/api/auth.guard";
import { withActionErrorHandler } from "@shared/api/server-error-handlers";
import { cache } from "@shared/api/cache";
import { cacheKeys } from "@shared/consts/cache";
import axios from "axios";
import type { GuildType } from "../model/types";

const action = async (): Promise<GuildType[]> => {
	const user = await requireAuth();

	return cache.wrap(cacheKeys.discordGuild(user.id), async () => {
		const headers = await authHeaders({ userId: user.id });

		const { data } = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
			headers,
		});

		return data;
	});
};

export const getGuilds = withActionErrorHandler(action);
