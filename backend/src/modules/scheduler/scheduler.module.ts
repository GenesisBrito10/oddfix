import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SurebetsCurrentModule } from '../surebets-current/surebets-current.module';
import { BetburgerRefreshScheduler } from './application/betburger-refresh.scheduler';

@Module({
  imports: [ScheduleModule.forRoot(), SurebetsCurrentModule],
  providers: [BetburgerRefreshScheduler],
})
export class SchedulerModule {}
