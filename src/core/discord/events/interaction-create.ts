import { Events, MessageFlags } from 'discord.js';

import env from '@/config/env';
import githubCommand from '@/core/discord/commands/gh';
import { help } from '@/core/discord/commands/help';
import { info } from '@/core/discord/commands/info';
import jiraCommand from '@/core/discord/commands/jira';
import { platform } from '@/core/discord/commands/platform';
import { server } from '@/core/discord/commands/server';
import { user } from '@/core/discord/commands/user';
import { log } from '@/infra/logger';

import type {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  GuildMember,
} from 'discord.js';

type CommandHandler = Record<
  'help' | 'info' | 'server' | 'user' | 'platform' | 'jira' | 'gh',
  (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>
>;

const handler = {
  help,
  info,
  server,
  user,
  platform,

  async jira(interaction) {
    const member = interaction.member as GuildMember;
    const roles = member.roles.cache;

    if (!roles || !roles.has(env('DEV_ROLE_ID'))) {
      await interaction.reply({
        content:
          '☹️ Sorry, but you do not have permission to use this command.',
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    const subcommandGroup = interaction.options.getSubcommandGroup();

    if (subcommandGroup === 'issues') {
      switch (subcommand) {
        case 'find':
          jiraCommand.issues.find(interaction);
          return;
        case 'create':
          jiraCommand.issues.create(interaction);
          return;
        case 'lookup':
          jiraCommand.issues.lookup(interaction);
          return;
        case 'move':
          jiraCommand.issues.move(interaction);
          return;
        default:
          return;
      }
    }

    await interaction.reply({
      content:
        '❌ Invalid subcommand. Please check the command options and try again.',
      flags: [MessageFlags.Ephemeral],
    });
  },

  async gh(interaction) {
    const member = interaction.member as GuildMember;
    const roles = member.roles.cache;

    if (!roles || !roles.has(env('DEV_ROLE_ID'))) {
      await interaction.reply({
        content:
          '☹️ Sorry, but you do not have permission to use this command.',
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    const subcommandGroup = interaction.options.getSubcommandGroup();

    if (subcommandGroup === 'issues') {
      switch (subcommand) {
        case 'find':
          githubCommand.issues.find(interaction);
          return;
        case 'create':
          githubCommand.issues.create(interaction);
          return;
        case 'lookup':
          githubCommand.issues.lookup(interaction);
          return;
        case 'update':
          githubCommand.issues.update(interaction);
          return;
        default:
          return;
      }
    }

    if (subcommandGroup === 'pr') {
      switch (subcommand) {
        case 'merge':
          githubCommand.pr.merge(interaction);
          return;
        case 'lookup':
          githubCommand.pr.lookup(interaction);
          return;
        case 'create':
          githubCommand.pr.create(interaction);
          return;
        case 'find':
          githubCommand.pr.find(interaction);
          return;
        case 'update':
          githubCommand.pr.update(interaction);
          return;
        default:
          return;
      }
    }

    await interaction.reply({
      content:
        '❌ Invalid subcommand. Please check the command options and try again.',
      flags: [MessageFlags.Ephemeral],
    });
  },
} satisfies CommandHandler;

export default function (client: Client<boolean>): void {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    log(`Received interaction: ${interaction.commandName}`);

    const key = interaction.commandName as keyof typeof handler;

    if (!(key in handler)) {
      console.debug(`No handler found for command: ${interaction.commandName}`);
    }

    await handler[key](interaction);
  });

  return;
}
