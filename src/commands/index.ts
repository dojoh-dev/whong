import { SlashCommandBuilder } from "discord.js";

const repos = [
  { name: "api", value: "dojoh-dev/api" },
  { name: "web", value: "dojoh-dev/web" },
  { name: "platform", value: "dojoh-dev/platform" },
  { name: "sdk", value: "dojoh-dev/sdk" },
  { name: "postman", value: "dojoh-dev/postman-collection" },
  { name: "whong", value: "dojoh-dev/whong" },
] satisfies Readonly<Array<{ name: string; value: `${string}/${string}` }>>;

export default [
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Text this help message"),

  new SlashCommandBuilder()
    .setName("info")
    .setDescription("Provides information about the bot"),

  new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server"),

  new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about a user")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The username to get information about")
        .setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("jira")
    .setDescription("Provides Jira-related information or actions")
    .addSubcommandGroup((group) =>
      group
        .setName("issues")
        .setDescription("Manages issues for a dojoh project")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("find")
            .setDescription("Get an existing Jira issue")
            .addStringOption((option) =>
              option
                .setName("id")
                .setDescription("The ID of the issue, (e.g., DOJ-123)")
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("create")
            .setDescription("Create a new Jira issue assigned to you")
            .addStringOption((option) =>
              option
                .setName("title")
                .setDescription("The title of the issue")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("description")
                .setDescription("The description of the issue")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("tag")
                .setDescription("The tag to assign to the issue")
                .setRequired(true)
                .addChoices(
                  { name: "Bug", value: "bug" },
                  { name: "Feature", value: "feature" },
                  { name: "Documentation", value: "documentation" },
                  { name: "Infrastructure", value: "infrastructure" },
                  { name: "Miscellaneous", value: "miscellaneous" },
                  { name: "Other", value: "other" },
                ),
            )
            .addNumberOption((option) =>
              option
                .setName("parent_id")
                .setDescription(
                  "The parent task to link this issue to, (e.g., DOJ-123)",
                )
                .setRequired(false),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("lookup")
            .setDescription(
              "Get the latest Jira issues assigned to you or another user (default: you)",
            )
            .addStringOption((option) =>
              option
                .setName("status")
                .setDescription("The status to filter issues by")
                .setRequired(false)
                .addChoices(
                  { name: "To Do", value: "To-Do" },
                  { name: "Doing", value: "Doing" },
                  { name: "In-Preview", value: "In-Preview" },
                  { name: "Done", value: "Done" },
                ),
            )
            .addStringOption((option) =>
              option
                .setName("username")
                .setDescription("The username to filter issues by assignee")
                .setRequired(false),
            )
            .addNumberOption((option) =>
              option
                .setName("per_page")
                .setDescription("The number of issues to return (default: 5)")
                .setRequired(false),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("move")
            .setDescription("Move a Jira issue to a different status")
            .addStringOption((option) =>
              option
                .setName("id")
                .setDescription("The ID of the issue, (e.g., DOJ-123)")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("status")
                .setDescription("The new status to move the issue to")
                .setRequired(true)
                .addChoices(
                  { name: "To Do", value: "11" },
                  { name: "Doing", value: "21" },
                  { name: "In-Preview", value: "2" },
                  { name: "Done", value: "31" },
                ),
            ),
        ),
    ),

  new SlashCommandBuilder()
    .setName("gh")
    .setDescription("Provides GitHub-related information or actions")
    .addSubcommandGroup((group) =>
      group
        .setName("issues")
        .setDescription("Manages issues for a specified dojoh repository")
        // Lookup issue command
        .addSubcommand((subcommand) =>
          subcommand
            .setName("find")
            .setDescription("Look up an existing GitHub issue")
            .addNumberOption((option) =>
              option
                .setName("id")
                .setDescription("The ID of the issue")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("repo")
                .setDescription("The dojoh repository to look up the issue in")
                .setRequired(true)
                .addChoices(...repos),
            ),
        )
        // Create issue command
        .addSubcommand((subcommand) =>
          subcommand
            .setName("create")
            .setDescription("Create a new GitHub issue")
            .addStringOption((option) =>
              option
                .setName("title")
                .setDescription("The title of the issue")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("description")
                .setDescription("The description of the issue")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("repo")
                .setDescription("The dojoh repository to create the issue in")
                .setRequired(true)
                .addChoices(...repos),
            )
            .addStringOption((option) =>
              option
                .setName("tags")
                .setDescription(
                  "The tags to assign to the issue, comma separated (e.g., bug, documentation)",
                )
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName("assignees")
                .setDescription(
                  "The GitHub usernames to assign the issue to, comma separated (example: user1,user2)",
                )
                .setRequired(false),
            ),
        )
        // Lookup issues command
        .addSubcommand((subcommand) =>
          subcommand
            .setName("lookup")
            .setDescription("Get the latest GitHub issues for a repository")
            .addStringOption((option) =>
              option
                .setName("repo")
                .setDescription(
                  "The dojoh repository to get the latest issues from",
                )
                .setRequired(true)
                .addChoices(...repos),
            )
            .addStringOption((option) =>
              option
                .setName("assignee")
                .setDescription(
                  "The GitHub username to filter issues by assignee",
                )
                .setRequired(false),
            )
            .addNumberOption((option) =>
              option
                .setName("per_page")
                .setDescription("The number of issues to return (default: 5)")
                .setRequired(false),
            ),
        )
        // Update issue command
        .addSubcommand((subcommand) =>
          subcommand
            .setName("update")
            .setDescription("Update an existing GitHub issue")
            .addNumberOption((option) =>
              option
                .setName("id")
                .setDescription("The ID of the issue")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("repo")
                .setDescription("The dojoh repository the issue is in")
                .setRequired(true)
                .addChoices(...repos),
            )
            .addStringOption((option) =>
              option
                .setName("title")
                .setDescription("The new title of the issue")
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName("body")
                .setDescription("The new body of the issue")
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName("tags")
                .setDescription(
                  "The new tags to assign to the issue, comma separated (e.g., bug, documentation)",
                )
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName("assignees")
                .setDescription(
                  "The GitHub usernames to assign the issue to, comma separated (example: user1,user2)",
                )
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName("state")
                .setDescription("The new state of the issue")
                .setRequired(false)
                .addChoices(
                  { name: "Open", value: "open" },
                  { name: "Closed", value: "closed" },
                ),
            ),
        ),
    )
    .addSubcommandGroup((group) =>
      group
        .setName("pr")
        .setDescription(
          "Manages pull requests for a specified dojoh repository",
        )
        // Get PR command
        .addSubcommand((subcommand) =>
          subcommand
            .setName("find")
            .setDescription("Look up an existing GitHub pull request")
            .addNumberOption((option) =>
              option
                .setName("id")
                .setDescription("The ID of the pull request")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("repo")
                .setDescription(
                  "The dojoh repository to look up the pull request in",
                )
                .setRequired(true)
                .addChoices(...repos),
            ),
        )
        // Creaate PR command
        .addSubcommand((subcommand) =>
          subcommand
            .setName("create")
            .setDescription("Create a new GitHub pull request")
            .addStringOption((option) =>
              option
                .setName("title")
                .setDescription("The title of the pull request")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("head")
                .setDescription(
                  "The name of the branch where your changes are implemented",
                )
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("base")
                .setDescription(
                  "The name of the branch you want the changes pulled into",
                )
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("repo")
                .setDescription(
                  "The dojoh repository to create the pull request in",
                )
                .setRequired(true)
                .addChoices(...repos),
            )
            .addStringOption((option) =>
              option
                .setName("assignees")
                .setDescription(
                  "GitHub usernames to assign, comma-separated (e.g., user1, user2); defaults to you",
                )
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName("reviewers")
                .setDescription(
                  "GitHub usernames to request a review from, comma-separated (e.g., user1, user2)",
                )
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName("tags")
                .setDescription(
                  "The tags to assign to the pull request, comma separated (e.g., bug, documentation)",
                )
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName("body")
                .setDescription("The body of the pull request")
                .setRequired(false),
            ),
        )
        // Lookup PR command
        .addSubcommand((subcommand) =>
          subcommand
            .setName("lookup")
            .setDescription(
              "Get the latest GitHub pull requests for a repository",
            )
            .addStringOption((option) =>
              option
                .setName("repo")
                .setDescription(
                  "The dojoh repository to get the latest pull requests from",
                )
                .setRequired(true)
                .addChoices(...repos),
            )
            .addStringOption((option) =>
              option
                .setName("assignee")
                .setDescription(
                  "The GitHub username to filter pull requests by assignee",
                )
                .setRequired(false),
            )
            .addNumberOption((option) =>
              option
                .setName("per_page")
                .setDescription(
                  "The number of pull requests to return (default: 5)",
                )
                .setRequired(false),
            ),
        )
        // Update PR command
        .addSubcommand((subcommand) =>
          subcommand
            .setName("update")
            .setDescription("Update an existing GitHub pull request")
            .addNumberOption((option) =>
              option
                .setName("id")
                .setDescription("The ID of the pull request")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("repo")
                .setDescription("The dojoh repository the pull request is in")
                .setRequired(true)
                .addChoices(...repos),
            )
            .addStringOption((option) =>
              option
                .setName("title")
                .setDescription("The new title of the pull request")
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName("body")
                .setDescription("The new body of the pull request")
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName("tags")
                .setDescription(
                  "The new tags to assign to the pull request, comma separated (e.g., bug, documentation)",
                )
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName("assignees")
                .setDescription(
                  "The GitHub usernames to assign the pull request to, comma separated (e.g., user1,user2)",
                )
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName("reviewers")
                .setDescription(
                  "The GitHub usernames to request a review from, comma separated (e.g., user1,user2)",
                )
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName("state")
                .setDescription("The new state of the pull request")
                .setRequired(false)
                .addChoices(
                  { name: "Open", value: "open" },
                  { name: "Closed", value: "closed" },
                  { name: "Merged", value: "merged" },
                ),
            ),
        )
        // Merge PR command
        .addSubcommand((subcommand) =>
          subcommand
            .setName("merge")
            .setDescription("Merge an existing GitHub pull request")
            .addNumberOption((option) =>
              option
                .setName("id")
                .setDescription("The ID of the pull request")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("repo")
                .setDescription("The dojoh repository the pull request is in")
                .setRequired(true)
                .addChoices(...repos),
            )
            .addStringOption((option) =>
              option
                .setName("strategy")
                .setDescription(
                  "The merge strategy to use. (default: Rebase and merge)",
                )
                .addChoices(
                  { name: "Rebase and merge", value: "rebase" },
                  { name: "Squash and merge", value: "squash" },
                  { name: "Merge commit", value: "merge" },
                )
                .setRequired(true),
            ),
        ),
    ),
];
