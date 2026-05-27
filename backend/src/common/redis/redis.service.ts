import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import Redis from 'ioredis';
import redisConfig from '../config/redis.config';

/**
 * Encapsulates the single ioredis client. Other modules must depend on this
 * service rather than importing ioredis directly. Future use: surebet
 * snapshots, distributed locks, hourly rate limiting and BetBurger status.
 * Connection errors are logged, not thrown, so the app keeps running.
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(@Inject(redisConfig.KEY) config: ConfigType<typeof redisConfig>) {
    this.client = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      retryStrategy: (times) => Math.min(times * 200, 2000),
    });

    this.client.on('connect', () => this.logger.log('Connected to Redis'));
    this.client.on('error', (error) =>
      this.logger.warn(`Redis error: ${error.message}`),
    );
  }

  /** Raw client for advanced operations (locks, pipelines) in later phases. */
  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  /** Atomic increment. Returns the new value. */
  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  /** SET key value PX ttlMs NX. Returns true if the key was set (did not exist). */
  async setNx(key: string, value: string, ttlMs: number): Promise<boolean> {
    const result = await this.client.set(key, value, 'PX', ttlMs, 'NX');
    return result === 'OK';
  }

  /** Compare-and-delete via Lua: deletes the key only if it still holds `token`. */
  async releaseIfMatch(key: string, token: string): Promise<boolean> {
    const lua =
      'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end';
    const result = await this.client.eval(lua, 1, key, token);
    return Number(result) === 1;
  }

  /** Publishes to a pub/sub channel. Uses the main client (publish never blocks
   * it — only SUBSCRIBE puts a connection into subscriber mode). */
  async publish(channel: string, message: string): Promise<number> {
    return this.client.publish(channel, message);
  }

  /** Liveness probe for the health endpoint. */
  async isHealthy(): Promise<boolean> {
    try {
      const pong = await this.client.ping();
      return pong === 'PONG';
    } catch {
      return false;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
