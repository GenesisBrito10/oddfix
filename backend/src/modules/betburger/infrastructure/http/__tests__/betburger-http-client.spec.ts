import type { ConfigType } from '@nestjs/config';
import betburgerConfig from '../../../../../common/config/betburger.config';
import { BetburgerHttpClient } from '../betburger-http-client';

type BetburgerConfig = ConfigType<typeof betburgerConfig>;

function cfg(accessToken: string): BetburgerConfig {
  return {
    accessToken,
    apiBaseUrl: 'https://api-lv.betburger.com/api/v1',
    httpTimeoutMs: 1000,
  } as unknown as BetburgerConfig;
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status });
}

// Typed fetch stub: records the URLs it was called with and replies with
// whatever `responder` is set to for the current test. Avoids jest.fn() typing
// quirks so mock inspection stays type-safe.
const calls: URL[] = [];
let responder: () => Promise<Response>;

beforeEach(() => {
  calls.length = 0;
  responder = () => Promise.resolve(jsonResponse(200, {}));
  const stub = (input: URL): Promise<Response> => {
    calls.push(input);
    return responder();
  };
  global.fetch = stub;
});

describe('BetburgerHttpClient', () => {
  it('throws a clear error when the token is missing and never calls fetch', () => {
    const client = new BetburgerHttpClient(cfg(''));
    expect(() => client.getUserBookmakers()).toThrow(
      'BETBURGER_ACCESS_TOKEN is not configured',
    );
    expect(calls).toHaveLength(0);
  });

  it('builds the URL with access_token + locale and returns parsed JSON', async () => {
    responder = () => Promise.resolve(jsonResponse(200, { bookmakers: [] }));
    const client = new BetburgerHttpClient(cfg('SECRET'));

    const result = await client.getUserBookmakers();

    expect(result).toEqual({ bookmakers: [] });
    expect(calls[0].pathname).toContain('/user_bookmakers');
    expect(calls[0].searchParams.get('access_token')).toBe('SECRET');
    expect(calls[0].searchParams.get('locale')).toBe('en');
  });

  it('does not retry on 4xx', async () => {
    responder = () => Promise.resolve(jsonResponse(404, {}));
    const client = new BetburgerHttpClient(cfg('SECRET'));

    await expect(client.getDirectories()).rejects.toThrow('status 404');
    expect(calls).toHaveLength(1);
  });

  it('retries on 5xx and never leaks the token in the error', async () => {
    responder = () => Promise.resolve(jsonResponse(503, {}));
    const client = new BetburgerHttpClient(cfg('SUPER-SECRET'));

    const error = await client.getUserBookmakers().catch((e: Error) => e);

    expect(calls).toHaveLength(3);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).not.toContain('SUPER-SECRET');
  });
});
