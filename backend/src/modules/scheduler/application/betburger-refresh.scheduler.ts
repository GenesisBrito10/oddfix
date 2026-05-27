import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import betburgerConfig from '../../../common/config/betburger.config';
import { SurebetType } from '../../surebets-current/application/contracts/normalized-surebet-snapshot';
import { RefreshBetburgerSurebetsUseCase } from '../../surebets-current/application/use-cases/refresh-betburger-surebets.use-case';

/**
 * Schedules periodic refreshes. Disabled by default
 * (BETBURGER_SCHEDULER_ENABLED). Holds no business logic — lock and rate limit
 * live in the use-case. Handler failures are logged, never thrown.
 */
@Injectable()
export class BetburgerRefreshScheduler implements OnModuleInit {
  private readonly logger = new Logger(BetburgerRefreshScheduler.name);

  constructor(
    private readonly refreshUseCase: RefreshBetburgerSurebetsUseCase,
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject(betburgerConfig.KEY)
    private readonly config: ConfigType<typeof betburgerConfig>,
  ) {}

  onModuleInit(): void {
    if (!this.config.schedulerEnabled) {
      this.logger.log(
        'BetBurger scheduler disabled (BETBURGER_SCHEDULER_ENABLED=false)',
      );
      return;
    }

    this.register(
      'betburger-refresh-live',
      'LIVE',
      this.config.liveSyncIntervalMs,
    );
    this.register(
      'betburger-refresh-prematch',
      'PREMATCH',
      this.config.prematchSyncIntervalMs,
    );
    this.logger.log('BetBurger scheduler enabled');
  }

  private register(name: string, type: SurebetType, intervalMs: number): void {
    const handle = setInterval(() => {
      void this.runRefresh(type);
    }, intervalMs);
    this.schedulerRegistry.addInterval(name, handle);
  }

  /** Public for testability. Swallows errors so a failure never crashes. */
  async runRefresh(type: SurebetType): Promise<void> {
    try {
      await this.refreshUseCase.execute({ type });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown scheduler error';
      this.logger.warn(`Scheduled refresh ${type} failed: ${message}`);
    }
  }
}
