import { MessageFlags } from 'discord.js';

import jira from '@/core/sdk/jira';

import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const move = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  const issueKey = interaction.options.getString('id', true);
  const status = interaction.options.getString('status', true);

  try {
    await jira.issue.transitions(issueKey, Number(status));

    await interaction.reply(`Issue ${issueKey} moved successfully! 🎉`);
  } catch (e) {
    console.error('Error moving Jira issue:', e);

    await interaction.reply({
      content: '❌ Sorry, there was an error moving the Jira issue',
      flags: [MessageFlags.Ephemeral],
    });
  }
};
