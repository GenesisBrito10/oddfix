import { registerAs } from '@nestjs/config';

/**
 * CORS config from env. `CORS_ORIGINS` is a comma-separated allowlist; never a
 * wildcard in production (enforced in env.validation). `CORS_CREDENTIALS`
 * toggles Access-Control-Allow-Credentials (needed when the browser sends the
 * auth cookie / Authorization header cross-origin).
 */
export default registerAs('cors', () => ({
  origins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0),
  credentials:
    (process.env.CORS_CREDENTIALS ?? 'true').toLowerCase() === 'true',
}));
