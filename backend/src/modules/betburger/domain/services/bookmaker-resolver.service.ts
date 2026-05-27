import { ResolvedBookmaker } from '../repositories/bookmakers.repository';

/** Minimal shape the resolver needs from user_bookmakers[]. */
export interface UserBookmakerInput {
  bookmakerId: number;
  cloneId: number | null;
  active: boolean;
  domain: string | null;
  raw: unknown;
}

/** Minimal shape the resolver needs from directories.bookmaker_clones[]. */
export interface BookmakerCloneInput {
  id: number;
  name: string;
  url: string | null;
  raw: unknown;
}

export interface BookmakerResolutionResult {
  bookmakers: ResolvedBookmaker[];
  fallbacks: number;
}

/**
 * Pure domain service. Resolves each user bookmaker to a clone:
 * bookmaker_id -> clone_id -> bookmaker_clone. Falls back to a safe name when
 * the clone is missing, never throwing — a missing clone must not break sync.
 */
export class BookmakerResolver {
  resolve(
    userBookmakers: UserBookmakerInput[],
    clones: BookmakerCloneInput[],
  ): BookmakerResolutionResult {
    const cloneById = new Map<number, BookmakerCloneInput>();
    for (const clone of clones) {
      cloneById.set(clone.id, clone);
    }

    let fallbacks = 0;
    const bookmakers = userBookmakers.map((ub): ResolvedBookmaker => {
      const clone = ub.cloneId !== null ? cloneById.get(ub.cloneId) : undefined;

      if (clone) {
        return {
          externalBookmakerId: ub.bookmakerId,
          cloneId: ub.cloneId,
          name: clone.name,
          url: clone.url,
          domain: this.deriveDomain(clone.url) ?? ub.domain,
          active: ub.active,
          rawJson: { userBookmaker: ub.raw, clone: clone.raw },
        };
      }

      fallbacks += 1;
      return {
        externalBookmakerId: ub.bookmakerId,
        cloneId: ub.cloneId,
        name: `Bookmaker #${ub.bookmakerId}`,
        url: null,
        domain: ub.domain,
        active: ub.active,
        rawJson: { userBookmaker: ub.raw, fallback: true },
      };
    });

    return { bookmakers, fallbacks };
  }

  private deriveDomain(url: string | null): string | null {
    if (!url) {
      return null;
    }
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return null;
    }
  }
}
