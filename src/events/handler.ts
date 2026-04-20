import type { ChatInputCommandInteraction, CacheType } from "discord.js";
import { Octokit } from "octokit";

import env from "@/config/env";

type CommandHandler = Record<
  "help" | "info" | "server" | "user" | "platform" | "jira" | "gh",
  (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>
>;

const octokit = new Octokit({
  auth: env("GITHUB_TOKEN"),
});

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
> - **issues lookup**: Looks up an existing Jira issue for a specified dojoh project
> - **issues create**: Creates a new Jira issue for a specified dojoh project

- 🐙 **gh**: Provides GitHub-related information or actions
> **/gh [subcommand]** - Executes a GitHub-related action. Subcommands include:
> - **issues lookup**: Looks up an existing GitHub issue for a specified dojoh repository
> - **issues create**: Creates a new GitHub issue for a specified dojoh repository
> - **pulls lookup**: Looks up an existing GitHub pull request for a specified dojoh repository
> - **pulls create**: Creates a new GitHub pull request for a specified dojoh repository
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
    const subcommandGroup = interaction.options.getSubcommandGroup();

    // Get whether a single issue or pull request
    if (subcommandGroup === "issues" && subcommand === "lookup") {
      const issueNumber = interaction.options.getNumber("id", true);
      const repoFullname = interaction.options.getString("repo", true);

      if (issueNumber <= 0 && !repoFullname) return;

      const [owner, repo] = repoFullname.split("/");
      const { data: issue } = await octokit.rest.issues.get({
        issue_number: issueNumber,
        owner,
        repo,
      });

      console.debug("Fetched issue data:", issue.title);

      let labels = "None";

      if (issue.labels && issue.labels.length > 0) {
        labels = issue.labels
          .map((label) => {
            if (typeof label === "string") {
              return label;
            } else {
              return label.name;
            }
          })
          .join(", ");
      }

      let assignees = "None";

      if (issue.assignees && issue.assignees.length > 0) {
        assignees = issue.assignees
          .map((assignee) => `@${assignee.login}`)
          .join(", ");
      }

      let body = "> *No description provided.*";

      if (issue.body) {
        body = issue.body.split("\n").join("\n> ");
        body = body.endsWith("\n> ") ? body.slice(0, -3) : body;
      }

      const createdAt = new Date(issue.created_at).toLocaleString();

      const user = issue.user ? `@${issue.user.login}` : "Unknown";

      await interaction.reply(`**Issue #${issue.number}**
**Title:** ${issue.title}
**State:** ${issue.state}
**Author:** ${user}
**Assignees:** ${assignees}
**Labels:** ${labels}
**Created At:** ${createdAt}

> ${body}`);

      return;
    }

    // Create a new issue
    if (subcommandGroup === "issues" && subcommand === "create") {
      const repoFullname = interaction.options.getString("repo", true);
      const [owner, repo] = repoFullname.split("/");

      const payload = {
        title: interaction.options.getString("title", true),
        body: interaction.options.getString("description", true),
        tags: interaction.options.getString("tags", false) || "",
        assignee: interaction.options.getString("assignee", false) || undefined,
        owner,
        repo,
      };

      await octokit.rest.issues.create({
        ...payload,
        assignees: [payload.assignee].filter(Boolean) as string[],
        labels: payload.tags
          ? payload.tags.split(",").map((tag) => tag.trim())
          : [],
      });
    }

    if (subcommand === "pulls") {
      await interaction.reply(
        `🚧 GitHub pull requests management is currently in development, stay tuned for updates!`,
      );
      return;
    }
  },
} satisfies CommandHandler;
