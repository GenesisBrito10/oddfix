import { User as PrismaUser } from '@prisma/client';
import { UserEntity } from '../../domain/entities/user.entity';

/** Translates between the Prisma row and the domain entity. */
export class UserMapper {
  static toDomain(row: PrismaUser): UserEntity {
    return new UserEntity(
      row.id,
      row.name,
      row.email,
      row.passwordHash,
      row.role,
      row.createdAt,
      row.updatedAt,
    );
  }
}
