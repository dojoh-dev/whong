import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const user = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  const username = interaction.options.getString('username', true);

  await interaction.reply(
    `You asked for info about **${username}**. Unfortunately, I can't fetch user details yet, but I'm working on it! Stay tuned for updates! 🚧`,
  );
};
