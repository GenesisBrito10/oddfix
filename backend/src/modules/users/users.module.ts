import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user.use-case';
import { UsersRepository } from './domain/repositories/users.repository';
import { PrismaUsersRepository } from './infrastructure/repositories/prisma-users.repository';
import { UsersController } from './interfaces/http/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    GetCurrentUserUseCase,
    JwtAuthGuard,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
  ],
  exports: [UsersRepository, GetCurrentUserUseCase],
})
export class UsersModule {}
