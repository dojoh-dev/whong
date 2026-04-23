import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const server = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  const { guild } = interaction;

  if (!guild) {
    await interaction.reply('This command can only be used in a server.');
    return;
  }

  const { name, memberCount, ownerId, createdAt } = guild;
  const days = Math.floor(
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
  );

  await interaction.reply(`**Server Name:** ${name}
**Member Count:** ${memberCount}
**Owner:** <@${ownerId}>
**Days Since Creation:** ${days}
	`);
};
