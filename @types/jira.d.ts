declare namespace Jira {
  export interface Fields {
    summary: string;
    description?: string;
    issuetype: {
      name: string;
    };
    project: {
      key: string;
    };
    assignee?: {
      id: string;
    };
    reporter?: {
      id: string;
    };
    priority?: {
      id: string;
    };
    parent?: {
      key: string;
    };
    labels?: string[];
  }
}
