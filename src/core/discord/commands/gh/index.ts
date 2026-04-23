import { create as issueCreate } from '@/core/discord/commands/gh/issues/create';
import { find as issueFind } from '@/core/discord/commands/gh/issues/find';
import { lookup as issueLookup } from '@/core/discord/commands/gh/issues/lookup';
import { update as issueUpdate } from '@/core/discord/commands/gh/issues/update';
import { create as prCreate } from '@/core/discord/commands/gh/pr/create';
import { find as prFind } from '@/core/discord/commands/gh/pr/find';
import { lookup as prLookup } from '@/core/discord/commands/gh/pr/lookup';
import { merge as prMerge } from '@/core/discord/commands/gh/pr/merge';
import { update as prUpdate } from '@/core/discord/commands/gh/pr/update';

export default {
  issues: {
    create: issueCreate,
    find: issueFind,
    lookup: issueLookup,
    update: issueUpdate,
  },
  pr: {
    create: prCreate,
    find: prFind,
    lookup: prLookup,
    merge: prMerge,
    update: prUpdate,
  },
};
