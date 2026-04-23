import { client } from '@/core/discord/client';

import type { TextChannel } from 'discord.js';

class DiscordBuilder {
  public channelId: bigint = 1000000000000000000n;

  channel(channelId: bigint) {
    this.channelId = channelId;
    return this;
  }

  async sendMessage(content: string) {
    const channel = await client.channels.fetch(String(this.channelId));
    if (!channel?.isTextBased()) return;

    if (channel.isThread() && channel.archived) {
      await channel.setArchived(false);
    }

    await (channel as TextChannel).send({ content });
  }
}

const discord = new DiscordBuilder();

export default discord;
