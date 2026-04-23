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

    const { data } = await octokit.rest.issues.listForRepo({
      owner: owner!,
      repo: repo!,
      assignee: assignee || undefined,
      per_page: perPage,
      sort: 'created',
      direction: 'desc',
    });

    const issues = data.filter((issue) => !issue.pull_request);

    const issueList = issues
      .map(
        (issue) =>
          `[#${issue.number}](${issue.html_url}) ${issue.title} (${issue.state})`,
      )
      .join('\n');

    if (issues.length === 0) {
      await interaction.reply(`No issues found in **${repoFullname}**.`);
      return;
    }

    await interaction.reply({
      content: `Here are the ${issues.length} most recent issue(s) in **${repoFullname}**:\n\n${issueList}`,
      flags: [MessageFlags.SuppressEmbeds],
    });
  } catch (e) {
    console.error('Error fetching latest issues:', e);

    await interaction.reply({
      content: '❌ Sorry, there was an error fetching the latest issues',
      flags: [MessageFlags.Ephemeral],
    });
  }
};
