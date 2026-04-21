import env from "@/config/env";
import discord from "@/sdk/discord";

function handlePush(payload: any) {
  const commits = payload.commits
    .slice(0, 15) // avoid spam
    .map(
      (c: any) =>
        `${c.message} ..................................................... [${c.sha}](${c.html_url})
  ${c.author.name} <<${c.author.email}>>                                      ${c.author.date}`,
    )
    .join("\n");

  discord.channel(BigInt(env("COMMITS_THREAD_ID")))
    .sendMessage(`💾 Push to ${payload.base_ref} on (${payload.repository.full_name})[${payload.repository.html_url}]
    
${commits}
`);
}

function handlePR(payload: any) {
  const pr = payload.pull_request;

  if (payload.action === "opened") {
    discord.channel(BigInt(env("PR_THREAD_ID")))
      .sendMessage(`**📥 PR (Opened)** ${pr.title}
\`${pr.head.ref}\` → \`${pr.base.ref}\`

> ID: #${pr.number}
> Url: ${pr.html_url}
> Author: @${pr.user.login}
> Repo: ${payload.repository.full_name}
`);
  } else if (payload.action === "closed") {
    discord.channel(BigInt(env("PR_THREAD_ID")))
      .sendMessage(`**📥 PR (Closed)** ${pr.title}
${pr.base.ref} <- ${pr.head.ref}

> ID: #${pr.number}
> Url: ${pr.html_url}
> Author: @${pr.user.login}
> Repo: ${payload.repository.full_name}
`);
  }
}

function handleIssue(payload: any) {
  const issue = payload.issue;

  if (payload.action === "opened") {
    discord.channel(BigInt(env("ISSUES_THREAD_ID")))
      .sendMessage(`**🐞 Issue (Opened)** ${issue.title} 
${issue.html_url}

> ID: #${issue.number}
> Author: @${issue.user.login}
> Repo: ${payload.repository.full_name}
`);
  } else if (payload.action === "closed") {
    discord.channel(BigInt(env("ISSUES_THREAD_ID")))
      .sendMessage(`**🐞 Issue (Closed)** ${issue.title}
${issue.html_url}

> ID: #${issue.number}
> Author: @${issue.user.login}
> Repo: ${payload.repository.full_name}
`);
  }
}

function handleWorkflow(payload: any) {
  const run = payload.workflow_run;

  const conclusion = run.conclusion === "success" ? "✅ Success" : "❌ Failure";

  discord.channel(BigInt(env("WORKFLOWS_THREAD_ID")))
    .sendMessage(`**⚙️ Workflow ${run.display_title}**  (${conclusion})
${run.html_url}

> ID: #${run.id}
> Author: @${run.actor.login}
> Status: ${run.status}
> Ref: ${run.head_branch}
> Run attempt: ${run.run_attempt}
> Repo: ${payload.repository.full_name}
`);
}

const handleCritical =
  (
    type: "dependabot_alert" | "code_scanning_alert" | "secret_scanning_alert",
  ) =>
  (payload: any) => {
    if (type === "dependabot_alert") {
      const alert = payload.dependabot_alert;
      discord.channel(BigInt(env("CRITICAL_THREAD_ID")))
        .sendMessage(`**🚨 Dependabot Alert:** ${alert.dependency.name}
${alert.html_url}

> ID: #${alert.id}
> Severity: ${alert.severity}
> Repo: ${payload.repository.full_name}
`);
    } else if (type === "code_scanning_alert") {
      const alert = payload.code_scanning_alert;
      discord.channel(BigInt(env("CRITICAL_THREAD_ID")))
        .sendMessage(`**🚨 Code Scanning Alert:** ${alert.rule_id}
${alert.html_url}

> ID: #${alert.id}
> Severity: ${alert.severity}
> Repo: ${payload.repository.full_name}
`);
    } else if (type === "secret_scanning_alert") {
      const alert = payload.secret_scanning_alert;
      discord.channel(BigInt(env("CRITICAL_THREAD_ID")))
        .sendMessage(`**🚨 Secret Scanning Alert:** ${alert.secret_type}
${alert.html_url}

> ID: #${alert.id}
> Severity: ${alert.severity}
> Repo: ${payload.repository.full_name}
`);
    }
  };

const handlers: Record<string, Function> = {
  // commits threads
  push: handlePush,
  // pull-requests thread
  pull_request: handlePR,
  // issues thread
  issues: handleIssue,
  // NOTE: workflow_run might be too noisy, consider to disable it if it's not useful
  // workflows thread
  workflow_run: handleWorkflow,
  // critical thread
  dependabot_alert: handleCritical("dependabot_alert"),
  code_scanning_alert: handleCritical("code_scanning_alert"),
  secret_scanning_alert: handleCritical("secret_scanning_alert"),
};

export default async function handleEvent(event: string, payload: any) {
  console.debug(`Received event: ${event}`, payload);

  const handler = handlers[event];
  if (!handler) {
    console.warn(`No handler for event: ${event}`);
    return;
  }
  return handler(payload);
}
