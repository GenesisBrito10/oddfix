export type UserRole = 'USER' | 'ADMIN';

/** User data safe to expose over HTTP — never contains the password hash. */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

/**
 * Domain user. Pure: no NestJS, Prisma, JWT or bcrypt knowledge here.
 */
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  toPublic(): PublicUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}
