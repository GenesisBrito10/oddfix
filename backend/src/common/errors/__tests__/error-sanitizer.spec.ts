import { sanitizeMessage, sanitizePayload } from '../error-sanitizer';

describe('sanitizeMessage', () => {
  it('redacts a BetBurger access_token', () => {
    const out = sanitizeMessage(
      'GET https://rest-api-lv.betburger.com/api/v1/arbs?access_token=abc123secret&x=1',
    );
    expect(out).toContain('access_token=***');
    expect(out).not.toContain('abc123secret');
  });

  it('redacts a Bearer JWT', () => {
    const out = sanitizeMessage(
      'Authorization: Bearer eyJhbGciOiJIUzI1.payload.sig',
    );
    expect(out).not.toContain('eyJhbGciOiJIUzI1.payload.sig');
    expect(out.toLowerCase()).toContain('bearer ***');
  });

  it('redacts password fields', () => {
    expect(sanitizeMessage('password=supersecret')).toBe('password=***');
    expect(sanitizeMessage('"password": "supersecret"')).toContain('***');
  });

  it('redacts a Postgres connection string', () => {
    const out = sanitizeMessage(
      'postgresql://oddfix_user:oddfix_pass@localhost:5433/oddfix_db',
    );
    expect(out).not.toContain('oddfix_pass');
    expect(out).toContain('postgresql://***:***@***');
  });

  it('leaves a clean message untouched', () => {
    expect(sanitizeMessage('Surebet not found')).toBe('Surebet not found');
  });
});

describe('sanitizePayload', () => {
  it('sanitizes strings inside nested objects/arrays', () => {
    const out = sanitizePayload({
      statusCode: 500,
      message: ['access_token=leak123', 'ok'],
      nested: { detail: 'password=hunter2' },
    }) as { message: string[]; nested: { detail: string } };

    expect(out.message[0]).toContain('access_token=***');
    expect(out.message[0]).not.toContain('leak123');
    expect(out.message[1]).toBe('ok');
    expect(out.nested.detail).not.toContain('hunter2');
  });

  it('passes through non-string primitives', () => {
    expect(sanitizePayload(42)).toBe(42);
    expect(sanitizePayload(true)).toBe(true);
    expect(sanitizePayload(null)).toBeNull();
  });
});
