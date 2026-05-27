import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SurebetsCurrentModule } from '../surebets-current/surebets-current.module';
import { GetRegisteredSurebetUseCase } from './application/use-cases/get-registered-surebet.use-case';
import { ListRegisteredSurebetsUseCase } from './application/use-cases/list-registered-surebets.use-case';
import { RegisterSurebetUseCase } from './application/use-cases/register-surebet.use-case';
import { UpdateRegisteredSurebetLegResultUseCase } from './application/use-cases/update-registered-surebet-leg-result.use-case';
import { UpdateRegisteredSurebetStatusUseCase } from './application/use-cases/update-registered-surebet-status.use-case';
import { RegisteredSurebetsRepository } from './domain/repositories/registered-surebets.repository';
import { PrismaRegisteredSurebetsRepository } from './infrastructure/repositories/prisma-registered-surebets.repository';
import { RegisteredSurebetsController } from './interfaces/http/registered-surebets.controller';

/**
 * Fase 9: manual surebet registration. Reuses SnapshotSurebetsCacheRepository
 * (exported by SurebetsCurrentModule) to read the temporary Redis snapshot, and
 * persists the chosen arb to Postgres. No BetBurger dependency.
 */
@Module({
  imports: [SurebetsCurrentModule],
  controllers: [RegisteredSurebetsController],
  providers: [
    RegisterSurebetUseCase,
    ListRegisteredSurebetsUseCase,
    GetRegisteredSurebetUseCase,
    UpdateRegisteredSurebetStatusUseCase,
    UpdateRegisteredSurebetLegResultUseCase,
    JwtAuthGuard,
    {
      provide: RegisteredSurebetsRepository,
      useClass: PrismaRegisteredSurebetsRepository,
    },
  ],
  exports: [RegisterSurebetUseCase],
})
export class RegisteredSurebetsModule {}
