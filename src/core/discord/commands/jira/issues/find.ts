import { MessageFlags } from 'discord.js';

import env from '@/config/env';
import jira from '@/core/sdk/jira';
import { jiraToDiscord } from '@/utils/jira';

import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const find = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  const issueKey = interaction.options.getString('id', true);

  try {
    const response = await jira.issue.get(issueKey);

    const assignee = response.fields.assignee
      ? response.fields.assignee.displayName
      : 'Unassigned';

    const createdAt = new Date(response.fields.created).toDateString();

    await interaction.reply(`## [${response.key}] ${response.fields.summary}
**Status:** \`${response.fields.status.name}\`
**Assignee:** ${assignee}
**Reporter:** ${response.fields.reporter.displayName}
**Created At:** ${createdAt}
**Link:** https://${env('JIRA_DOMAIN')}.atlassian.net/browse/${response.key}

${jiraToDiscord(response.fields.description)}`);
  } catch (e) {
    console.error('Error fetching Jira issue:', e);

    await interaction.reply({
      content: '❌ Sorry, there was an error fetching the Jira issue',
      flags: [MessageFlags.Ephemeral],
    });
  }
};
