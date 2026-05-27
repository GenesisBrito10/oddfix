import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisteredSurebetsRepository } from '../../domain/repositories/registered-surebets.repository';
import { RegisteredSurebetHistoryItem } from '../contracts/registered-surebet-history-response';
import { RegisteredSurebetHistoryMapper } from '../mappers/registered-surebet-history.mapper';

/** Returns one registered surebet, but only if it belongs to the user (else 404). */
@Injectable()
export class GetRegisteredSurebetUseCase {
  constructor(private readonly repository: RegisteredSurebetsRepository) {}

  async execute(
    id: string,
    userId: string,
  ): Promise<RegisteredSurebetHistoryItem> {
    const record = await this.repository.findByIdForUser(id, userId);
    if (!record) {
      throw new NotFoundException('Surebet registrada não encontrada.');
    }
    return RegisteredSurebetHistoryMapper.toItem(record);
  }
}
