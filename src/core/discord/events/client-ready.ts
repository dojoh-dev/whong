import { Events } from 'discord.js';

import { log } from '@/infra/logger';

import type { Client } from 'discord.js';

export default function (client: Client<boolean>): void {
  client.once(Events.ClientReady, (readyClient) => {
    log(`Logged in as ${readyClient.user.tag}`);
  });

  return;
}
