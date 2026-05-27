import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import type {
  RegisteredSurebetSort,
  RegisteredSurebetStatusValue,
} from '../../../domain/repositories/registered-surebets.repository';

const STATUSES = ['PENDING', 'GREEN', 'RED', 'VOID', 'CANCELLED'] as const;
const SORTS = [
  'registeredAt_desc',
  'registeredAt_asc',
  'percent_desc',
  'percent_asc',
] as const;

const toUpper = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.toUpperCase() : value;

export class ListRegisteredSurebetsQueryDto {
  @IsOptional()
  @Transform(toUpper)
  @IsIn(STATUSES)
  status?: RegisteredSurebetStatusValue;

  @IsOptional()
  @Transform(toUpper)
  @IsIn(['LIVE', 'PREMATCH'])
  type?: 'LIVE' | 'PREMATCH';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsIn(SORTS)
  sort?: RegisteredSurebetSort;
}
