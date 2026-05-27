import { Transform } from 'class-transformer';
import { IsIn } from 'class-validator';
import type { RegisteredSurebetStatusValue } from '../../../domain/repositories/registered-surebets.repository';

const STATUSES = ['PENDING', 'GREEN', 'RED', 'VOID', 'CANCELLED'] as const;

export class UpdateRegisteredSurebetStatusDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsIn(STATUSES)
  status: RegisteredSurebetStatusValue;
}
