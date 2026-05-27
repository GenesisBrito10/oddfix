import 'reflect-metadata';
import { validateEnv } from '../env.validation';

describe('validateEnv', () => {
  it('applies defaults in development without a full .env', () => {
    const env = validateEnv({ NODE_ENV: 'development' });
    expect(env.PORT).toBe(3001);
    expect(env.JWT_EXPIRES_IN).toBe('7d');
    expect(env.AUTH_THROTTLE_LIMIT).toBe(10);
  });

  it('throws in production without JWT_SECRET', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'production',
        CORS_ORIGINS: 'https://app.example.com',
      }),
    ).toThrow(/JWT_SECRET is required in production/);
  });

  it('throws in production without CORS_ORIGINS', () => {
    expect(() =>
      validateEnv({ NODE_ENV: 'production', JWT_SECRET: 'a-strong-secret' }),
    ).toThrow(/CORS_ORIGINS must list at least one origin/);
  });

  it('throws in production when CORS_ORIGINS contains the wildcard', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'production',
        JWT_SECRET: 'a-strong-secret',
        CORS_ORIGINS: '*',
      }),
    ).toThrow(/must not use the "\*" wildcard/);
  });

  it('passes in production with secret + explicit origins', () => {
    const env = validateEnv({
      NODE_ENV: 'production',
      JWT_SECRET: 'a-strong-secret',
      CORS_ORIGINS: 'https://app.example.com,https://www.example.com',
    });
    expect(env.NODE_ENV).toBe('production');
  });
});
