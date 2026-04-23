import { MessageFlags } from 'discord.js';

import octokit from '@/core/sdk/octokit';

import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const update = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  const issueNumber = interaction.options.getNumber('id', true);
  const repoFullname = interaction.options.getString('repo', true);
  const [owner, repo] = repoFullname.split('/');

  const title = interaction.options.getString('title', false) || undefined;
  const body = interaction.options.getString('body', false) || undefined;
  const tags = interaction.options.getString('tags', false);
  const assignees = interaction.options.getString('assignees', false);
  const state = interaction.options.getString('state', false) as
    | 'open'
    | 'closed'
    | undefined;

  try {
    const { data } = await octokit.rest.issues.update({
      owner: owner!,
      repo: repo!,
      issue_number: issueNumber,
      title,
      body,
      labels: tags ? tags.split(',').map((tag) => tag.trim()) : undefined,
      assignees: assignees
        ? assignees.split(',').map((assignee) => assignee.trim())
        : undefined,
      state: state || undefined,
    });

    await interaction.reply(
      `Issue [#${data.number}](${data.html_url}) updated! 🎉`,
    );
  } catch (e) {
    console.error('Error updating issue:', e);

    await interaction.reply({
      content: '❌ Sorry, there was an error updating the issue',
      flags: [MessageFlags.Ephemeral],
    });
  }
};
