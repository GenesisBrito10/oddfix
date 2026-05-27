import { MarketNameResolver } from '../market-name-resolver.service';

describe('MarketNameResolver', () => {
  const resolver = new MarketNameResolver();
  const templates = new Map<number, string>([
    [1, 'Team1 Win'],
    [17, 'Asian Handicap1(%s)'],
  ]);

  it('substitutes %s with the raw param', () => {
    const { market, missing } = resolver.resolve(17, '-3.5', templates);
    expect(missing).toBe(false);
    expect(market.name).toBe('Asian Handicap1(-3.5)');
    expect(market.marketTypeId).toBe(17);
    expect(market.param).toBe(-3.5);
  });

  it('returns the template unchanged when it has no %s', () => {
    const { market } = resolver.resolve(1, null, templates);
    expect(market.name).toBe('Team1 Win');
  });

  it('falls back to Market #id and flags missing when unknown', () => {
    const { market, missing } = resolver.resolve(999, '2.5', templates);
    expect(missing).toBe(true);
    expect(market.name).toBe('Market #999');
    expect(market.param).toBe(2.5);
  });

  it('flags missing when marketTypeId is null', () => {
    const { market, missing } = resolver.resolve(null, null, templates);
    expect(missing).toBe(true);
    expect(market.marketTypeId).toBeNull();
  });
});
