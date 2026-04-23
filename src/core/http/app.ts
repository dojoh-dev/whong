import Fastify from 'fastify';

export const build = async () => {
  const app = Fastify({
    logger: true,
  });

  await app.register(import('fastify-raw-body'), {
    field: 'rawBody',
    global: false,
    encoding: 'utf8',
    runFirst: true,
  });

  await app.register(async (instance) => {
    const routes = await import('@/core/http/routes/health.route');
    routes.default(instance);
  });
  await app.register(
    async (instance) => {
      const routes = await import('@/core/http/routes/github.route');
      routes.default(instance);
    },
    {
      prefix: '/github',
    },
  );

  return app;
};
