import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import appConfig from '../../common/config/app.config';
import jwtConfig from '../../common/config/jwt.config';
import { UsersModule } from '../users/users.module';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { PasswordHasher } from './domain/services/password-hasher.interface';
import { TokenService } from './domain/services/token-service.interface';
import { BcryptPasswordHasher } from './infrastructure/services/bcrypt-password-hasher.service';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { AuthController } from './interfaces/http/auth.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      inject: [jwtConfig.KEY, appConfig.KEY],
      useFactory: (
        jwt: ConfigType<typeof jwtConfig>,
        app: ConfigType<typeof appConfig>,
      ): JwtModuleOptions => {
        if (app.nodeEnv === 'production' && !jwt.secret) {
          throw new Error('JWT_SECRET must be set in production');
        }
        return {
          secret: jwt.secret || 'dev-insecure-secret-change-me',
          signOptions: {
            expiresIn: jwt.expiresIn as unknown as NonNullable<
              JwtModuleOptions['signOptions']
            >['expiresIn'],
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    { provide: TokenService, useClass: JwtTokenService },
  ],
})
export class AuthModule {}
