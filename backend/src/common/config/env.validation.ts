import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * Runtime environment schema. Fields are optional with sane defaults so the
 * app can still boot in development without a full `.env` (health endpoint
 * will report any unreachable dependency instead of crashing the process).
 * Secrets (JWT, BetBurger token) stay optional until the phases that need them.
 */
export class EnvironmentVariables {
  @IsOptional()
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsOptional()
  @IsNumber()
  PORT: number = 3001;

  @IsOptional()
  @IsString()
  DATABASE_URL: string =
    'postgresql://oddfix_user:oddfix_pass@localhost:5433/oddfix_db?schema=public';

  @IsOptional()
  @IsString()
  REDIS_HOST: string = 'localhost';

  @IsOptional()
  @IsNumber()
  REDIS_PORT: number = 6379;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string;

  @IsOptional()
  @IsString()
  JWT_SECRET?: string;

  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN: string = '7d';

  @IsOptional()
  @IsString()
  BETBURGER_ACCESS_TOKEN?: string;

  @IsOptional()
  @IsString()
  CORS_ORIGINS?: string;

  @IsOptional()
  @IsString()
  CORS_CREDENTIALS: string = 'true';

  @IsOptional()
  @IsNumber()
  AUTH_THROTTLE_TTL_SECONDS: number = 60;

  @IsOptional()
  @IsNumber()
  AUTH_THROTTLE_LIMIT: number = 10;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration: ${errors.toString()}`);
  }

  // Production-only hard requirements. In dev/test we stay permissive so the
  // app boots without a full .env.
  if (validated.NODE_ENV === NodeEnv.Production) {
    const problems: string[] = [];
    if (!validated.JWT_SECRET || validated.JWT_SECRET.trim().length === 0) {
      problems.push('JWT_SECRET is required in production');
    }
    const origins = (validated.CORS_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0);
    if (origins.length === 0) {
      problems.push('CORS_ORIGINS must list at least one origin in production');
    }
    if (origins.includes('*')) {
      problems.push('CORS_ORIGINS must not use the "*" wildcard in production');
    }
    if (problems.length > 0) {
      throw new Error(
        `Invalid production configuration: ${problems.join('; ')}`,
      );
    }
  }

  return validated;
}
