import { MessageFlags } from 'discord.js';

import octokit from '@/core/sdk/octokit';

import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const update = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  const prNumber = interaction.options.getNumber('id', true);
  const repoFullname = interaction.options.getString('repo', true);
  const [owner, repo] = repoFullname.split('/');

  const title = interaction.options.getString('title', false) || undefined;
  const body = interaction.options.getString('body', false) || undefined;
  const tags = interaction.options.getString('tags', false);
  const state = interaction.options.getString('state', false) as
    | 'open'
    | 'closed'
    | undefined;

  await interaction.deferReply({
    flags: [MessageFlags.Ephemeral],
  });

  try {
    const { data } = await octokit.rest.pulls.update({
      owner: owner!,
      repo: repo!,
      pull_number: prNumber,
      title,
      body,
      labels: tags ? tags.split(',').map((tag) => tag.trim()) : undefined,
      state: state || undefined,
    });

    await interaction.followUp({
      ephemeral: false,
      content: `PR [#${data.number}](${data.html_url}) updated! 🎉`,
    });
  } catch (e) {
    console.error('Error updating PR:', e);

    await interaction.editReply({
      content: '❌ Sorry, there was an error updating the PR',
    });
  }
};
