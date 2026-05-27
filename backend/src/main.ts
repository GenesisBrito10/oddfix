import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableShutdownHooks();

  // Behind Nginx/proxy: trust X-Forwarded-* so client IP (rate limit) is correct.
  app.set('trust proxy', 1);

  // Baseline security headers.
  app.use(helmet());

  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string[]>('cors.origins') ?? [];
  const corsCredentials =
    configService.get<boolean>('cors.credentials') ?? true;
  app.enableCors({
    // Production env.validation guarantees an explicit allowlist; dev reflects
    // the request origin so localhost ports just work.
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: corsCredentials,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = configService.get<number>('app.port') ?? 3001;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  const nodeEnv = configService.get<string>('app.nodeEnv');
  const schedulerEnabled = configService.get<boolean>(
    'betburger.schedulerEnabled',
  );
  const redisHost = configService.get<string>('redis.host');
  logger.log(`Oddfix backend listening on port ${port}`);
  logger.log(`Environment: ${nodeEnv ?? 'development'}`);
  logger.log(
    `BetBurger scheduler: ${schedulerEnabled ? 'ENABLED' : 'disabled'}`,
  );
  logger.log(`Redis: ${redisHost ? 'configured' : 'not configured'}`);
  logger.log('Postgres: configured (DATABASE_URL)');
  logger.log(
    `CORS origins: ${corsOrigins.length > 0 ? corsOrigins.join(', ') : '(dev: reflect request origin)'}`,
  );
}
void bootstrap();
