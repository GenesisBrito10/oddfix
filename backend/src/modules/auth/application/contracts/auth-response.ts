import { PublicUser } from '../../../users/domain/entities/user.entity';

export interface AuthResponse {
  accessToken: string;
  user: PublicUser;
}
