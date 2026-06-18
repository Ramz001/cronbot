import z from "zod";

export const GuildIdSchema = z.string().min(1, "Guild ID is required");
export const ChannelIdSchema = z.string().min(1, "Channel ID is required");
export const MessageSchema = z.string().min(1, "Message is required");

export const GetChannelsSchema = z.object({
	guildId: GuildIdSchema,
});

export type GetChannelsType = z.infer<typeof GetChannelsSchema>;

export const IdentifierSchema = z.object({
	channelId: ChannelIdSchema,
	guildId: GuildIdSchema,
});

export type IdentifierType = z.infer<typeof IdentifierSchema>;

export const BodySchema = z.object({
	message: MessageSchema,
});

export type BodyType = z.infer<typeof BodySchema>;
