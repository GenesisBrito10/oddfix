import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  Put,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { createWriteStream, existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';

// Public download + token-gated upload of desktop update artifacts. Lets the
// Electron app point its updater at our own domain (generic provider) instead of
// revealing the GitHub repo. Only these extensions are served/accepted.
const ALLOWED_EXT = new Set(['.exe', '.yml', '.blockmap', '.7z']);

@Controller('downloads')
export class UpdatesController {
  private readonly logger = new Logger('Updates');
  private readonly dir =
    process.env.UPDATES_DIR || join(process.cwd(), 'storage', 'updates');

  private safeName(name: string): string {
    const base = basename(name);
    if (!base || base !== name || base.includes('..')) {
      throw new BadRequestException('invalid filename');
    }
    if (!ALLOWED_EXT.has(extname(base).toLowerCase())) {
      throw new BadRequestException('extension not allowed');
    }
    return base;
  }

  // Public: the updater + web installer fetch latest.yml / *.exe / *.7z here.
  @Get(':file')
  download(@Param('file') file: string, @Res() res: Response): void {
    const full = join(this.dir, this.safeName(file));
    if (!existsSync(full)) {
      res.status(404).send('not found');
      return;
    }
    res.sendFile(full);
  }

  // CI only: raw-binary upload guarded by x-upload-token (UPDATES_UPLOAD_TOKEN).
  @Put('upload/:file')
  async upload(
    @Param('file') file: string,
    @Headers('x-upload-token') token: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const expected = process.env.UPDATES_UPLOAD_TOKEN;
    if (!expected || token !== expected) {
      throw new UnauthorizedException();
    }

    const name = this.safeName(file);
    await mkdir(this.dir, { recursive: true });
    const stream = createWriteStream(join(this.dir, name));
    req.pipe(stream);

    stream.on('finish', () => {
      this.logger.log(`uploaded ${name}`);
      res.status(201).json({ ok: true, file: name });
    });
    stream.on('error', (error) => {
      this.logger.error(`upload failed ${name}: ${error.message}`);
      res.status(500).json({ ok: false });
    });
  }
}
