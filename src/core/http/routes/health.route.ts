import type { FastifyPluginCallback } from 'fastify';

const plugin: FastifyPluginCallback = (f, opts, done) => {
  f.get('/health', async (_, reply) => {
    return reply.status(200).send('ok');
  });

  done();
};

export default plugin;
