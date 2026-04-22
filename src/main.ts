import { Client, GatewayIntentBits, REST, Routes } from "discord.js";

import env from "./config/env";
import commands from "./commands";

export const refreshCommands = async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(env("CLIENT_ID")), {
      body: commands.map((c) => c.toJSON()),
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};

export const rest = new REST({ version: "10" }).setToken(env("TOKEN"));

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });
