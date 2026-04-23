import crypto from 'node:crypto';

import env from '@/config/env';

export function verifySignature(payload: string, signature: string) {
  const hmac = crypto.createHmac('sha256', env('WEBHOOK_GITHUB_SECRET'));
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
