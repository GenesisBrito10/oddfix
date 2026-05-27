import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BetburgerStatusCache } from '../../modules/betburger/infrastructure/redis/betburger-status-cache.service';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';

export type ServiceStatus = 'ok' | 'down';

export interface HealthReport {
  status: 'ok' | 'degraded';
  timestamp: string;
  services: {
    api: ServiceStatus;
    postgres: ServiceStatus;
    redis: ServiceStatus;
  };
  betburger: {
    schedulerEnabled: boolean;
    live: string;
    prematch: string;
  };
}

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly betburgerStatus: BetburgerStatusCache,
    private readonly config: ConfigService,
  ) {}

  async check(): Promise<HealthReport> {
    const [postgresOk, redisOk] = await Promise.all([
      this.prisma.isHealthy(),
      this.redis.isHealthy(),
    ]);

    const [live, prematch] = await Promise.all([
      this.lastStatus('LIVE'),
      this.lastStatus('PREMATCH'),
    ]);

    return {
      status: postgresOk && redisOk ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        api: 'ok',
        postgres: postgresOk ? 'ok' : 'down',
        redis: redisOk ? 'ok' : 'down',
      },
      betburger: {
        schedulerEnabled:
          this.config.get<boolean>('betburger.schedulerEnabled') ?? false,
        live,
        prematch,
      },
    };
  }

  /** Last persisted integration status (never a secret). UNKNOWN if absent. */
  private async lastStatus(type: 'LIVE' | 'PREMATCH'): Promise<string> {
    try {
      const status = await this.betburgerStatus.getStatus(type);
      return status?.status ?? 'UNKNOWN';
    } catch {
      return 'UNKNOWN';
    }
  }
}
