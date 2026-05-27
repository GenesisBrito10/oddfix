import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import {
  BetburgerIntegrationStatus,
  BetburgerType,
} from '../../../betburger/application/contracts/betburger-integration';
import { BetburgerRateLimiter } from '../../../betburger/infrastructure/redis/betburger-rate-limiter.service';
import { BetburgerStatusCache } from '../../../betburger/infrastructure/redis/betburger-status-cache.service';
import { RefreshSurebetsResult } from '../../application/contracts/refresh-surebets-result';
import { RefreshBetburgerSurebetsUseCase } from '../../application/use-cases/refresh-betburger-surebets.use-case';

interface IntegrationStatusView extends BetburgerIntegrationStatus {
  rateLimit: { current: number; limit: number; resetAt: string };
}

@Controller('admin/betburger')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminBetburgerRefreshController {
  constructor(
    private readonly refreshUseCase: RefreshBetburgerSurebetsUseCase,
    private readonly statusCache: BetburgerStatusCache,
    private readonly rateLimiter: BetburgerRateLimiter,
  ) {}

  @Post('refresh/live')
  @HttpCode(HttpStatus.OK)
  refreshLive(): Promise<RefreshSurebetsResult> {
    return this.refreshUseCase.execute({ type: 'LIVE' });
  }

  @Post('refresh/prematch')
  @HttpCode(HttpStatus.OK)
  refreshPrematch(): Promise<RefreshSurebetsResult> {
    return this.refreshUseCase.execute({ type: 'PREMATCH' });
  }

  @Get('status')
  async status(): Promise<{
    live: IntegrationStatusView;
    prematch: IntegrationStatusView;
  }> {
    const [live, prematch] = await Promise.all([
      this.buildStatus('LIVE'),
      this.buildStatus('PREMATCH'),
    ]);
    return { live, prematch };
  }

  private async buildStatus(
    type: BetburgerType,
  ): Promise<IntegrationStatusView> {
    const status =
      (await this.statusCache.getStatus(type)) ?? this.idleStatus(type);
    const rate = await this.rateLimiter.getStatus(type);
    return {
      ...status,
      rateLimit: {
        current: rate.current,
        limit: rate.limit,
        resetAt: rate.resetAt.toISOString(),
      },
    };
  }

  private idleStatus(type: BetburgerType): BetburgerIntegrationStatus {
    return {
      type,
      status: 'IDLE',
      lastSuccessAt: null,
      lastErrorAt: null,
      nextAttemptAt: null,
      lastSnapshotId: null,
      message: null,
    };
  }
}
