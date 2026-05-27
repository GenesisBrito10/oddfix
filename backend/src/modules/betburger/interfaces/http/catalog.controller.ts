import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { ActiveBookmaker } from '../../domain/repositories/bookmakers.repository';
import { ListBookmakersUseCase } from '../../application/use-cases/list-bookmakers.use-case';

/**
 * Read-only catalog for the frontend (authenticated). Serves the bookmakers
 * synced from BetBurger /user_bookmakers (from Postgres — no BetBurger call).
 */
@Controller('catalog')
@UseGuards(JwtAuthGuard)
export class CatalogController {
  constructor(private readonly listBookmakers: ListBookmakersUseCase) {}

  @Get('bookmakers')
  bookmakers(): Promise<ActiveBookmaker[]> {
    return this.listBookmakers.execute();
  }
}
