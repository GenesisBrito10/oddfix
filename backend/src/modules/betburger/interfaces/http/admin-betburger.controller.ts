import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { BetburgerCatalogSyncResult } from '../../application/contracts/betburger-catalog-sync-result';
import { SyncBetburgerCatalogUseCase } from '../../application/use-cases/sync-betburger-catalog.use-case';

@Controller('admin/betburger')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminBetburgerController {
  constructor(
    private readonly syncBetburgerCatalogUseCase: SyncBetburgerCatalogUseCase,
  ) {}

  @Post('sync-catalog')
  @HttpCode(HttpStatus.OK)
  async syncCatalog(): Promise<{
    message: string;
    result: BetburgerCatalogSyncResult;
  }> {
    const result = await this.syncBetburgerCatalogUseCase.execute();
    return { message: 'BetBurger catalog synced successfully', result };
  }
}
