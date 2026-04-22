import { client, refreshCommands } from "./main";
import env from "./config/env";
import { webhook } from "./webhook";

const main = async () => {
  refreshCommands();

  import("./events");

  client.login(env("TOKEN"));

  webhook.start();
};

main();
