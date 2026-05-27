import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import betburgerConfig from '../../../common/config/betburger.config';
import { RefreshMenuBookmakersUseCase } from './use-cases/refresh-menu-bookmakers.use-case';
import { SyncBetburgerCatalogUseCase } from './use-cases/sync-betburger-catalog.use-case';

/**
 * On every boot, refreshes the BetBurger catalog in Postgres and then the menu
 * bookmakers in Redis. Best-effort and non-blocking: failures are logged but do
 * not delay or crash startup. Skipped without a token (dev).
 */
@Injectable()
export class MenuBookmakersStartupService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MenuBookmakersStartupService.name);

  constructor(
    private readonly syncCatalog: SyncBetburgerCatalogUseCase,
    private readonly refresh: RefreshMenuBookmakersUseCase,
    @Inject(betburgerConfig.KEY)
    private readonly config: ConfigType<typeof betburgerConfig>,
  ) {}

  onApplicationBootstrap(): void {
    if (!this.config.accessToken) {
      this.logger.log('BetBurger startup sync skipped (no BetBurger token)');
      return;
    }
    // Fire-and-forget so the app becomes ready immediately.
    void this.run();
  }

  private async run(): Promise<void> {
    await this.runCatalogSync();
    await this.runMenuRefresh();
  }

  private async runCatalogSync(): Promise<void> {
    try {
      const result = await this.syncCatalog.execute();
      this.logger.log(
        `BetBurger catalog synced on start: bookmakers=${result.bookmakers.upserted}/${result.bookmakers.received}, sports=${result.sports.upserted}/${result.sports.received}, marketTypes=${result.marketTypes.upserted}/${result.marketTypes.received}`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(
        `BetBurger catalog sync on start failed: ${this.sanitize(message)}`,
      );
    }
  }

  private async runMenuRefresh(): Promise<void> {
    try {
      const result = await this.refresh.execute();
      this.logger.log(`Menu bookmakers refreshed on start: ${result.count}`);
      this.logger.log(
        `Menu bookmakers refresh response: ${JSON.stringify(result)}`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(
        `Menu bookmakers refresh failed: ${this.sanitize(message)}`,
      );
    }
  }

  private sanitize(message: string): string {
    return message.replace(/access_token=[^&\s]+/gi, 'access_token=***');
  }
}
