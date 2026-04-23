import { REST } from 'discord.js';

import env from '@/config/env';

export const rest = new REST({ version: '10' }).setToken(env('BOT_TOKEN'));
