import { ConflictException } from '@nestjs/common';
import { RegisterUserUseCase } from '../register-user.use-case';
import {
  FakePasswordHasher,
  FakeTokenService,
  InMemoryUsersRepository,
} from './_fakes';

describe('RegisterUserUseCase', () => {
  let repo: InMemoryUsersRepository;
  let hasher: FakePasswordHasher;
  let token: FakeTokenService;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    repo = new InMemoryUsersRepository();
    hasher = new FakePasswordHasher();
    token = new FakeTokenService();
    useCase = new RegisterUserUseCase(repo, hasher, token);
  });

  it('registers a user, normalizes email and returns a token', async () => {
    const result = await useCase.execute({
      name: 'João Silva',
      email: 'Joao@Email.com',
      password: 'password123',
    });

    expect(result.accessToken).toBeTruthy();
    expect(result.user.id).toBeTruthy();
    expect(result.user.email).toBe('joao@email.com');
    expect(result.user.role).toBe('USER');
  });

  it('hashes the password before storing it', async () => {
    const spy = jest.spyOn(hasher, 'hash');
    await useCase.execute({
      name: 'Ana',
      email: 'ana@email.com',
      password: 'secret123',
    });

    expect(spy).toHaveBeenCalledWith('secret123');
    expect(repo.users[0].passwordHash).toBe('hashed:secret123');
  });

  it('never exposes passwordHash in the response', async () => {
    const result = await useCase.execute({
      name: 'Ana',
      email: 'ana@email.com',
      password: 'password123',
    });

    expect(Object.keys(result.user)).not.toContain('passwordHash');
  });

  it('rejects a duplicate email', async () => {
    await useCase.execute({
      name: 'Ana',
      email: 'dup@email.com',
      password: 'password123',
    });

    await expect(
      useCase.execute({
        name: 'Bob',
        email: 'dup@email.com',
        password: 'password123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
