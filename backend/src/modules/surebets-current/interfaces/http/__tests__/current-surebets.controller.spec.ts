import { GetCurrentSurebetsQuery } from '../../../application/contracts/get-current-surebets-query';
import { GetCurrentSurebetsUseCase } from '../../../application/use-cases/get-current-surebets.use-case';
import { CurrentSurebetsController } from '../current-surebets.controller';
import {
  GetCurrentSurebetsQueryDto,
  SurebetTypeParam,
} from '../dto/get-current-surebets-query.dto';

function build() {
  const useCase = { execute: jest.fn().mockResolvedValue({ surebets: [] }) };
  const controller = new CurrentSurebetsController(
    useCase as unknown as GetCurrentSurebetsUseCase,
  );
  return { controller, useCase };
}

function lastQuery(useCase: { execute: jest.Mock }): GetCurrentSurebetsQuery {
  const calls = useCase.execute.mock.calls as unknown as [
    GetCurrentSurebetsQuery,
  ][];
  return calls[0][0];
}

describe('CurrentSurebetsController', () => {
  it('maps type live -> LIVE and applies page/limit defaults', async () => {
    const { controller, useCase } = build();
    const dto = new GetCurrentSurebetsQueryDto();
    dto.type = SurebetTypeParam.LIVE;
    await controller.getCurrent(dto);

    const query = lastQuery(useCase);
    expect(query.type).toBe('LIVE');
    expect(query.page).toBe(1);
    expect(query.limit).toBe(20);
  });

  it('maps type prematch -> PREMATCH and splits csv filters', async () => {
    const { controller, useCase } = build();
    const dto = new GetCurrentSurebetsQueryDto();
    dto.type = SurebetTypeParam.PREMATCH;
    dto.bookmakers = 'BetNacional, Blaze';
    dto.sports = 'Baseball,Tennis';
    await controller.getCurrent(dto);

    const query = lastQuery(useCase);
    expect(query.type).toBe('PREMATCH');
    expect(query.bookmakers).toEqual(['BetNacional', 'Blaze']);
    expect(query.sports).toEqual(['Baseball', 'Tennis']);
  });

  it('caps limit at 100', async () => {
    const { controller, useCase } = build();
    const dto = new GetCurrentSurebetsQueryDto();
    dto.type = SurebetTypeParam.LIVE;
    dto.limit = 500;
    await controller.getCurrent(dto);

    expect(lastQuery(useCase).limit).toBe(100);
  });
});
