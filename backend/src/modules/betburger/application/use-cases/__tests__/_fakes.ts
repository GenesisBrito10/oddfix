import {
  BookmakersRepository,
  ResolvedBookmaker,
} from '../../../domain/repositories/bookmakers.repository';
import {
  CatalogMarketType,
  MarketTypesRepository,
} from '../../../domain/repositories/market-types.repository';
import {
  ResolvedSport,
  SportsRepository,
} from '../../../domain/repositories/sports.repository';
import { BetburgerDirectoriesResponse } from '../../../infrastructure/http/dto/betburger-directories.response';
import { BetburgerUserBookmakersResponse } from '../../../infrastructure/http/dto/betburger-user-bookmakers.response';

export class FakeBetburgerClient {
  constructor(
    private readonly userBookmakers: BetburgerUserBookmakersResponse,
    private readonly directories: BetburgerDirectoriesResponse,
  ) {}

  getUserBookmakers(): Promise<BetburgerUserBookmakersResponse> {
    return Promise.resolve(this.userBookmakers);
  }

  getDirectories(): Promise<BetburgerDirectoriesResponse> {
    return Promise.resolve(this.directories);
  }
}

export class InMemoryBookmakersRepository extends BookmakersRepository {
  public readonly saved: ResolvedBookmaker[] = [];

  upsertMany(bookmakers: ResolvedBookmaker[]): Promise<number> {
    this.saved.push(...bookmakers);
    return Promise.resolve(bookmakers.length);
  }

  findByExternalBookmakerId(): Promise<ResolvedBookmaker | null> {
    return Promise.resolve(null);
  }

  findActive(): Promise<{ externalBookmakerId: number; name: string }[]> {
    return Promise.resolve(
      this.saved.map((b) => ({
        externalBookmakerId: b.externalBookmakerId,
        name: b.name,
      })),
    );
  }
}

export class InMemorySportsRepository extends SportsRepository {
  public readonly saved: ResolvedSport[] = [];

  upsertMany(sports: ResolvedSport[]): Promise<number> {
    this.saved.push(...sports);
    return Promise.resolve(sports.length);
  }
}

export class InMemoryMarketTypesRepository extends MarketTypesRepository {
  public readonly saved: CatalogMarketType[] = [];

  upsertMany(marketTypes: CatalogMarketType[]): Promise<number> {
    this.saved.push(...marketTypes);
    return Promise.resolve(marketTypes.length);
  }
}
