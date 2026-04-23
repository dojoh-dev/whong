import { MessageFlags } from 'discord.js';

import octokit from '@/core/sdk/octokit';

import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const lookup = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  try {
    const repoFullname = interaction.options.getString('repo', true);
    const [owner, repo] = repoFullname.split('/');

    const assignee = interaction.options.getString('assignee', false);
    const perPage = interaction.options.getNumber('per_page', false) || 5;

    const { data: pulls } = await octokit.rest.pulls.list({
      owner: owner!,
      repo: repo!,
      assignee: assignee || undefined,
      per_page: perPage,
      sort: 'created',
      direction: 'desc',
    });

    if (pulls.length === 0) {
      await interaction.reply(`No PRs found in **${repoFullname}**.`);
      return;
    }

    const prList = pulls
      .map((pr) => `[#${pr.number}](${pr.html_url}) ${pr.title} (${pr.state})`)
      .join('\n');

    await interaction.reply({
      content: `Here are the ${pulls.length} pull request(s) in **${repoFullname}**:\n\n${prList}`,
      flags: [MessageFlags.SuppressEmbeds],
    });
  } catch (e) {
    console.error('Error fetching pull requests:', e);

    await interaction.reply({
      content: '❌ Sorry, there was an error fetching the pull requests',
      flags: [MessageFlags.Ephemeral],
    });
  }
};
