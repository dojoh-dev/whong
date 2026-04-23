import assert from 'node:assert';

import env from '@/config/env';
import cache from '@/infra/cache';

type JiraToken = `Basic ${string}`;

class JiraSdk {
  private _authToken: JiraToken;
  private _domain: string;

  /**
   * Creates a new Jira REST client.
   *
   * @param auth - The Jira API token in the format "email:api_token".
   * @param domain - The Jira instance domain without 'atlassiant.net' (e.g., "your-domain" for "your-domain.atlassian.net").
   *
   * @example
   *
   * ```ts
   * const jira = new JiraRest({
   *   auth: "you@gmail.com:your_api_token",
   *   domain: "your-domain",
   * });
   * ```
   */
  constructor({
    auth,
    domain,
  }: {
    auth: `${string}:${string}`;
    domain: string;
  }) {
    assert(auth, 'Auth token is required');
    assert(domain, 'Domain is required');

    this._authToken = `Basic ${Buffer.from(auth).toString('base64')}`;
    this._domain = domain;
  }

  public user = {
    search: async (query: string) => {
      const cacheKey = `jira_user_search_${query}`;

      if (cache.has(cacheKey)) {
        return JSON.parse(cache.get(cacheKey) as string);
      }

      const response = await fetch(
        `https://${this._domain}.atlassian.net/rest/api/3/user/search?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: this._authToken,
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to search users: ${response.status} ${errorText}`,
        );
      }

      const json = await response.json();

      cache.set(cacheKey, JSON.stringify(json));

      return json;
    },
  };

  public issue = {
    get: async (issueIdOrKey: string) => {
      const response = await fetch(
        `https://${this._domain}.atlassian.net/rest/api/2/issue/${issueIdOrKey}`,
        {
          method: 'GET',
          headers: {
            Authorization: this._authToken,
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get issue: ${response.status} ${errorText}`);
      }

      return await response.json();
    },

    create: async (fields: Jira.Fields) => {
      const response = await fetch(
        `https://${this._domain}.atlassian.net/rest/api/2/issue`,
        {
          method: 'POST',
          headers: {
            Authorization: this._authToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fields: fields }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to create issue: ${response.status} ${errorText}`,
        );
      }

      return await response.json();
    },

    transitions: async (issueIdOrKey: string, status: number) => {
      const response = await fetch(
        `https://${this._domain}.atlassian.net/rest/api/3/issue/${issueIdOrKey}/transitions`,
        {
          method: 'POST',
          headers: {
            Authorization: this._authToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transition: {
              id: status,
            },
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to transition issue: ${response.status} ${errorText}`,
        );
      }

      // On success, Jira returns 204 No Content
      return;
    },
  };

  public jql = {
    search: async (
      jql: string,
      params: {
        maxResults: number;
        fields: string[];
        orderBy: string;
        expand: string[];
      },
    ) => {
      const searchParams = new URLSearchParams({
        jql,
        maxResults: params.maxResults.toString(),
        fields: params.fields.join(','),
        orderBy: params.orderBy,
        expand: params.expand.join(','),
      });

      const cacheKey = `jira_jql_search_${searchParams.toString()}`;

      if (cache.has(cacheKey)) {
        return JSON.parse(cache.get(cacheKey) as string);
      }

      const response = await fetch(
        `https://${this._domain}.atlassian.net/rest/api/3/search/jql?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: this._authToken,
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to search issues with JQL: ${response.status} ${errorText}`,
        );
      }

      const json = await response.json();

      cache.set(cacheKey, JSON.stringify(json));

      return json;
    },
  };
}

export default new JiraSdk({
  auth: `${env('JIRA_EMAIL')}:${env('JIRA_API_TOKEN')}`,
  domain: env('JIRA_DOMAIN'),
});
