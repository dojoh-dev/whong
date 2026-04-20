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
    .addSubcommand((subcommand) =>
      subcommand
        .setName("issues")
        .setDescription("Manages issues for a dojoh project")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The ID of the issue")
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("The title of the issue")
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("The description of the issue")
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName("tags")
            .setDescription("The tags to assign to the issue")
            .setRequired(false),
        )
        .addUserOption((option) =>
          option
            .setName("assignee")
            .setDescription("The user to assign the issue to (defaults to you)")
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName("parent")
            .setDescription("The parent task to link this issue to")
            .setRequired(false),
        ),
    ),

  new SlashCommandBuilder()
    .setName("gh")
    .setDescription("Provides GitHub-related information or actions")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("issues")
        .setDescription("Manages issues for a specified dojoh repository")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The ID of the issue")
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("The title of the issue")
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("The description of the issue")
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("The type of the issue")
            .setRequired(false)
            .addChoices(
              { name: "Bug", value: "bug" },
              { name: "Feature", value: "feature" },
              { name: "Enhancement", value: "enhancement" },
              { name: "Question", value: "question" },
            ),
        )
        .addStringOption((option) =>
          option
            .setName("repo")
            .setDescription("The dojoh repository to create the issue in")
            .setRequired(false)
            .addChoices(...repos),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("pulls")
        .setDescription(
          "Manages pull requests for a specified dojoh repository",
        )
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The ID of the pull request")
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("The title of the pull request")
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("The description of the pull request")
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName("repo")
            .setDescription(
              "The dojoh repository to create the pull request in",
            )
            .setRequired(false)
            .addChoices(...repos),
        ),
    ),
];
