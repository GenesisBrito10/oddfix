/**
 * Redacts secrets from any string before it reaches logs or HTTP responses:
 * BetBurger access_token, Bearer JWTs, password fields, Postgres connection
 * strings, and Redis passwords. Defensive — applied even though we already
 * avoid logging these on purpose.
 */
export function sanitizeMessage(input: string): string {
  return input
    .replace(/access_token=[^&\s"']+/gi, 'access_token=***')
    .replace(/(authorization:\s*bearer\s+)[^\s"']+/gi, '$1***')
    .replace(/(["']?password["']?\s*[:=]\s*)["']?[^,"'\s}]+/gi, '$1***')
    .replace(
      /postgres(?:ql)?:\/\/[^@\s]+@[^\s"']+/gi,
      'postgresql://***:***@***',
    )
    .replace(/(redis(?:_password)?["']?\s*[:=]\s*)["']?[^,"'\s}]+/gi, '$1***');
}

/** Recursively sanitizes strings inside an HttpException response payload. */
export function sanitizePayload(value: unknown): unknown {
  if (typeof value === 'string') {
    return sanitizeMessage(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizePayload(item));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        sanitizePayload(item),
      ]),
    );
  }
  return value;
}
