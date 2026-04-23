import { MessageFlags } from 'discord.js';

import env from '@/config/env';
import jira from '@/core/sdk/jira';

import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const create = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  const assigneeSearch = await jira.user.search(interaction.user.displayName);

  if (assigneeSearch.length === 0) {
    await interaction.reply({
      content:
        "❌ Sorry, I couldn't find your Jira account to assign the issue to you. Please make sure your Discord display name matches your Jira account name.",
      flags: [MessageFlags.Ephemeral],
    });
    return;
  }

  const assigneeId = assigneeSearch[0].accountId;

  const payload = {
    title: interaction.options.getString('title', true),
    description: interaction.options.getString('description', true),
    tags: interaction.options.getString('tag', true),
    assignee: {
      name: interaction.user.displayName,
    },
    projectKey: env('JIRA_PROJECT_KEY'),
    parentKey: interaction.options.getString('parent_id', false) || undefined,
  };

  try {
    const response = await jira.issue.create({
      project: {
        key: payload.projectKey,
      },
      issuetype: {
        name: payload.parentKey ? 'Sub-task' : 'Task',
      },
      parent: payload.parentKey ? { key: payload.parentKey } : undefined,
      summary: payload.title,
      description: payload.description,
      labels: [payload.tags],
      assignee: {
        id: assigneeId,
      },
      reporter: {
        id: assigneeId,
      },
    });

    const issueUrl = `https://${env('JIRA_DOMAIN')}.atlassian.net/browse/${response.key}`;

    await interaction.reply({
      content: `Issue [${response.key}](${issueUrl}) created! 🎉`,
    });
  } catch (e) {
    console.error('Error creating Jira issue:', e);

    await interaction.reply({
      content: '❌ Sorry, there was an error creating the Jira issue',
      flags: [MessageFlags.Ephemeral],
    });
  }
};
