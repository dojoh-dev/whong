declare namespace Octokit {
  export interface Issue {
    title: string;
    key: string;
    fields: {
      summary: string;
      status: {
        name: string;
      };
      assignee: {
        displayName: string;
      };
    };
  }
}

declare namespace GithubWebhook {
  export interface PayloadPush {
    ref: string;
    repository: {
      full_name: string;
      html_url: string;
    };
    commits: {
      id: string;
      message: string;
      url: string;
      author: {
        name: string;
        email: string;
      };
      timestamp: string;
    }[];
  }

  export interface PayloadPullRequest {
    action: 'opened' | 'closed';

    pull_request: {
      title: string;
      number: number;
      html_url: string;
      user: {
        login: string;
      };
      head: {
        ref: string;
      };
      base: {
        ref: string;
      };
    };
    repository: {
      full_name: string;
    };
  }

  export interface PayloadIssue {
    action: 'opened' | 'closed';
    issue: {
      title: string;
      number: number;
      html_url: string;
      user: {
        login: string;
      };
    };
    repository: {
      full_name: string;
    };
  }

  export interface PayloadWorkflowRun {
    action: 'completed';
    workflow_run: {
      display_title: string;
      conclusion:
        | 'success'
        | 'failure'
        | 'neutral'
        | 'cancelled'
        | 'timed_out'
        | 'action_required';
      html_url: string;
      id: number;
      head_branch: string;
      actor: {
        login: string;
      };
      status: 'completed';
      run_attempt: number;
    };
    repository: {
      full_name: string;
    };
  }

  export interface PayloadDependabotAlert {
    dependabot_alert: {
      id: number;
      html_url: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      dependency: {
        name: string;
      };
    };
    repository: {
      full_name: string;
    };
  }

  export interface PayloadCodeScanningAlert {
    code_scanning_alert: {
      id: number;
      rule_id: number;
      html_url: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      details: string;
    };
    repository: {
      full_name: string;
    };
  }

  export interface PayloadSecretScanningAlert {
    secret_scanning_alert: {
      id: number;
      html_url: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      secret_type: string;
    };
    repository: {
      full_name: string;
    };
  }
}
