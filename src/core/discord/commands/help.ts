import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const help = async (
  interaction: ChatInputCommandInteraction<CacheType>,
) => {
  await interaction.reply(`**Here's a list of commands you can use with me:**

- ❓ **help**: Text this help message

- ℹ️ **info**: Provides information about the bot

- 🖥️ **server**: Provides information about the server

- 👤 **user**: Provides information about a user

- 🥋 **platform**: Provides platform-related information or actions
> 🚧 *Currently in development, stay tuned for updates!*

- 🎯 **jira**: Provides Jira-related information or actions
> **/jira [subcommand]** - Executes a Jira-related action. Subcommands include:
> - **issues find**: Get detail information about a Jira issue by ID
> - **issues create**: Creates a new Jira issued to yourself
> - **issues lookup**: Looks up the latest Jira issues assigned to yourself or specificed user
> - **issues move**: Move a Jira issue to a different status

- 🐙 **gh**: Provides GitHub-related information or actions
> **/gh [subcommand]** - Executes a GitHub-related action. Subcommands include:
> - **issues find**: Get detail information about a GitHub issue by ID
> - **issues create**: Creates a new GitHub issue for a specified dojoh repository
> - **issues lookup**: Looks up the latest GitHub issues for a specified dojoh repository
> - **issues update**: Updates an existing GitHub issue
> - **pr find**: Get detail information about a GitHub pull request by ID
> - **pr create**: Creates a new GitHub pull request for a specified dojoh repository
> - **pr lookup**: Looks up the latest GitHub pull requests for a specified dojoh repository
> - **pr update**: Updates an existing GitHub pull request
> - **pr merge**: Merges a GitHub pull request using a chosen strategy
`);
};
