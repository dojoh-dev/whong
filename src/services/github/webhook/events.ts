import env from '@/config/env';
import discord from '@/core/sdk/discord';

function handlePush(payload: GithubWebhook.PayloadPush) {
  const MAX_LINE = 110;

  const commits = payload.commits
    .slice(0, 10) // limit to 10 commits to avoid spamming
    .map((c: GithubWebhook.PayloadPush['commits'][number]) => {
      const shortSha = c.id.substring(0, 7);

      const commitMessage = c.message.slice(
        0,
        c.message.indexOf('\n') > 0 ? c.message.indexOf('\n') : 50,
      );

      const firstLine = `${commitMessage} [${shortSha}](${c.url})`;

      const author = `${c.author.name} <<${c.author.email}>>`;
      const dateTime = new Date(c.timestamp).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      const secondLine = `${author} `.padEnd(MAX_LINE) + `${dateTime}`;

      return `${firstLine}\n${secondLine}`;
    })
    .join('\n\n');

  discord.channel(BigInt(env('COMMITS_THREAD_ID')))
    .sendMessage(`💾 Push to **${payload.ref}** on [${payload.repository.full_name}](${payload.repository.html_url})

${commits}
`);
}

function handlePR(payload: GithubWebhook.PayloadPullRequest) {
  const pr = payload.pull_request;

  if (payload.action === 'opened') {
    discord.channel(BigInt(env('PR_THREAD_ID')))
      .sendMessage(`**📥 PR (Opened)** ${pr.title}
\`${pr.head.ref}\` → \`${pr.base.ref}\`

> ID: #${pr.number}
> Url: ${pr.html_url}
> Author: @${pr.user.login}
> Repo: ${payload.repository.full_name}
`);
  } else if (payload.action === 'closed') {
    discord.channel(BigInt(env('PR_THREAD_ID')))
      .sendMessage(`**📥 PR (Closed)** ${pr.title}
${pr.base.ref} <- ${pr.head.ref}

> ID: #${pr.number}
> Url: ${pr.html_url}
> Author: @${pr.user.login}
> Repo: ${payload.repository.full_name}
`);
  }
}

function handleIssue(payload: GithubWebhook.PayloadIssue) {
  const issue = payload.issue;

  if (payload.action === 'opened') {
    discord.channel(BigInt(env('ISSUES_THREAD_ID')))
      .sendMessage(`**🐞 Issue (Opened)** ${issue.title} 
${issue.html_url}

> ID: #${issue.number}
> Author: @${issue.user.login}
> Repo: ${payload.repository.full_name}
`);
  } else if (payload.action === 'closed') {
    discord.channel(BigInt(env('ISSUES_THREAD_ID')))
      .sendMessage(`**🐞 Issue (Closed)** ${issue.title}
${issue.html_url}

> ID: #${issue.number}
> Author: @${issue.user.login}
> Repo: ${payload.repository.full_name}
`);
  }
}

function handleWorkflow(payload: GithubWebhook.PayloadWorkflowRun) {
  const run = payload.workflow_run;

  const conclusion = run.conclusion === 'success' ? '✅ Success' : '❌ Failure';

  discord.channel(BigInt(env('WORKFLOWS_THREAD_ID')))
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

const handleDependabotAlert = (
  payload: GithubWebhook.PayloadDependabotAlert,
) => {
  const alert =
    payload.dependabot_alert as GithubWebhook.PayloadDependabotAlert['dependabot_alert'];

  discord.channel(BigInt(env('CRITICAL_THREAD_ID')))
    .sendMessage(`**🚨 Dependabot Alert:** ${alert.dependency.name}
${alert.html_url}

> ID: #${alert.id}
> Severity: ${alert.severity}
> Repo: ${payload.repository.full_name}
`);
};

const handleCodeScanningAlert = (
  payload: GithubWebhook.PayloadCodeScanningAlert,
) => {
  const alert =
    payload.code_scanning_alert as GithubWebhook.PayloadCodeScanningAlert['code_scanning_alert'];

  discord.channel(BigInt(env('CRITICAL_THREAD_ID')))
    .sendMessage(`**🚨 Code Scanning Alert:** ${alert.rule_id}
${alert.html_url}

> ID: #${alert.id}
> Severity: ${alert.severity}
> Repo: ${payload.repository.full_name}
`);
};

const handleSecretScanningAlert = (
  payload: GithubWebhook.PayloadSecretScanningAlert,
) => {
  const alert =
    payload.secret_scanning_alert as GithubWebhook.PayloadSecretScanningAlert['secret_scanning_alert'];

  discord.channel(BigInt(env('CRITICAL_THREAD_ID')))
    .sendMessage(`**🚨 Secret Scanning Alert:** ${alert.secret_type}
${alert.html_url}

> ID: #${alert.id}
> Severity: ${alert.severity}
> Repo: ${payload.repository.full_name}
`);
};

const handlers: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [e: string]: (payload: any) => void;
} = {
  // commits threads
  push: handlePush,
  // pull-requests thread
  pull_request: handlePR,
  // issues thread
  issues: handleIssue,
  // workflows thread
  workflow_run: handleWorkflow,
  // critical thread
  dependabot_alert: handleDependabotAlert,
  code_scanning_alert: handleCodeScanningAlert,
  secret_scanning_alert: handleSecretScanningAlert,
};

export default async function handleEvent(event: string, payload: unknown) {
  console.debug(`Received event: ${event}`, payload);

  const handler = handlers[event];
  if (!handler) {
    console.warn(`No handler for event: ${event}`);
    return;
  }
  return handler(payload);
}
