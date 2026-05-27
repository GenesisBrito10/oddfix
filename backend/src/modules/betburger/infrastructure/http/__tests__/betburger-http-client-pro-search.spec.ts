import type { ConfigType } from '@nestjs/config';
import betburgerConfig from '../../../../../common/config/betburger.config';
import { BetburgerHttpClient } from '../betburger-http-client';

type BetburgerConfig = ConfigType<typeof betburgerConfig>;

function cfg(accessToken = 'SECRET'): BetburgerConfig {
  return {
    accessToken,
    apiBaseUrl: 'https://api-lv.betburger.com/api/v1',
    liveApiBaseUrl: 'https://api-lv.betburger.com/api/v1',
    prematchApiBaseUrl: 'https://api-pr.betburger.com/api/v1',
    liveRestApiBaseUrl: 'https://rest-api-lv.betburger.com/api/v1',
    prematchRestApiBaseUrl: 'https://rest-api-pr.betburger.com/api/v1',
    liveSearchFilterId: '1741103',
    prematchSearchFilterId: '1149524',
    proSearchLocale: 'en',
    proSearchPerPage: 10,
    httpTimeoutMs: 1000,
  } as unknown as BetburgerConfig;
}

// Search filters drive the bk_ids: bookmakers1 ∪ bookmakers2 of the matched id.
const SEARCH_FILTERS = [
  { id: 1741103, bookmakers1: ['1', '9', '10', '11'], bookmakers2: ['17'] },
  { id: 1149524, bookmakers1: ['461', '19'], bookmakers2: [] },
];

interface Call {
  url: URL;
  init: RequestInit | undefined;
}

const calls: Call[] = [];
let responder: () => Promise<Response>;

beforeEach(() => {
  calls.length = 0;
  responder = () =>
    Promise.resolve(
      new Response(JSON.stringify({ bets: [], arbs: [] }), { status: 200 }),
    );
  const stub = (url: URL, init?: RequestInit): Promise<Response> => {
    calls.push({ url, init });
    if (url.pathname.endsWith('/search_filters')) {
      return Promise.resolve(
        new Response(JSON.stringify(SEARCH_FILTERS), { status: 200 }),
      );
    }
    return responder();
  };
  global.fetch = stub;
});

function bodyOf(call: Call): URLSearchParams {
  const raw = typeof call.init?.body === 'string' ? call.init.body : '';
  return new URLSearchParams(raw);
}

function proSearchCall(): Call {
  const call = calls.find((c) => c.url.pathname.endsWith('/arbs/pro_search'));
  if (!call) {
    throw new Error('pro_search was not called');
  }
  return call;
}

describe('BetburgerHttpClient.getProSearch', () => {
  it('LIVE uses the live host and the live filter/is_live', async () => {
    const client = new BetburgerHttpClient(cfg());
    await client.getProSearch('LIVE');

    const call = proSearchCall();
    expect(call.url.host).toBe('rest-api-lv.betburger.com');
    expect(call.url.pathname).toBe('/api/v1/arbs/pro_search');
    const body = bodyOf(call);
    expect(body.get('is_live')).toBe('true');
    expect(body.get('search_filter[]')).toBe('1741103');
  });

  it('PREMATCH uses the prematch host and the prematch filter/is_live', async () => {
    const client = new BetburgerHttpClient(cfg());
    await client.getProSearch('PREMATCH');

    const call = proSearchCall();
    expect(call.url.host).toBe('rest-api-pr.betburger.com');
    const body = bodyOf(call);
    expect(body.get('is_live')).toBe('false');
    expect(body.get('search_filter[]')).toBe('1149524');
  });

  it('sends bk_ids from the search filter bookmakers1 ∪ bookmakers2', async () => {
    const client = new BetburgerHttpClient(cfg());
    await client.getProSearch('LIVE');

    const body = bodyOf(proSearchCall());
    expect(body.getAll('event_arb_types[]')).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
    ]);
    // LIVE filter 1741103: ['1','9','10','11'] ∪ ['17']
    expect(body.getAll('bk_ids[]')).toEqual(['1', '9', '10', '11', '17']);
  });

  it('PREMATCH bk_ids come from filter 1149524', async () => {
    const client = new BetburgerHttpClient(cfg());
    await client.getProSearch('PREMATCH');
    expect(bodyOf(proSearchCall()).getAll('bk_ids[]')).toEqual(['461', '19']);
  });

  it('falls back to the static bk_ids when the filter is missing', async () => {
    const client = new BetburgerHttpClient({
      ...cfg(),
      prematchSearchFilterId: '999999',
    });
    await client.getProSearch('PREMATCH');
    // unknown filter id -> static curated prematch list (large)
    expect(bodyOf(proSearchCall()).getAll('bk_ids[]').length).toBeGreaterThan(
      100,
    );
  });

  it('sends the urlencoded content-type', async () => {
    const client = new BetburgerHttpClient(cfg());
    await client.getProSearch('LIVE');
    const headers = proSearchCall().init?.headers as Record<string, string>;
    expect(headers['content-type']).toBe(
      'application/x-www-form-urlencoded; charset=UTF-8',
    );
  });

  it('throws when token missing and never leaks the token on error', async () => {
    expect(() => new BetburgerHttpClient(cfg('')).getProSearch('LIVE')).toThrow(
      'BETBURGER_ACCESS_TOKEN is not configured',
    );

    responder = () => Promise.resolve(new Response('{}', { status: 503 }));
    const client = new BetburgerHttpClient(cfg('SUPER-SECRET'));
    const error = await client.getProSearch('LIVE').catch((e: Error) => e);
    expect((error as Error).message).not.toContain('SUPER-SECRET');
  });
});
