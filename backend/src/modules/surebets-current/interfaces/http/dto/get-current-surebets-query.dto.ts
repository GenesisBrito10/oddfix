import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum SurebetTypeParam {
  LIVE = 'live',
  PREMATCH = 'prematch',
}

export class GetCurrentSurebetsQueryDto {
  @IsEnum(SurebetTypeParam)
  type: SurebetTypeParam;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPercent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPercent?: number;

  @IsOptional()
  @IsString()
  bookmakers?: string;

  @IsOptional()
  @IsString()
  sports?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  legs?: number;

  @IsOptional()
  @IsIn(['profit', 'recent', 'start'])
  sort?: 'profit' | 'recent' | 'start';

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
}
