import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { GetCurrentSurebetsQuery } from '../../application/contracts/get-current-surebets-query';
import { GetCurrentSurebetsResponse } from '../../application/contracts/get-current-surebets-response';
import { GetCurrentSurebetsUseCase } from '../../application/use-cases/get-current-surebets.use-case';
import {
  GetCurrentSurebetsQueryDto,
  SurebetTypeParam,
} from './dto/get-current-surebets-query.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@Controller('surebets')
@UseGuards(JwtAuthGuard)
export class CurrentSurebetsController {
  constructor(private readonly useCase: GetCurrentSurebetsUseCase) {}

  @Get('current')
  getCurrent(
    @Query() dto: GetCurrentSurebetsQueryDto,
  ): Promise<GetCurrentSurebetsResponse> {
    return this.useCase.execute(this.toQuery(dto));
  }

  private toQuery(dto: GetCurrentSurebetsQueryDto): GetCurrentSurebetsQuery {
    return {
      type: dto.type === SurebetTypeParam.LIVE ? 'LIVE' : 'PREMATCH',
      search: dto.search?.trim() || undefined,
      minPercent: dto.minPercent,
      maxPercent: dto.maxPercent,
      bookmakers: this.splitCsv(dto.bookmakers),
      sports: this.splitCsv(dto.sports),
      legs: dto.legs,
      sort: dto.sort,
      page: dto.page && dto.page > 0 ? dto.page : DEFAULT_PAGE,
      limit: Math.min(
        dto.limit && dto.limit > 0 ? dto.limit : DEFAULT_LIMIT,
        MAX_LIMIT,
      ),
    };
  }

  private splitCsv(value: string | undefined): string[] | undefined {
    if (!value) {
      return undefined;
    }
    const items = value
      .split(',')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
    return items.length > 0 ? items : undefined;
  }
}
