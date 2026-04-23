import type { FastifyInstance } from 'fastify';

export default async function (f: FastifyInstance) {
  f.get('/health', async (_, reply) => {
    return reply.status(200).send('ok');
  });
}
