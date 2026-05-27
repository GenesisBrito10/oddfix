import { RedisPubSubService } from '../redis-pubsub.service';
import { RedisService } from '../redis.service';

class FakeSubscriber {
  handlers: Record<string, (...args: string[]) => void> = {};
  subscribed: string[] = [];
  on(event: string, cb: (...args: string[]) => void): this {
    this.handlers[event] = cb;
    return this;
  }
  subscribe(channel: string): Promise<void> {
    this.subscribed.push(channel);
    return Promise.resolve();
  }
  quit(): Promise<void> {
    return Promise.resolve();
  }
  emitMessage(channel: string, message: string): void {
    this.handlers.message?.(channel, message);
  }
}

function build() {
  const sub = new FakeSubscriber();
  const redis = {
    getClient: () => ({ duplicate: () => sub }),
  } as unknown as RedisService;
  return { service: new RedisPubSubService(redis), sub };
}

describe('RedisPubSubService', () => {
  it('emits messages received on a subscribed channel', () => {
    const { service, sub } = build();
    const received: string[] = [];
    service
      .messageStream('surebets:updated:live')
      .subscribe((m) => received.push(m));

    expect(sub.subscribed).toContain('surebets:updated:live');
    sub.emitMessage('surebets:updated:live', 'hello');
    sub.emitMessage('surebets:updated:live', 'world');
    expect(received).toEqual(['hello', 'world']);
  });

  it('only routes messages to the matching channel', () => {
    const { service, sub } = build();
    const live: string[] = [];
    const prematch: string[] = [];
    service
      .messageStream('surebets:updated:live')
      .subscribe((m) => live.push(m));
    service
      .messageStream('surebets:updated:prematch')
      .subscribe((m) => prematch.push(m));

    sub.emitMessage('surebets:updated:live', 'L');
    expect(live).toEqual(['L']);
    expect(prematch).toEqual([]);
  });

  it('reuses one Redis subscription per channel', () => {
    const { service, sub } = build();
    service.messageStream('ch').subscribe();
    service.messageStream('ch').subscribe();
    expect(sub.subscribed.filter((c) => c === 'ch')).toHaveLength(1);
  });
});
