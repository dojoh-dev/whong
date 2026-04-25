import { MessageFlags } from 'discord.js';

import octokit from '@/core/sdk/octokit';

import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const merge = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  const repoFullname = interaction.options.getString('repo', true);
  const [owner, repo] = repoFullname.split('/');

  const prNumber = interaction.options.getNumber('id', true);
  const strategy = interaction.options.getString('strategy', true) as
    | 'merge'
    | 'squash'
    | 'rebase';

  await interaction.deferReply({
    flags: [MessageFlags.Ephemeral],
  });

  try {
    const { data } = await octokit.rest.pulls.merge({
      owner: owner!,
      repo: repo!,
      merge_method: strategy,
      pull_number: prNumber,
    });

    if (!data.merged) {
      await interaction.followUp({
        content: `😔 PR #${prNumber} could not be merged. Reason: ${data.message}`,
      });
      return;
    }

    await interaction.followUp({
      content: `PR #${prNumber} merged successfully using the **${strategy}** strategy! 🎉`,
    });
  } catch (e) {
    console.error('Error merging PR:', e);

    await interaction.editReply({
      content: '❌ Sorry, there was an error merging the PR',
    });
  }
};
