interface SlashCommand {
  name: string;
  description: string;
}

export default [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
] satisfies SlashCommand[];
