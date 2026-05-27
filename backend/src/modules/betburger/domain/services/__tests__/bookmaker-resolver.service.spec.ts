import {
  BookmakerCloneInput,
  BookmakerResolver,
  UserBookmakerInput,
} from '../bookmaker-resolver.service';

describe('BookmakerResolver', () => {
  const resolver = new BookmakerResolver();

  it('resolves a bookmaker with a matching clone (name/url/domain)', () => {
    const userBookmakers: UserBookmakerInput[] = [
      {
        bookmakerId: 461,
        cloneId: 1521,
        active: true,
        domain: null,
        raw: { bookmaker_id: 461 },
      },
    ];
    const clones: BookmakerCloneInput[] = [
      {
        id: 1521,
        name: 'BetNacional',
        url: 'https://betnacional.bet.br/',
        raw: {},
      },
    ];

    const { bookmakers, fallbacks } = resolver.resolve(userBookmakers, clones);

    expect(fallbacks).toBe(0);
    expect(bookmakers[0]).toMatchObject({
      externalBookmakerId: 461,
      cloneId: 1521,
      name: 'BetNacional',
      url: 'https://betnacional.bet.br/',
      domain: 'betnacional.bet.br',
      active: true,
    });
  });

  it('falls back when clone_id is null', () => {
    const userBookmakers: UserBookmakerInput[] = [
      {
        bookmakerId: 999,
        cloneId: null,
        active: true,
        domain: 'foo.com',
        raw: {},
      },
    ];

    const { bookmakers, fallbacks } = resolver.resolve(userBookmakers, []);

    expect(fallbacks).toBe(1);
    expect(bookmakers[0]).toMatchObject({
      externalBookmakerId: 999,
      cloneId: null,
      name: 'Bookmaker #999',
      url: null,
      domain: 'foo.com',
    });
  });

  it('falls back when clone_id is not in directories', () => {
    const userBookmakers: UserBookmakerInput[] = [
      {
        bookmakerId: 500,
        cloneId: 12345,
        active: false,
        domain: null,
        raw: {},
      },
    ];
    const clones: BookmakerCloneInput[] = [
      { id: 1, name: 'Other', url: null, raw: {} },
    ];

    const { bookmakers, fallbacks } = resolver.resolve(userBookmakers, clones);

    expect(fallbacks).toBe(1);
    expect(bookmakers[0].name).toBe('Bookmaker #500');
    expect(bookmakers[0].active).toBe(false);
  });

  it('strips www from the derived domain and tolerates a null clone url', () => {
    const userBookmakers: UserBookmakerInput[] = [
      { bookmakerId: 1, cloneId: 10, active: true, domain: null, raw: {} },
      {
        bookmakerId: 2,
        cloneId: 11,
        active: true,
        domain: 'fallback.com',
        raw: {},
      },
    ];
    const clones: BookmakerCloneInput[] = [
      { id: 10, name: 'A', url: 'https://www.example.com/path', raw: {} },
      { id: 11, name: 'B', url: null, raw: {} },
    ];

    const { bookmakers } = resolver.resolve(userBookmakers, clones);

    expect(bookmakers[0].domain).toBe('example.com');
    expect(bookmakers[1].url).toBeNull();
    expect(bookmakers[1].domain).toBe('fallback.com');
  });

  it('does not throw on empty input', () => {
    expect(() => resolver.resolve([], [])).not.toThrow();
    expect(resolver.resolve([], []).bookmakers).toEqual([]);
  });
});
