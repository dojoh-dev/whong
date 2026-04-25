import { MessageFlags } from 'discord.js';

import octokit from '@/core/sdk/octokit';

import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const create = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  await interaction.deferReply({
    flags: [MessageFlags.Ephemeral],
  });

  const repoFullname = interaction.options.getString('repo', true);
  const [owner, repo] = repoFullname.split('/');

  const { reviewers, ...payload } = {
    title: interaction.options.getString('title', true),
    head: interaction.options.getString('head', true),
    base: interaction.options.getString('base', true),
    body: interaction.options.getString('body', false) || '',
    tags: interaction.options.getString('tags', false) || '',
    assignees: (interaction.options.getString('assignees', false) || '')
      .split(',')
      .map((assignee) => assignee.trim()),
    reviewers: (interaction.options.getString('reviewers', false) || '')
      .split(',')
      .map((reviewer) => reviewer.trim()),
    owner: owner!,
    repo: repo!,
  };

  try {
    const { data } = await octokit.rest.pulls.create({
      ...payload,
      assignees: payload.assignees.length > 0 ? payload.assignees : undefined,
    });

    await octokit.rest.pulls.requestReviewers({
      owner: owner!,
      repo: repo!,
      pull_number: data.number,
      reviewers: reviewers.length > 0 ? reviewers : undefined,
    });

    await interaction.followUp({
      ephemeral: false,
      content: `PR [#${data.number}](${data.html_url}) created! 🎉`,
    });
  } catch (e) {
    console.error('Error creating PR:', e);

    await interaction.editReply({
      content: '❌ Sorry, there was an error creating the PR',
    });
  }
};
