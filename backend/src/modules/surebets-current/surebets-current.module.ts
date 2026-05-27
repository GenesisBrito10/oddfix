import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BetburgerModule } from '../betburger/betburger.module';
import { GetCurrentSurebetsUseCase } from './application/use-cases/get-current-surebets.use-case';
import { NormalizeBetburgerSurebetsUseCase } from './application/use-cases/normalize-betburger-surebets.use-case';
import { RefreshBetburgerSurebetsUseCase } from './application/use-cases/refresh-betburger-surebets.use-case';
import { BookmakerCatalogRepository } from './domain/repositories/bookmaker-catalog.repository';
import { MarketTypeCatalogRepository } from './domain/repositories/market-type-catalog.repository';
import { SportCatalogRepository } from './domain/repositories/sport-catalog.repository';
import { CurrentSurebetsFilterService } from './domain/services/current-surebets-filter.service';
import { CurrentSurebetsPaginationService } from './domain/services/current-surebets-pagination.service';
import { CurrentSurebetsSortService } from './domain/services/current-surebets-sort.service';
import { MarketNameResolver } from './domain/services/market-name-resolver.service';
import { SurebetNormalizer } from './domain/services/surebet-normalizer.service';
import { CurrentSurebetsCacheRepository } from './infrastructure/cache/current-surebets-cache.repository';
import { SnapshotSurebetsCacheRepository } from './infrastructure/cache/snapshot-surebets-cache.repository';
import { SurebetOpeningProfitCache } from './infrastructure/cache/surebet-opening-profit-cache.repository';
import { PrismaBookmakerCatalogRepository } from './infrastructure/repositories/prisma-bookmaker-catalog.repository';
import { PrismaMarketTypeCatalogRepository } from './infrastructure/repositories/prisma-market-type-catalog.repository';
import { PrismaSportCatalogRepository } from './infrastructure/repositories/prisma-sport-catalog.repository';
import { AdminBetburgerRefreshController } from './interfaces/http/admin-betburger-refresh.controller';
import { CurrentSurebetsController } from './interfaces/http/current-surebets.controller';
import { SurebetsStreamController } from './interfaces/http/surebets-stream.controller';

@Module({
  imports: [BetburgerModule],
  controllers: [
    AdminBetburgerRefreshController,
    CurrentSurebetsController,
    SurebetsStreamController,
  ],
  providers: [
    NormalizeBetburgerSurebetsUseCase,
    RefreshBetburgerSurebetsUseCase,
    GetCurrentSurebetsUseCase,
    SurebetNormalizer,
    MarketNameResolver,
    CurrentSurebetsFilterService,
    CurrentSurebetsSortService,
    CurrentSurebetsPaginationService,
    CurrentSurebetsCacheRepository,
    SnapshotSurebetsCacheRepository,
    SurebetOpeningProfitCache,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: BookmakerCatalogRepository,
      useClass: PrismaBookmakerCatalogRepository,
    },
    { provide: SportCatalogRepository, useClass: PrismaSportCatalogRepository },
    {
      provide: MarketTypeCatalogRepository,
      useClass: PrismaMarketTypeCatalogRepository,
    },
  ],
  exports: [
    NormalizeBetburgerSurebetsUseCase,
    RefreshBetburgerSurebetsUseCase,
    CurrentSurebetsCacheRepository,
    SnapshotSurebetsCacheRepository,
    SurebetOpeningProfitCache,
  ],
})
export class SurebetsCurrentModule {}
