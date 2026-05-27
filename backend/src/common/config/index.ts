import appConfig from './app.config';
import betburgerConfig from './betburger.config';
import corsConfig from './cors.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import redisConfig from './redis.config';
import throttleConfig from './throttle.config';

export {
  appConfig,
  betburgerConfig,
  corsConfig,
  databaseConfig,
  jwtConfig,
  redisConfig,
  throttleConfig,
};
export { validateEnv, EnvironmentVariables, NodeEnv } from './env.validation';

/** All namespaced configs to feed into ConfigModule.forRoot({ load }). */
export const configurations = [
  appConfig,
  databaseConfig,
  redisConfig,
  jwtConfig,
  betburgerConfig,
  corsConfig,
  throttleConfig,
];
