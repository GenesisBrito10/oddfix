import { BetburgerRateLimiter } from '../../../../betburger/infrastructure/redis/betburger-rate-limiter.service';
import { BetburgerStatusCache } from '../../../../betburger/infrastructure/redis/betburger-status-cache.service';
import { RefreshBetburgerSurebetsUseCase } from '../../../application/use-cases/refresh-betburger-surebets.use-case';
import { AdminBetburgerRefreshController } from '../admin-betburger-refresh.controller';

describe('AdminBetburgerRefreshController', () => {
  function build() {
    const refreshUseCase = {
      execute: jest.fn().mockResolvedValue({ type: 'LIVE', status: 'SUCCESS' }),
    };
    const statusCache = {
      getStatus: jest.fn().mockResolvedValue(null),
    };
    const rateLimiter = {
      getStatus: jest.fn().mockResolvedValue({
        current: 3,
        limit: 1800,
        resetAt: new Date('2026-05-24T04:00:00.000Z'),
      }),
    };
    const controller = new AdminBetburgerRefreshController(
      refreshUseCase as unknown as RefreshBetburgerSurebetsUseCase,
      statusCache as unknown as BetburgerStatusCache,
      rateLimiter as unknown as BetburgerRateLimiter,
    );
    return { controller, refreshUseCase };
  }

  it('refresh/live calls the use-case with LIVE', async () => {
    const { controller, refreshUseCase } = build();
    await controller.refreshLive();
    expect(refreshUseCase.execute).toHaveBeenCalledWith({ type: 'LIVE' });
  });

  it('refresh/prematch calls the use-case with PREMATCH', async () => {
    const { controller, refreshUseCase } = build();
    await controller.refreshPrematch();
    expect(refreshUseCase.execute).toHaveBeenCalledWith({ type: 'PREMATCH' });
  });

  it('status returns live + prematch with rate limit and IDLE fallback', async () => {
    const { controller } = build();
    const result = await controller.status();
    expect(result.live.type).toBe('LIVE');
    expect(result.live.status).toBe('IDLE');
    expect(result.live.rateLimit.limit).toBe(1800);
    expect(result.prematch.type).toBe('PREMATCH');
    expect(result.prematch.rateLimit.resetAt).toBe('2026-05-24T04:00:00.000Z');
  });
});
