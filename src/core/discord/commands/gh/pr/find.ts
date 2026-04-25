import { MessageFlags } from 'discord.js';

import octokit from '@/core/sdk/octokit';

import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const find = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  await interaction.deferReply({
    flags: [MessageFlags.Ephemeral],
  });

  const prNumber = interaction.options.getNumber('id', true);
  const repoFullname = interaction.options.getString('repo', true);

  const [owner, repo] = repoFullname.split('/');

  try {
    const { data: pr } = await octokit.rest.pulls.get({
      owner: owner!,
      repo: repo!,
      pull_number: prNumber,
    });

    let body = '> *No description provided.*';

    if (pr.body) {
      body = pr.body.split('\n').join('\n> ');
      body = body.endsWith('\n> ') ? body.slice(0, -3) : body;
    }

    let tags = 'None';

    if (pr.labels && pr.labels.length > 0) {
      tags = pr.labels
        .map((label) => {
          if (typeof label === 'string') {
            return label;
          } else {
            return label.name;
          }
        })
        .join(', ');
    }

    let assignees = 'None';

    if (pr.assignees && pr.assignees.length > 0) {
      assignees = pr.assignees
        .map((assignee) => `@${assignee.login}`)
        .join(', ');
    }

    let reviewers = 'None';

    if (pr.requested_reviewers && pr.requested_reviewers.length > 0) {
      reviewers = pr.requested_reviewers
        .map((reviewer) => `@${reviewer.login}`)
        .join(', ');
    }

    const createdAt = new Date(pr.created_at).toDateString();
    const user = pr.user ? `@${pr.user.login}` : 'Unknown';

    await interaction.followUp({
      content: `## PR [#${pr.number}](${pr.html_url})
**Title:** ${pr.title}
**State:** ${pr.state}
**Labels:** ${tags}
**Assignees:** ${assignees}
**Reviewers:** ${reviewers}
**Author:** ${user}
**Created At:** ${createdAt}

> ${body}`,
    });
  } catch (e) {
    console.error('Error fetching PR:', e);

    await interaction.editReply({
      content: '❌ Sorry, there was an error fetching the PR',
    });
  }
};
