import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const info = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  await interaction.reply(`👋 What's good? I’m **@whong**, your friendly neighborhood bot built to assist with all things related to dojoh!
    
I can help with server info, user details, and some Jira and GitHub integrations (only for **dev**). If you need anything, don't hesitate to ask! 🚀`);
};
