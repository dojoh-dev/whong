import { Octokit } from "octokit";

import env from "@/config/env";

const octokit = new Octokit({
  auth: env("GITHUB_TOKEN"),
});

export default octokit;
