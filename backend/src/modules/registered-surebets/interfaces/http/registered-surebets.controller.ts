import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import type { AuthTokenPayload } from '../../../auth/domain/services/token-service.interface';
import { ListRegisteredSurebetsQuery } from '../../application/contracts/list-registered-surebets-query';
import {
  RegisteredSurebetHistoryItem,
  RegisteredSurebetHistoryListResponse,
} from '../../application/contracts/registered-surebet-history-response';
import { RegisteredSurebetResponse } from '../../application/contracts/registered-surebet-response';
import { GetRegisteredSurebetUseCase } from '../../application/use-cases/get-registered-surebet.use-case';
import { ListRegisteredSurebetsUseCase } from '../../application/use-cases/list-registered-surebets.use-case';
import { RegisterSurebetUseCase } from '../../application/use-cases/register-surebet.use-case';
import { UpdateRegisteredSurebetLegResultUseCase } from '../../application/use-cases/update-registered-surebet-leg-result.use-case';
import { UpdateRegisteredSurebetStatusUseCase } from '../../application/use-cases/update-registered-surebet-status.use-case';
import { ListRegisteredSurebetsQueryDto } from './dto/list-registered-surebets-query.dto';
import { RegisterSurebetDto } from './dto/register-surebet.dto';
import { UpdateRegisteredSurebetLegResultDto } from './dto/update-registered-surebet-leg-result.dto';
import { UpdateRegisteredSurebetStatusDto } from './dto/update-registered-surebet-status.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@Controller('surebets')
@UseGuards(JwtAuthGuard)
export class RegisteredSurebetsController {
  constructor(
    private readonly registerUseCase: RegisterSurebetUseCase,
    private readonly listUseCase: ListRegisteredSurebetsUseCase,
    private readonly getUseCase: GetRegisteredSurebetUseCase,
    private readonly updateStatusUseCase: UpdateRegisteredSurebetStatusUseCase,
    private readonly updateLegResultUseCase: UpdateRegisteredSurebetLegResultUseCase,
  ) {}

  @Post('register')
  register(
    @CurrentUser() payload: AuthTokenPayload,
    @Body() dto: RegisterSurebetDto,
  ): Promise<RegisteredSurebetResponse> {
    return this.registerUseCase.execute({
      userId: payload.sub,
      type: dto.type === 'live' ? 'LIVE' : 'PREMATCH',
      snapshotId: dto.snapshotId.trim(),
      arbHash: dto.arbHash.trim(),
    });
  }

  @Get('history')
  list(
    @CurrentUser() payload: AuthTokenPayload,
    @Query() dto: ListRegisteredSurebetsQueryDto,
  ): Promise<RegisteredSurebetHistoryListResponse> {
    return this.listUseCase.execute(this.toListQuery(payload.sub, dto));
  }

  @Get('history/:id')
  getOne(
    @CurrentUser() payload: AuthTokenPayload,
    @Param('id') id: string,
  ): Promise<RegisteredSurebetHistoryItem> {
    return this.getUseCase.execute(id, payload.sub);
  }

  @Patch('history/:id/status')
  updateStatus(
    @CurrentUser() payload: AuthTokenPayload,
    @Param('id') id: string,
    @Body() dto: UpdateRegisteredSurebetStatusDto,
  ): Promise<RegisteredSurebetHistoryItem> {
    return this.updateStatusUseCase.execute({
      id,
      userId: payload.sub,
      status: dto.status,
    });
  }

  @Patch('history/:id/legs/:legId/result')
  updateLegResult(
    @CurrentUser() payload: AuthTokenPayload,
    @Param('id') id: string,
    @Param('legId') legId: string,
    @Body() dto: UpdateRegisteredSurebetLegResultDto,
  ): Promise<RegisteredSurebetHistoryItem> {
    return this.updateLegResultUseCase.execute({
      id,
      legId,
      userId: payload.sub,
      result: dto.result,
    });
  }

  private toListQuery(
    userId: string,
    dto: ListRegisteredSurebetsQueryDto,
  ): ListRegisteredSurebetsQuery {
    return {
      userId,
      status: dto.status,
      type: dto.type,
      search: dto.search?.trim() || undefined,
      sort: dto.sort ?? 'registeredAt_desc',
      page: dto.page && dto.page > 0 ? dto.page : DEFAULT_PAGE,
      limit: Math.min(
        dto.limit && dto.limit > 0 ? dto.limit : DEFAULT_LIMIT,
        MAX_LIMIT,
      ),
    };
  }
}
