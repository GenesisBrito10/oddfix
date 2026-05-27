import { UserEntity } from '../../../../users/domain/entities/user.entity';
import {
  CreateUserData,
  UsersRepository,
} from '../../../../users/domain/repositories/users.repository';
import { PasswordHasher } from '../../../domain/services/password-hasher.interface';
import {
  AuthTokenPayload,
  TokenService,
} from '../../../domain/services/token-service.interface';

export class InMemoryUsersRepository extends UsersRepository {
  public readonly users: UserEntity[] = [];
  private seq = 1;

  findById(id: string): Promise<UserEntity | null> {
    return Promise.resolve(this.users.find((user) => user.id === id) ?? null);
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return Promise.resolve(
      this.users.find((user) => user.email === email) ?? null,
    );
  }

  create(data: CreateUserData): Promise<UserEntity> {
    const now = new Date();
    const user = new UserEntity(
      `user-${this.seq++}`,
      data.name,
      data.email,
      data.passwordHash,
      data.role ?? 'USER',
      now,
      now,
    );
    this.users.push(user);
    return Promise.resolve(user);
  }
}

export class FakePasswordHasher extends PasswordHasher {
  hash(plain: string): Promise<string> {
    return Promise.resolve(`hashed:${plain}`);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return Promise.resolve(hash === `hashed:${plain}`);
  }
}

export class FakeTokenService extends TokenService {
  sign(payload: AuthTokenPayload): Promise<string> {
    return Promise.resolve(`token:${payload.sub}`);
  }

  verify(token: string): Promise<AuthTokenPayload> {
    return Promise.resolve({
      sub: token.replace('token:', ''),
      email: '',
      role: 'USER',
    });
  }
}
