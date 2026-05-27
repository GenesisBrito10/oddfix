/** BetBurger sends started_at / updated_at in Unix SECONDS. */
export function fromUnixSeconds(value: number | null | undefined): Date | null {
  if (value == null || !Number.isFinite(value)) {
    return null;
  }
  return new Date(value * 1000);
}

/** BetBurger sends scanned_at / koef_last_modified_at in Unix MILLISECONDS. */
export function fromUnixMilliseconds(
  value: number | null | undefined,
): Date | null {
  if (value == null || !Number.isFinite(value)) {
    return null;
  }
  return new Date(value);
}
