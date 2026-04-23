import octokit from '@/core/sdk/octokit';

import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const find = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  const issueNumber = interaction.options.getNumber('id', true);
  const repoFullname = interaction.options.getString('repo', true);

  if (issueNumber <= 0 && !repoFullname) return;

  const [owner, repo] = repoFullname.split('/');
  const { data: issue } = await octokit.rest.issues.get({
    issue_number: issueNumber,
    owner: owner!,
    repo: repo!,
  });

  let labels = 'None';

  if (issue.labels && issue.labels.length > 0) {
    labels = issue.labels
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

  if (issue.assignees && issue.assignees.length > 0) {
    assignees = issue.assignees
      .map((assignee) => `@${assignee.login}`)
      .join(', ');
  }

  let body = '> *No description provided.*';

  if (issue.body) {
    body = issue.body.split('\n').join('\n> ');
    body = body.endsWith('\n> ') ? body.slice(0, -3) : body;
  }

  const createdAt = new Date(issue.created_at).toDateString();

  const user = issue.user ? `@${issue.user.login}` : 'Unknown';

  await interaction.reply(`**Issue #${issue.number}**
**Title:** ${issue.title}
**State:** ${issue.state}
**Assignees:** ${assignees}
**Labels:** ${labels}
**Author:** ${user}
**Created At:** ${createdAt}

> ${body}`);
};
