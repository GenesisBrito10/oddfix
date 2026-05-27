import { AuthTokenPayload } from '../../../../auth/domain/services/token-service.interface';
import { ListRegisteredSurebetsQuery } from '../../../application/contracts/list-registered-surebets-query';
import { RegisterSurebetInput } from '../../../application/contracts/register-surebet-request';
import { UpdateRegisteredSurebetLegResultRequest } from '../../../application/contracts/update-registered-surebet-leg-result-request';
import { UpdateRegisteredSurebetStatusRequest } from '../../../application/contracts/update-registered-surebet-status-request';
import { GetRegisteredSurebetUseCase } from '../../../application/use-cases/get-registered-surebet.use-case';
import { ListRegisteredSurebetsUseCase } from '../../../application/use-cases/list-registered-surebets.use-case';
import { RegisterSurebetUseCase } from '../../../application/use-cases/register-surebet.use-case';
import { UpdateRegisteredSurebetLegResultUseCase } from '../../../application/use-cases/update-registered-surebet-leg-result.use-case';
import { UpdateRegisteredSurebetStatusUseCase } from '../../../application/use-cases/update-registered-surebet-status.use-case';
import { RegisteredSurebetsController } from '../registered-surebets.controller';
import { ListRegisteredSurebetsQueryDto } from '../dto/list-registered-surebets-query.dto';
import { RegisterSurebetDto } from '../dto/register-surebet.dto';
import { UpdateRegisteredSurebetLegResultDto } from '../dto/update-registered-surebet-leg-result.dto';
import { UpdateRegisteredSurebetStatusDto } from '../dto/update-registered-surebet-status.dto';

function build() {
  const register = { execute: jest.fn().mockResolvedValue({ id: 'reg-1' }) };
  const list = {
    execute: jest.fn().mockResolvedValue({ items: [], pagination: {} }),
  };
  const get = { execute: jest.fn().mockResolvedValue({ id: 'reg-1' }) };
  const updateStatus = {
    execute: jest.fn().mockResolvedValue({ id: 'reg-1', status: 'GREEN' }),
  };
  const updateLeg = { execute: jest.fn().mockResolvedValue({ id: 'reg-1' }) };
  const controller = new RegisteredSurebetsController(
    register as unknown as RegisterSurebetUseCase,
    list as unknown as ListRegisteredSurebetsUseCase,
    get as unknown as GetRegisteredSurebetUseCase,
    updateStatus as unknown as UpdateRegisteredSurebetStatusUseCase,
    updateLeg as unknown as UpdateRegisteredSurebetLegResultUseCase,
  );
  return { controller, register, list, get, updateStatus, updateLeg };
}

const payload: AuthTokenPayload = {
  sub: 'user-jwt-id',
  email: 'user@example.com',
  role: 'USER',
};

function firstArg<T>(mock: jest.Mock): T {
  return (mock.mock.calls as unknown as [T][])[0][0];
}

describe('RegisteredSurebetsController', () => {
  it('register: passes userId from JWT and maps type live -> LIVE', async () => {
    const { controller, register } = build();
    const dto = new RegisterSurebetDto();
    dto.type = 'live';
    dto.snapshotId = 'live-1779593510840';
    dto.arbHash = '8e453b6c5929c6aee2b01ec96a7b95ee';

    await controller.register(payload, dto);

    const input = firstArg<RegisterSurebetInput>(register.execute);
    expect(input.userId).toBe('user-jwt-id');
    expect(input.type).toBe('LIVE');
  });

  it('list: applies userId + defaults (page 1, limit 20, sort registeredAt_desc)', async () => {
    const { controller, list } = build();
    const dto = new ListRegisteredSurebetsQueryDto();
    await controller.list(payload, dto);

    const query = firstArg<ListRegisteredSurebetsQuery>(list.execute);
    expect(query.userId).toBe('user-jwt-id');
    expect(query.page).toBe(1);
    expect(query.limit).toBe(20);
    expect(query.sort).toBe('registeredAt_desc');
  });

  it('list: caps limit at 100 and forwards filters', async () => {
    const { controller, list } = build();
    const dto = new ListRegisteredSurebetsQueryDto();
    dto.limit = 500;
    dto.status = 'GREEN';
    dto.type = 'LIVE';
    await controller.list(payload, dto);

    const query = firstArg<ListRegisteredSurebetsQuery>(list.execute);
    expect(query.limit).toBe(100);
    expect(query.status).toBe('GREEN');
    expect(query.type).toBe('LIVE');
  });

  it('getOne: forwards id + userId', async () => {
    const { controller, get } = build();
    await controller.getOne(payload, 'reg-99');
    expect(get.execute).toHaveBeenCalledWith('reg-99', 'user-jwt-id');
  });

  it('updateStatus: forwards id, userId, status', async () => {
    const { controller, updateStatus } = build();
    const dto = new UpdateRegisteredSurebetStatusDto();
    dto.status = 'GREEN';
    await controller.updateStatus(payload, 'reg-99', dto);

    const req = firstArg<UpdateRegisteredSurebetStatusRequest>(
      updateStatus.execute,
    );
    expect(req).toEqual({
      id: 'reg-99',
      userId: 'user-jwt-id',
      status: 'GREEN',
    });
  });

  it('updateLegResult: forwards id, legId, userId, result', async () => {
    const { controller, updateLeg } = build();
    const dto = new UpdateRegisteredSurebetLegResultDto();
    dto.result = 'RED';
    await controller.updateLegResult(payload, 'reg-99', 'leg-7', dto);

    const req = firstArg<UpdateRegisteredSurebetLegResultRequest>(
      updateLeg.execute,
    );
    expect(req).toEqual({
      id: 'reg-99',
      legId: 'leg-7',
      userId: 'user-jwt-id',
      result: 'RED',
    });
  });
});
