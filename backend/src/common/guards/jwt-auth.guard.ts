import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthTokenPayload } from '../../modules/auth/domain/services/token-service.interface';

/**
 * Verifies a Bearer JWT and attaches the decoded payload to `request.user`.
 * Uses the globally-registered JwtService (secret from config). Any failure
 * yields a generic 401 — no stack trace, no detail leakage.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = header.slice('Bearer '.length).trim();
    try {
      const payload =
        await this.jwtService.verifyAsync<AuthTokenPayload>(token);
      (request as Request & { user: AuthTokenPayload }).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
