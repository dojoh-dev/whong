import { MessageFlags } from 'discord.js';

import jira from '@/core/sdk/jira';

import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const move = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  const issueKey = interaction.options.getString('id', true);
  const status = interaction.options.getString('status', true);

  await interaction.deferReply({
    flags: [MessageFlags.Ephemeral],
  });

  try {
    await jira.issue.transitions(issueKey, Number(status));

    await interaction.followUp(`Issue ${issueKey} moved successfully! 🎉`);
  } catch (e) {
    console.error('Error moving Jira issue:', e);

    await interaction.editReply({
      content: '❌ Sorry, there was an error moving the Jira issue',
    });
  }
};
