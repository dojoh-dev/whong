export const repos = [
  { name: 'api', value: 'dojoh-dev/api' },
  { name: 'web', value: 'dojoh-dev/web' },
  { name: 'platform', value: 'dojoh-dev/platform' },
  { name: 'sdk', value: 'dojoh-dev/sdk' },
  { name: 'postman', value: 'dojoh-dev/postman-collection' },
  { name: 'whong', value: 'dojoh-dev/whong' },
] satisfies Readonly<Array<{ name: string; value: `${string}/${string}` }>>;
