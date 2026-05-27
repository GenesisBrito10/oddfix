import { fromUnixMilliseconds, fromUnixSeconds } from '../unix-time.util';

describe('unix-time util', () => {
  it('converts Unix seconds to a Date', () => {
    const date = fromUnixSeconds(1779591000);
    expect(date).not.toBeNull();
    expect(date?.getTime()).toBe(1779591000 * 1000);
    expect(date?.toISOString()).toBe('2026-05-24T02:50:00.000Z');
  });

  it('converts Unix milliseconds to a Date', () => {
    const date = fromUnixMilliseconds(1779593510840);
    expect(date?.getTime()).toBe(1779593510840);
  });

  it('returns null for nullish / invalid values', () => {
    expect(fromUnixSeconds(null)).toBeNull();
    expect(fromUnixSeconds(undefined)).toBeNull();
    expect(fromUnixMilliseconds(null)).toBeNull();
  });
});
