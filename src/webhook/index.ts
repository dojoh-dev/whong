import Fastify from "fastify";

import env from "@/config/env";
import handleEvent from "./events";
import { verifySignature } from "./signature";

const build = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(import("fastify-raw-body"), {
    field: "rawBody",
    global: false,
    encoding: "utf8",
    runFirst: true,
  });

  fastify.get("/health", async (_, reply) => {
    return reply.status(200).send("ok");
  });

  fastify.post(
    "/github/webhook",
    { config: { rawBody: true } },
    async (req, reply) => {
      const signature = req.headers["x-hub-signature-256"] as string;
      const event = req.headers["x-github-event"] as string;

      const rawBody = (req as any).rawBody as string;

      if (!signature || !event) {
        return reply.status(400).send("Missing headers");
      }

      if (!rawBody) {
        return reply.status(400).send("Missing body");
      }

      if (!verifySignature(rawBody, signature)) {
        return reply.status(401).send("Invalid signature");
      }

      const payload = JSON.parse(rawBody);

      // do NOT block response
      handleEvent(event, payload).catch(console.error);

      return reply.status(200).send("ok");
    },
  );

  return fastify;
};

export const webhook = {
  async start() {
    const port = env("WEBHOOK_PORT", "3000");
    const app = await build();

    app.listen({ port: parseInt(port) }, (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      app.log.info(`Webhook server listening at ${address}`);
    });
  },
};
