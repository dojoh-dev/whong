import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const platform = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  await interaction.reply(
    `🚧 Currently in development, stay tuned for updates!`,
  );
};
