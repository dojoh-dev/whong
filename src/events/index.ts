import { Events } from "discord.js";

import { client } from "..";
import handler from "./handler";

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag} 🎉`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const key = interaction.commandName as keyof typeof handler;

  if (!(key in handler)) {
    console.debug(`No handler found for command: ${interaction.commandName}`);
  }

  await handler[key](interaction);
});
