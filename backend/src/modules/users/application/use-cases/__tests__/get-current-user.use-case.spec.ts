import { UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../../../domain/entities/user.entity';
import {
  CreateUserData,
  UsersRepository,
} from '../../../domain/repositories/users.repository';
import { GetCurrentUserUseCase } from '../get-current-user.use-case';

class InMemoryUsersRepository extends UsersRepository {
  public readonly users: UserEntity[] = [];

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
      'user-1',
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

describe('GetCurrentUserUseCase', () => {
  let repo: InMemoryUsersRepository;
  let useCase: GetCurrentUserUseCase;

  beforeEach(() => {
    repo = new InMemoryUsersRepository();
    useCase = new GetCurrentUserUseCase(repo);
  });

  it('returns the current user without passwordHash', async () => {
    const created = await repo.create({
      name: 'João',
      email: 'joao@email.com',
      passwordHash: 'hashed:password123',
    });

    const result = await useCase.execute(created.id);

    expect(result.id).toBe(created.id);
    expect(result.email).toBe('joao@email.com');
    expect(Object.keys(result)).not.toContain('passwordHash');
  });

  it('throws when the user does not exist', async () => {
    await expect(useCase.execute('missing-id')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
