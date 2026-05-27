import { registerAs } from '@nestjs/config';

/**
 * Throttle limits for sensitive auth routes (login/register). Applied only on
 * AuthController — NOT globally — so /surebets/current and the scheduler are
 * unaffected. The BetBurger hourly rate limiter is a separate concern.
 */
export default registerAs('throttle', () => ({
  authTtlSeconds: parseInt(process.env.AUTH_THROTTLE_TTL_SECONDS ?? '60', 10),
  authLimit: parseInt(process.env.AUTH_THROTTLE_LIMIT ?? '10', 10),
}));
