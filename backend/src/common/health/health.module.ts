import { Module } from '@nestjs/common';
import { BetburgerModule } from '../../modules/betburger/betburger.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [BetburgerModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
