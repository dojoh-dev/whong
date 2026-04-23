import { Routes } from 'discord.js';

import env from './config/env';
import { client } from './core/discord/client';
import commands from './core/discord/commands';
import { rest } from './core/discord/rest';
import { log } from './infra/logger';

(async () => {
  await client.login(env('BOT_TOKEN'));

  const events = await import('@/core/discord/events');

  events.register.clientReady(client);
  events.register.interactionCreate(client);

  try {
    log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(env('CLIENT_ID')), {
      body: commands.map((c) => c.toJSON()),
    });

    log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }

  log('Bot ready!');
})();
