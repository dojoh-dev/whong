import type { ChatInputCommandInteraction, CacheType } from "discord.js";

type CommandHandler = Record<
  "help" | "info" | "server" | "user" | "platform" | "jira" | "gh",
  (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>
>;

export default {
  async help(interaction) {
    await interaction.reply(`Here's a list of commands you can use with me:

- ❓ **help**: Text this help message

- ℹ️ **info**: Provides information about the bot

- 🖥️ **server**: Provides information about the server

- 👤 **user**: Provides information about a user

- 🥋 **platform**: Provides platform-related information or actions
> 🚧 *Currently in development, stay tuned for updates!*

- 🎯 **jira**: Provides Jira-related information or actions
> **/jira [subcommand]** - Executes a Jira-related action. Subcommands include:
> - **issues**: Manages issues for a dojoh project

- 🐙 **gh**: Provides GitHub-related information or actions
> **/gh [subcommand]** - Executes a GitHub-related action. Subcommands include:
> - **issues**: Manages issues for a specified dojoh repository
> - **pulls**: Manages pull requests for a specified dojoh repository
`);
  },

  async info(interaction) {
    await interaction.reply(`👋 What's good? I’m **@whong**, your friendly neighborhood bot built to assist with all things related to dojoh!
    
I can help with server info, user details, and some Jira and GitHub integrations (only for **dev**). If you need anything, don't hesitate to ask! 🚀`);
  },

  async server(interaction) {
    const { guild } = interaction;

    if (!guild) {
      await interaction.reply("This command can only be used in a server.");
      return;
    }

    const { name, memberCount, ownerId, createdAt } = guild;

    await interaction.reply(`**Server Name:** ${name}
**Member Count:** ${memberCount}
**Owner:** <@${ownerId}>
**Created At:** ${createdAt.toDateString()}
		`);
  },

  async user(interaction) {
    const username = interaction.options.getString("username", true);

    await interaction.reply(
      `You asked for info about **${username}**. Unfortunately, I can't fetch user details yet, but I'm working on it! Stay tuned for updates! 🚧`,
    );
  },

  async platform(interaction) {
    await interaction.reply(
      `🚧 Currently in development, stay tuned for updates!`,
    );
  },

  async jira(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "issues") {
      await interaction.reply(
        `🚧 Jira issues management is currently in development, stay tuned for updates!`,
      );
      return;
    }
  },

  async gh(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "issues") {
      await interaction.reply(
        `🚧 GitHub issues management is currently in development, stay tuned for updates!`,
      );
      return;
    }

    if (subcommand === "pulls") {
      await interaction.reply(
        `🚧 GitHub pull requests management is currently in development, stay tuned for updates!`,
      );
      return;
    }
  },
} satisfies CommandHandler;
