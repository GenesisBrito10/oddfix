import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisteredSurebetsRepository } from '../../domain/repositories/registered-surebets.repository';
import { RegisteredSurebetHistoryItem } from '../contracts/registered-surebet-history-response';
import { UpdateRegisteredSurebetStatusRequest } from '../contracts/update-registered-surebet-status-request';
import { RegisteredSurebetHistoryMapper } from '../mappers/registered-surebet-history.mapper';

/** Updates the overall status, only for a surebet owned by the user (else 404). */
@Injectable()
export class UpdateRegisteredSurebetStatusUseCase {
  constructor(private readonly repository: RegisteredSurebetsRepository) {}

  async execute(
    request: UpdateRegisteredSurebetStatusRequest,
  ): Promise<RegisteredSurebetHistoryItem> {
    const record = await this.repository.updateStatus(
      request.id,
      request.userId,
      request.status,
    );
    if (!record) {
      throw new NotFoundException('Surebet registrada não encontrada.');
    }
    return RegisteredSurebetHistoryMapper.toItem(record);
  }
}
