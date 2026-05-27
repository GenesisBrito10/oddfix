import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisteredSurebetsRepository } from '../../domain/repositories/registered-surebets.repository';
import { RegisteredSurebetHistoryItem } from '../contracts/registered-surebet-history-response';
import { UpdateRegisteredSurebetLegResultRequest } from '../contracts/update-registered-surebet-leg-result-request';
import { RegisteredSurebetHistoryMapper } from '../mappers/registered-surebet-history.mapper';

/**
 * Updates one leg's result, only when the leg belongs to a surebet owned by the
 * user (else 404). Overall status stays manual (not auto-updated this phase).
 */
@Injectable()
export class UpdateRegisteredSurebetLegResultUseCase {
  constructor(private readonly repository: RegisteredSurebetsRepository) {}

  async execute(
    request: UpdateRegisteredSurebetLegResultRequest,
  ): Promise<RegisteredSurebetHistoryItem> {
    const record = await this.repository.updateLegResult(
      request.id,
      request.legId,
      request.userId,
      request.result,
    );
    if (!record) {
      throw new NotFoundException('Aposta registrada não encontrada.');
    }
    return RegisteredSurebetHistoryMapper.toItem(record);
  }
}
