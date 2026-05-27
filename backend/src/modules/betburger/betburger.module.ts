import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { MenuBookmakersStartupService } from './application/menu-bookmakers-startup.service';
import { ListBookmakersUseCase } from './application/use-cases/list-bookmakers.use-case';
import { RefreshMenuBookmakersUseCase } from './application/use-cases/refresh-menu-bookmakers.use-case';
import { SyncBetburgerCatalogUseCase } from './application/use-cases/sync-betburger-catalog.use-case';
import { BookmakersRepository } from './domain/repositories/bookmakers.repository';
import { MarketTypesRepository } from './domain/repositories/market-types.repository';
import { SportsRepository } from './domain/repositories/sports.repository';
import { BookmakerResolver } from './domain/services/bookmaker-resolver.service';
import { BetburgerHttpClient } from './infrastructure/http/betburger-http-client';
import { BetburgerDistributedLock } from './infrastructure/redis/betburger-distributed-lock.service';
import { BetburgerRateLimiter } from './infrastructure/redis/betburger-rate-limiter.service';
import { BetburgerStatusCache } from './infrastructure/redis/betburger-status-cache.service';
import { PrismaBookmakersRepository } from './infrastructure/repositories/prisma-bookmakers.repository';
import { PrismaMarketTypesRepository } from './infrastructure/repositories/prisma-market-types.repository';
import { PrismaSportsRepository } from './infrastructure/repositories/prisma-sports.repository';
import { AdminBetburgerController } from './interfaces/http/admin-betburger.controller';
import { CatalogController } from './interfaces/http/catalog.controller';

@Module({
  controllers: [AdminBetburgerController, CatalogController],
  providers: [
    BetburgerHttpClient,
    BookmakerResolver,
    SyncBetburgerCatalogUseCase,
    ListBookmakersUseCase,
    RefreshMenuBookmakersUseCase,
    MenuBookmakersStartupService,
    BetburgerRateLimiter,
    BetburgerDistributedLock,
    BetburgerStatusCache,
    JwtAuthGuard,
    RolesGuard,
    { provide: BookmakersRepository, useClass: PrismaBookmakersRepository },
    { provide: SportsRepository, useClass: PrismaSportsRepository },
    { provide: MarketTypesRepository, useClass: PrismaMarketTypesRepository },
  ],
  exports: [
    BetburgerHttpClient,
    BetburgerRateLimiter,
    BetburgerDistributedLock,
    BetburgerStatusCache,
  ],
})
export class BetburgerModule {}
