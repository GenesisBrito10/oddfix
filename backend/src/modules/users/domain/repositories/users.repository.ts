import { UserEntity, UserRole } from '../entities/user.entity';

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
}

/**
 * Port for user persistence. Abstract class doubles as the DI token so the
 * application layer depends on this contract, not on Prisma.
 */
export abstract class UsersRepository {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract create(data: CreateUserData): Promise<UserEntity>;
}
