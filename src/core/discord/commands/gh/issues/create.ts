import { MessageFlags } from 'discord.js';

import octokit from '@/core/sdk/octokit';

import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const create = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  const repoFullname = interaction.options.getString('repo', true);
  const [owner, repo] = repoFullname.split('/');

  const { ...payload } = {
    title: interaction.options.getString('title', true),
    body: interaction.options.getString('body', true),
    tags: interaction.options.getString('tags', false) || '',
    assignees: (interaction.options.getString('assignees', false) || '')
      .split(',')
      .map((assignee) => assignee.trim()),
    owner: owner!,
    repo: repo!,
  };

  try {
    const { data } = await octokit.rest.issues.create({
      ...payload,
      assignees:
        payload.assignees.length > 0
          ? payload.assignees
          : [interaction.user.username],
      labels: payload.tags
        ? payload.tags.split(',').map((tag) => tag.trim())
        : [],
    });

    await interaction.reply(
      `Issue [#${data.number}](${data.html_url}) created! 🎉`,
    );
  } catch (e) {
    console.error('Error creating issue:', e);

    await interaction.reply({
      content: '❌ Sorry, there was an error creating the issue',
      flags: [MessageFlags.Ephemeral],
    });
  }
};
