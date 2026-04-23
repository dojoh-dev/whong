import { build } from '@/core/http/app';
import env from './config/env';
import { log } from './infra/logger';

(async () => {
  const app = await build();

  app.listen({ port: env('WEBHOOK_PORT', 3000) }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    log(`Server listening at ${address}`);
  });
})();
