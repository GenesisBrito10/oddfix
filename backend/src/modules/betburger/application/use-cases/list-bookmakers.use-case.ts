import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../../common/redis/redis.service';
import {
  ActiveBookmaker,
  BookmakersRepository,
} from '../../domain/repositories/bookmakers.repository';
import { MENU_BOOKMAKERS_KEY } from './refresh-menu-bookmakers.use-case';

/**
 * Lists the "Casas de Apostas" menu bookmakers. Reads the Redis list refreshed
 * on every start (search-filter bookmakers, resolved to names). Falls back to
 * the Postgres catalog if Redis has nothing yet. Never calls BetBurger.
 */
@Injectable()
export class ListBookmakersUseCase {
  constructor(
    private readonly bookmakers: BookmakersRepository,
    private readonly redis: RedisService,
  ) {}

  async execute(): Promise<ActiveBookmaker[]> {
    const raw = await this.redis.get(MENU_BOOKMAKERS_KEY);
    if (raw) {
      try {
        const list = JSON.parse(raw) as ActiveBookmaker[];
        if (Array.isArray(list) && list.length > 0) {
          return list;
        }
      } catch {
        // corrupted cache — fall back to Postgres
      }
    }
    return this.bookmakers.findActive();
  }
}
