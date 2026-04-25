import { MessageFlags } from 'discord.js';

import env from '@/config/env';
import jira from '@/core/sdk/jira';

import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const lookup = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  const assigneeName =
    interaction.options.getString('assignee', false) ||
    interaction.user.displayName;
  const perPage = interaction.options.getNumber('per_page', false) || 5;
  const status = interaction.options.getString('status', false);
  const direction = interaction.options.getString('direction', false) || 'DESC';

  await interaction.deferReply({
    flags: [MessageFlags.Ephemeral],
  });

  try {
    const assigneeSearch = await jira.user.search(assigneeName);

    if (assigneeSearch.length === 0) {
      await interaction.followUp({
        content: `❌ Sorry, I couldn't find a Jira account matching "${assigneeName}". Please make sure the name matches a Jira user.`,
      });
      return;
    }

    const assigneeId = assigneeSearch[0].accountId;

    const jql =
      `assignee=${assigneeId}` +
      (status ? ` AND status="${status}"` : '') +
      ` ORDER BY created ${direction}`;

    const response = await jira.jql.search(jql, {
      maxResults: perPage,
      fields: ['key', 'summary', 'status', 'assignee'],
      orderBy: 'created',
      expand: ['names'],
    });

    const issueList = response.issues
      .map(
        (issue: Octokit.Issue) =>
          `[${issue.key}](https://${env('JIRA_DOMAIN')}.atlassian.net/browse/${issue.key}) - ${issue.fields.summary} (\`${issue.fields.status.name}\`)`,
      )
      .join('\n');

    await interaction.followUp({
      content: `Here are the ${response.issues.length} most recent issue(s) assigned to **${assigneeName}**:\n\n${issueList}`,
      flags: [MessageFlags.SuppressEmbeds],
    });
  } catch (e) {
    console.error('Error fetching assigned Jira issues:', e);

    await interaction.editReply({
      content: '❌ Sorry, there was an error fetching the assigned Jira issues',
    });
  }
};
