import { Subject } from 'rxjs';
import { NormalizedSurebetSnapshot } from '../../../application/contracts/normalized-surebet-snapshot';
import { toStreamPayload } from '../../../application/contracts/surebets-stream-event';
import { CurrentSurebetsCacheRepository } from '../../../infrastructure/cache/current-surebets-cache.repository';
import { RedisPubSubService } from '../../../../../common/redis/redis-pubsub.service';
import { SurebetsStreamController } from '../surebets-stream.controller';
import { SurebetTypeParam } from '../dto/get-current-surebets-query.dto';
import { StreamSurebetsQueryDto } from '../dto/stream-surebets-query.dto';

function snapshot(snapshotId: string): NormalizedSurebetSnapshot {
  return {
    type: 'LIVE',
    snapshotId,
    fetchedAt: '2026-05-24T03:31:50.840Z',
    expiresAt: '2026-05-24T03:32:00.840Z',
    isStale: false,
    total: 0,
    surebets: [],
    meta: {
      rawBets: 0,
      rawArbs: 0,
      normalized: 0,
      skipped: 0,
      missingBookmakers: 0,
      missingMarkets: 0,
      missingSports: 0,
    },
  };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

function build(initial: NormalizedSurebetSnapshot | null) {
  const channel = new Subject<string>();
  const cache = {
    getCurrentSnapshot: jest.fn().mockResolvedValue(initial),
  };
  const pubsub = {
    messageStream: jest.fn().mockReturnValue(channel.asObservable()),
  };
  const controller = new SurebetsStreamController(
    cache as unknown as CurrentSurebetsCacheRepository,
    pubsub as unknown as RedisPubSubService,
  );
  return { controller, channel, cache, pubsub };
}

function dtoLive(): StreamSurebetsQueryDto {
  const dto = new StreamSurebetsQueryDto();
  dto.type = SurebetTypeParam.LIVE;
  return dto;
}

describe('SurebetsStreamController', () => {
  it('emits the current snapshot on connect, then pushes updates', async () => {
    const { controller, channel, pubsub } = build(snapshot('live-1'));
    const events: Array<{ data: { snapshotId: string } }> = [];
    const sub = controller.stream(dtoLive()).subscribe((e) => {
      events.push(e as { data: { snapshotId: string } });
    });

    await flush();
    expect(pubsub.messageStream).toHaveBeenCalledWith('surebets:updated:live');
    expect(events[0].data.snapshotId).toBe('live-1');

    channel.next(JSON.stringify(toStreamPayload(snapshot('live-2'))));
    await flush();
    expect(events).toHaveLength(2);
    expect(events[1].data.snapshotId).toBe('live-2');
    sub.unsubscribe();
  });

  it('skips initial emit when no snapshot but still streams updates', async () => {
    const { controller, channel } = build(null);
    const events: Array<{ data: { snapshotId: string } }> = [];
    const sub = controller.stream(dtoLive()).subscribe((e) => {
      events.push(e as { data: { snapshotId: string } });
    });

    await flush();
    expect(events).toHaveLength(0);

    channel.next(JSON.stringify(toStreamPayload(snapshot('live-3'))));
    await flush();
    expect(events).toHaveLength(1);
    expect(events[0].data.snapshotId).toBe('live-3');
    sub.unsubscribe();
  });
});
