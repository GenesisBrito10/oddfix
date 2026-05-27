import { IsEnum } from 'class-validator';
import { SurebetTypeParam } from './get-current-surebets-query.dto';

export class StreamSurebetsQueryDto {
  @IsEnum(SurebetTypeParam)
  type: SurebetTypeParam;
}
