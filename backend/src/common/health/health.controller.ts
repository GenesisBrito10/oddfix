import { Controller, Get } from '@nestjs/common';
import { HealthReport, HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Always responds 200 with a structured report. Dependency outages are
   * surfaced via `services.*` + `status: degraded` rather than failing the
   * request, so monitoring can read the body without the app crashing.
   */
  @Get()
  check(): Promise<HealthReport> {
    return this.healthService.check();
  }
}
