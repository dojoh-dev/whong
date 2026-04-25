import handleEvent from '@/services/github/webhook/events';
import { verifySignature } from '@/services/github/webhook/signature';

import type { FastifyPluginCallback } from 'fastify';

const plugin: FastifyPluginCallback = (f, opts, done) => {
  f.post('/webhook', { config: { rawBody: true } }, async (req, reply) => {
    const signature = req.headers['x-hub-signature-256'] as string;
    const event = req.headers['x-github-event'] as string;

    const rawBody = (req as { rawBody: string }).rawBody;

    if (!signature || !event) {
      return reply.status(400).send('Missing headers');
    }

    if (!rawBody) {
      return reply.status(400).send('Missing body');
    }

    if (!verifySignature(rawBody, signature)) {
      return reply.status(401).send('Invalid signature');
    }

    const payload = JSON.parse(rawBody);

    // do NOT block response
    handleEvent(event, payload).catch(console.error);

    return reply.status(200).send('ok');
  });

  done();
};

export default plugin;
