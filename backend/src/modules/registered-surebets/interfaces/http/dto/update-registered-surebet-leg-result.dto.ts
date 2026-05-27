import { Transform } from 'class-transformer';
import { IsIn } from 'class-validator';
import type { SurebetLegResultValue } from '../../../domain/repositories/registered-surebets.repository';

const RESULTS = ['PENDING', 'GREEN', 'RED', 'VOID', 'CANCELLED'] as const;

export class UpdateRegisteredSurebetLegResultDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsIn(RESULTS)
  result: SurebetLegResultValue;
}
