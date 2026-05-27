import type { ConfigType } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import betburgerConfig from '../../../../common/config/betburger.config';
import { RefreshBetburgerSurebetsUseCase } from '../../../surebets-current/application/use-cases/refresh-betburger-surebets.use-case';
import { BetburgerRefreshScheduler } from '../betburger-refresh.scheduler';

function build(enabled: boolean, execute: jest.Mock) {
  const config = {
    schedulerEnabled: enabled,
    liveSyncIntervalMs: 3000,
    prematchSyncIntervalMs: 6000,
  } as unknown as ConfigType<typeof betburgerConfig>;
  const registry = { addInterval: jest.fn() };
  const scheduler = new BetburgerRefreshScheduler(
    { execute } as unknown as RefreshBetburgerSurebetsUseCase,
    registry as unknown as SchedulerRegistry,
    config,
  );
  return { scheduler, registry };
}

describe('BetburgerRefreshScheduler', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not register intervals when disabled', () => {
    const { scheduler, registry } = build(false, jest.fn());
    scheduler.onModuleInit();
    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('registers live + prematch intervals when enabled', () => {
    jest.useFakeTimers();
    const { scheduler, registry } = build(true, jest.fn());
    scheduler.onModuleInit();
    expect(registry.addInterval).toHaveBeenCalledTimes(2);
    jest.clearAllTimers();
  });

  it('runRefresh calls the use-case', async () => {
    const execute = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
    const { scheduler } = build(true, execute);
    await scheduler.runRefresh('LIVE');
    expect(execute).toHaveBeenCalledWith({ type: 'LIVE' });
  });

  it('runRefresh swallows use-case errors', async () => {
    const execute = jest.fn().mockRejectedValue(new Error('boom'));
    const { scheduler } = build(true, execute);
    await expect(scheduler.runRefresh('PREMATCH')).resolves.toBeUndefined();
  });
});
