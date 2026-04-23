import { create } from '@/core/discord/commands/jira/issues/create';
import { find } from '@/core/discord/commands/jira/issues/find';
import { lookup } from '@/core/discord/commands/jira/issues/lookup';
import { move } from '@/core/discord/commands/jira/issues/move';

export default {
  issues: {
    create,
    find,
    lookup,
    move,
  },
};
