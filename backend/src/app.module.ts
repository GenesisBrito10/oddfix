import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configurations, throttleConfig, validateEnv } from './common/config';
import { PrismaModule } from './common/database/prisma.module';
import { HealthModule } from './common/health/health.module';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { BetburgerModule } from './modules/betburger/betburger.module';
import { RegisteredSurebetsModule } from './modules/registered-surebets/registered-surebets.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { SurebetsCurrentModule } from './modules/surebets-current/surebets-current.module';
import { UpdatesModule } from './modules/updates/updates.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: configurations,
      validate: validateEnv,
    }),
    ThrottlerModule.forRootAsync({
      inject: [throttleConfig.KEY],
      useFactory: (throttle: ConfigType<typeof throttleConfig>) => ({
        throttlers: [
          {
            ttl: throttle.authTtlSeconds * 1000,
            limit: throttle.authLimit,
          },
        ],
      }),
    }),
    PrismaModule,
    RedisModule,
    HealthModule,
    UsersModule,
    AuthModule,
    BetburgerModule,
    SurebetsCurrentModule,
    RegisteredSurebetsModule,
    SchedulerModule,
    UpdatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
