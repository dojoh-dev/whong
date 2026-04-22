import { client, updateSlashCommands } from ".";
import env from "./config/env";
import { webhook } from "./webhook";

const main = async () => {
  updateSlashCommands();

  import("./events");

  client.login(env("TOKEN"));

  webhook.start();
};

main();
