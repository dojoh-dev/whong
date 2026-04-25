import Fastify from 'fastify';

export const build = async (opts = { logger: true }) => {
  const app = Fastify(opts);

  await app.register(import('fastify-raw-body'), {
    field: 'rawBody',
    global: false,
    encoding: 'utf8',
    runFirst: true,
  });

  await app.register(import('@/core/http/routes/health.route'));
  await app.register(import('@/core/http/routes/github.route'), {
    prefix: '/github',
  });

  await app.ready();

  return app;
};
