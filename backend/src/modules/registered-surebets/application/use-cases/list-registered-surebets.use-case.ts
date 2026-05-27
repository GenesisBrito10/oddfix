import { Injectable } from '@nestjs/common';
import { RegisteredSurebetsRepository } from '../../domain/repositories/registered-surebets.repository';
import { ListRegisteredSurebetsQuery } from '../contracts/list-registered-surebets-query';
import { RegisteredSurebetHistoryListResponse } from '../contracts/registered-surebet-history-response';
import { RegisteredSurebetHistoryMapper } from '../mappers/registered-surebet-history.mapper';

/** Lists the logged-in user's registered surebets. Scoped by userId in the repo. */
@Injectable()
export class ListRegisteredSurebetsUseCase {
  constructor(private readonly repository: RegisteredSurebetsRepository) {}

  async execute(
    query: ListRegisteredSurebetsQuery,
  ): Promise<RegisteredSurebetHistoryListResponse> {
    const result = await this.repository.listByUser(query);
    return RegisteredSurebetHistoryMapper.toListResponse(
      result,
      query.page,
      query.limit,
    );
  }
}
