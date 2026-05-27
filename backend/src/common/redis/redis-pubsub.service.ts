import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import type Redis from 'ioredis';
import { Observable, Subject } from 'rxjs';
import { RedisService } from './redis.service';

/**
 * Redis pub/sub for fan-out push (SSE). Owns a single dedicated subscriber
 * connection (SUBSCRIBE puts a connection in subscriber mode, so it must be
 * separate from the command client). Each channel gets one Redis subscription
 * and an RxJS Subject; multiple SSE clients share it.
 */
@Injectable()
export class RedisPubSubService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisPubSubService.name);
  private readonly subscriber: Redis;
  private readonly channels = new Map<string, Subject<string>>();

  constructor(redisService: RedisService) {
    this.subscriber = redisService.getClient().duplicate();
    this.subscriber.on('message', (channel: string, message: string) => {
      this.channels.get(channel)?.next(message);
    });
    this.subscriber.on('error', (error: Error) =>
      this.logger.warn(`Redis subscriber error: ${error.message}`),
    );
  }

  /** Hot stream of raw messages for a channel. Subscribes on first use. */
  messageStream(channel: string): Observable<string> {
    let subject = this.channels.get(channel);
    if (!subject) {
      subject = new Subject<string>();
      this.channels.set(channel, subject);
      this.subscriber.subscribe(channel).catch((error: Error) => {
        this.logger.warn(`Failed to subscribe to ${channel}: ${error.message}`);
      });
    }
    return subject.asObservable();
  }

  async onModuleDestroy(): Promise<void> {
    this.channels.forEach((subject) => subject.complete());
    this.channels.clear();
    await this.subscriber.quit();
  }
}
