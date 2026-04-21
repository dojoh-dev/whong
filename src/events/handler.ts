import {
  type ChatInputCommandInteraction,
  type CacheType,
  MessageFlags,
} from "discord.js";
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
    if (subcommandGroup === "issues" && subcommand === "find") {
      const issueNumber = interaction.options.getNumber("id", true);
      const repoFullname = interaction.options.getString("repo", true);

      if (issueNumber <= 0 && !repoFullname) return;

      const [owner, repo] = repoFullname.split("/");
      const { data: issue } = await octokit.rest.issues.get({
        issue_number: issueNumber,
        owner,
        repo,
      });

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

      const createdAt = new Date(issue.created_at).toDateString();

      const user = issue.user ? `@${issue.user.login}` : "Unknown";

      await interaction.reply(`**Issue #${issue.number}**
**Title:** ${issue.title}
**State:** ${issue.state}
**Assignees:** ${assignees}
**Labels:** ${labels}
**Author:** ${user}
**Created At:** ${createdAt}

> ${body}`);

      return;
    }

    // Create a new issue
    if (subcommandGroup === "issues" && subcommand === "create") {
      const repoFullname = interaction.options.getString("repo", true);
      const [owner, repo] = repoFullname.split("/");

      const { ...payload } = {
        title: interaction.options.getString("title", true),
        body: interaction.options.getString("body", true),
        tags: interaction.options.getString("tags", false) || "",
        assignees: (interaction.options.getString("assignees", false) || "")
          .split(",")
          .map((assignee) => assignee.trim()),
        owner,
        repo,
      };

      try {
        const { data } = await octokit.rest.issues.create({
          ...payload,
          assignees:
            payload.assignees.length > 0
              ? payload.assignees
              : [interaction.user.username],
          labels: payload.tags
            ? payload.tags.split(",").map((tag) => tag.trim())
            : [],
        });

        await interaction.reply(
          `Issue [#${data.number}](${data.html_url}) created! 🎉`,
        );
      } catch (e) {
        console.error("Error creating issue:", e);

        await interaction.reply({
          content: "❌ Sorry, there was an error creating the issue",
          flags: [MessageFlags.Ephemeral],
        });
      }
      return;
    }

    // Get the latest issues for a repository, optionally filtered by assignee
    if (subcommandGroup === "issues" && subcommand === "lookup") {
      try {
        const repoFullname = interaction.options.getString("repo", true);
        const [owner, repo] = repoFullname.split("/");

        const assignee = interaction.options.getString("assignee", false);
        const perPage = interaction.options.getNumber("per_page", false) || 5;

        const { data } = await octokit.rest.issues.listForRepo({
          owner,
          repo,
          assignee: assignee || undefined,
          per_page: perPage,
          sort: "created",
          direction: "desc",
        });

        const issues = data.filter((issue) => !issue.pull_request);

        const issueList = issues
          .map(
            (issue) =>
              `[#${issue.number}](${issue.html_url}) ${issue.title} (${issue.state})`,
          )
          .join("\n");

        if (issues.length === 0) {
          await interaction.reply(`No issues found in **${repoFullname}**.`);
          return;
        }

        await interaction.reply({
          content: `Here are the ${issues.length} most recent issue(s) in **${repoFullname}**:\n\n${issueList}`,
          flags: [MessageFlags.SuppressEmbeds],
        });
      } catch (e) {
        console.error("Error fetching latest issues:", e);

        await interaction.reply({
          content: "❌ Sorry, there was an error fetching the latest issues",
          flags: [MessageFlags.Ephemeral],
        });
      }

      return;
    }

    // Update an existing issue
    if (subcommandGroup === "issues" && subcommand === "update") {
      const issueNumber = interaction.options.getNumber("id", true);
      const repoFullname = interaction.options.getString("repo", true);
      const [owner, repo] = repoFullname.split("/");

      const title = interaction.options.getString("title", false) || undefined;
      const body = interaction.options.getString("body", false) || undefined;
      const tags = interaction.options.getString("tags", false);
      const assignees = interaction.options.getString("assignees", false);
      const state = interaction.options.getString("state", false) as
        | "open"
        | "closed"
        | undefined;

      try {
        const { data } = await octokit.rest.issues.update({
          owner,
          repo,
          issue_number: issueNumber,
          title,
          body,
          labels: tags ? tags.split(",").map((tag) => tag.trim()) : undefined,
          assignees: assignees
            ? assignees.split(",").map((assignee) => assignee.trim())
            : undefined,
          state: state || undefined,
        });

        await interaction.reply(
          `Issue [#${data.number}](${data.html_url}) updated! 🎉`,
        );
      } catch (e) {
        console.error("Error updating issue:", e);

        await interaction.reply({
          content: "❌ Sorry, there was an error updating the issue",
          flags: [MessageFlags.Ephemeral],
        });
      }
      return;
    }

    // Get a single pull request by ID
    if (subcommandGroup === "pr" && subcommand === "find") {
      const prNumber = interaction.options.getNumber("id", true);
      const repoFullname = interaction.options.getString("repo", true);

      const [owner, repo] = repoFullname.split("/");

      try {
        const { data: pr } = await octokit.rest.pulls.get({
          owner,
          repo,
          pull_number: prNumber,
        });

        let body = "> *No description provided.*";

        if (pr.body) {
          body = pr.body.split("\n").join("\n> ");
          body = body.endsWith("\n> ") ? body.slice(0, -3) : body;
        }

        let tags = "None";

        if (pr.labels && pr.labels.length > 0) {
          tags = pr.labels
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

        if (pr.assignees && pr.assignees.length > 0) {
          assignees = pr.assignees
            .map((assignee) => `@${assignee.login}`)
            .join(", ");
        }

        let reviewers = "None";

        if (pr.requested_reviewers && pr.requested_reviewers.length > 0) {
          reviewers = pr.requested_reviewers
            .map((reviewer) => `@${reviewer.login}`)
            .join(", ");
        }

        const createdAt = new Date(pr.created_at).toDateString();
        const user = pr.user ? `@${pr.user.login}` : "Unknown";

        await interaction.reply(`**PR #${pr.number}**
**Title:** ${pr.title}
**State:** ${pr.state}
**Labels:** ${tags}
**Assignees:** ${assignees}
**Reviewers:** ${reviewers}
**Author:** ${user}
**Created At:** ${createdAt}

> ${body}`);
      } catch (e) {
        console.error("Error fetching PR:", e);

        await interaction.reply({
          content: "❌ Sorry, there was an error fetching the PR",
          flags: [MessageFlags.Ephemeral],
        });
      }

      return;
    }

    // Update a pull request
    if (subcommandGroup === "pr" && subcommand === "update") {
      const prNumber = interaction.options.getNumber("id", true);
      const repoFullname = interaction.options.getString("repo", true);
      const [owner, repo] = repoFullname.split("/");

      const title = interaction.options.getString("title", false) || undefined;
      const body = interaction.options.getString("body", false) || undefined;
      const tags = interaction.options.getString("tags", false);
      const state = interaction.options.getString("state", false) as
        | "open"
        | "closed"
        | undefined;

      try {
        const { data } = await octokit.rest.pulls.update({
          owner,
          repo,
          pull_number: prNumber,
          title,
          body,
          labels: tags ? tags.split(",").map((tag) => tag.trim()) : undefined,
          state: state || undefined,
        });

        await interaction.reply(
          `PR [#${data.number}](${data.html_url}) updated! 🎉`,
        );
      } catch (e) {
        console.error("Error updating PR:", e);

        await interaction.reply({
          content: "❌ Sorry, there was an error updating the PR",
          flags: [MessageFlags.Ephemeral],
        });
      }
    }

    // Create a new pull request
    if (subcommandGroup === "pr" && subcommand === "create") {
      const repoFullname = interaction.options.getString("repo", true);
      const [owner, repo] = repoFullname.split("/");

      const { reviewers, ...payload } = {
        title: interaction.options.getString("title", true),
        head: interaction.options.getString("head", true),
        base: interaction.options.getString("base", true),
        body: interaction.options.getString("body", false),
        tags: interaction.options.getString("tags", false) || "",
        assignees: (
          interaction.options.getString("assignees", false) ||
          interaction.user.username
        )
          .split(",")
          .map((assignee) => assignee.trim()),
        reviewers: (
          interaction.options.getString("reviewers", false) || "itssimmons"
        )
          .split(",")
          .map((reviewer) => reviewer.trim()),
        owner,
        repo,
      };

      try {
        const { data } = await octokit.rest.pulls.create({
          ...payload,
          assignees:
            payload.assignees.length > 0 ? payload.assignees : undefined,
        });

        await octokit.rest.pulls.requestReviewers({
          owner,
          repo,
          pull_number: data.number,
          reviewers: reviewers.length > 0 ? reviewers : undefined,
        });

        await interaction.reply(
          `PR [#${data.number}](${data.html_url}) created! 🎉`,
        );
      } catch (e) {
        console.error("Error creating PR:", e);

        await interaction.reply({
          content: "❌ Sorry, there was an error creating the PR",
          flags: [MessageFlags.Ephemeral],
        });
      }
    }

    // Get the latest pull requests for a repository, optionally filtered by assignee
    if (subcommandGroup === "pr" && subcommand === "lookup") {
      try {
        const repoFullname = interaction.options.getString("repo", true);
        const [owner, repo] = repoFullname.split("/");

        const assignee = interaction.options.getString("assignee", false);
        const perPage = interaction.options.getNumber("per_page", false) || 5;

        const { data: pulls } = await octokit.rest.pulls.list({
          owner,
          repo,
          assignee: assignee || undefined,
          per_page: perPage,
          sort: "created",
          direction: "desc",
        });

        if (pulls.length === 0) {
          await interaction.reply(`No PRs found in **${repoFullname}**.`);
          return;
        }

        const prList = pulls
          .map(
            (pr) => `[#${pr.number}](${pr.html_url}) ${pr.title} (${pr.state})`,
          )
          .join("\n");

        await interaction.reply({
          content: `Here are the ${pulls.length} pull request(s) in **${repoFullname}**:\n\n${prList}`,
          flags: [MessageFlags.SuppressEmbeds],
        });
      } catch (e) {
        console.error("Error fetching pull requests:", e);

        await interaction.reply({
          content: "❌ Sorry, there was an error fetching the pull requests",
          flags: [MessageFlags.Ephemeral],
        });
      }

      return;
    }

    // Merge a pull request
    if (subcommandGroup === "pr" && subcommand === "merge") {
      const repoFullname = interaction.options.getString("repo", true);
      const [owner, repo] = repoFullname.split("/");

      const prNumber = interaction.options.getNumber("id", true);
      const strategy = interaction.options.getString("strategy", true) as
        | "merge"
        | "squash"
        | "rebase";

      try {
        const { data } = await octokit.rest.pulls.merge({
          owner,
          repo,
          merge_method: strategy,
          pull_number: prNumber,
        });

        if (!data.merged) {
          await interaction.reply({
            content: `😔 PR #${prNumber} could not be merged. Reason: ${data.message}`,
            flags: [MessageFlags.Ephemeral],
          });
          return;
        }

        await interaction.reply(
          `PR #${prNumber} merged successfully using the **${strategy}** strategy! 🎉`,
        );
      } catch (e) {
        console.error("Error merging PR:", e);

        await interaction.reply({
          content: "❌ Sorry, there was an error merging the PR",
          flags: [MessageFlags.Ephemeral],
        });
      }
      return;
    }

    await interaction.reply({
      content:
        "❌ Invalid subcommand. Please check the command options and try again.",
      flags: [MessageFlags.Ephemeral],
    });
  },
} satisfies CommandHandler;
