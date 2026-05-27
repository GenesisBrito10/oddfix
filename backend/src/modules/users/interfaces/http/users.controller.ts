import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import type { AuthTokenPayload } from '../../../auth/domain/services/token-service.interface';
import { PublicUser } from '../../domain/entities/user.entity';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';

@Controller('users')
export class UsersController {
  constructor(private readonly getCurrentUserUseCase: GetCurrentUserUseCase) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() payload: AuthTokenPayload): Promise<PublicUser> {
    return this.getCurrentUserUseCase.execute(payload.sub);
  }
}
