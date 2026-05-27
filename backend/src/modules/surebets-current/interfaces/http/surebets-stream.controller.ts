import {
  Controller,
  Header,
  type MessageEvent,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Observable, defer, filter, from, map, merge } from 'rxjs';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RedisPubSubService } from '../../../../common/redis/redis-pubsub.service';
import { NormalizedSurebetSnapshot } from '../../application/contracts/normalized-surebet-snapshot';
import {
  SurebetsStreamPayload,
  surebetsUpdatedChannel,
  toStreamPayload,
} from '../../application/contracts/surebets-stream-event';
import { CurrentSurebetsCacheRepository } from '../../infrastructure/cache/current-surebets-cache.repository';
import { SurebetTypeParam } from './dto/get-current-surebets-query.dto';
import { StreamSurebetsQueryDto } from './dto/stream-surebets-query.dto';

/**
 * Authenticated Server-Sent Events stream of the current snapshot. On connect
 * it emits the current snapshot, then pushes every new snapshot the moment a
 * refresh publishes it to Redis. JWT-guarded (Bearer header) so anonymous /
 * external clients cannot connect or scrape. The frontend connects with
 * fetch-event-source (EventSource cannot send the Authorization header).
 */
@Controller('surebets')
@UseGuards(JwtAuthGuard)
export class SurebetsStreamController {
  constructor(
    private readonly currentCache: CurrentSurebetsCacheRepository,
    private readonly pubsub: RedisPubSubService,
  ) {}

  @Sse('stream')
  @Header('X-Accel-Buffering', 'no')
  stream(@Query() dto: StreamSurebetsQueryDto): Observable<MessageEvent> {
    const type = dto.type === SurebetTypeParam.LIVE ? 'LIVE' : 'PREMATCH';

    const initial$ = defer(() =>
      from(this.currentCache.getCurrentSnapshot(type)),
    ).pipe(
      filter((s): s is NormalizedSurebetSnapshot => s !== null),
      map(toStreamPayload),
    );

    const updates$ = this.pubsub
      .messageStream(surebetsUpdatedChannel(type))
      .pipe(map((raw) => JSON.parse(raw) as SurebetsStreamPayload));

    return merge(initial$, updates$).pipe(
      map((data): MessageEvent => ({ data })),
    );
  }
}
