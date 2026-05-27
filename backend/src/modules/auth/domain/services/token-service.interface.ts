export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: string;
}

/**
 * Port for signing/verifying auth tokens. Implemented in infrastructure (JWT).
 */
export abstract class TokenService {
  abstract sign(payload: AuthTokenPayload): Promise<string>;
  abstract verify(token: string): Promise<AuthTokenPayload>;
}
