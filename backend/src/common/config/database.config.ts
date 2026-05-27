import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url:
    process.env.DATABASE_URL ??
    'postgresql://oddfix_user:oddfix_pass@localhost:5433/oddfix_db?schema=public',
}));
