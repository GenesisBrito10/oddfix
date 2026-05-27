import { UnauthorizedException } from '@nestjs/common';
import { LoginUserUseCase } from '../login-user.use-case';
import { RegisterUserUseCase } from '../register-user.use-case';
import {
  FakePasswordHasher,
  FakeTokenService,
  InMemoryUsersRepository,
} from './_fakes';

describe('LoginUserUseCase', () => {
  let repo: InMemoryUsersRepository;
  let hasher: FakePasswordHasher;
  let token: FakeTokenService;
  let login: LoginUserUseCase;
  let register: RegisterUserUseCase;

  beforeEach(async () => {
    repo = new InMemoryUsersRepository();
    hasher = new FakePasswordHasher();
    token = new FakeTokenService();
    register = new RegisterUserUseCase(repo, hasher, token);
    login = new LoginUserUseCase(repo, hasher, token);
    await register.execute({
      name: 'João',
      email: 'joao@email.com',
      password: 'password123',
    });
  });

  it('logs in with correct credentials', async () => {
    const result = await login.execute({
      email: 'joao@email.com',
      password: 'password123',
    });

    expect(result.accessToken).toBeTruthy();
    expect(result.user.email).toBe('joao@email.com');
  });

  it('normalizes email casing on login', async () => {
    const result = await login.execute({
      email: 'JOAO@Email.com',
      password: 'password123',
    });

    expect(result.user.email).toBe('joao@email.com');
  });

  it('fails for a nonexistent user', async () => {
    await expect(
      login.execute({ email: 'nope@email.com', password: 'password123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('fails for a wrong password', async () => {
    await expect(
      login.execute({ email: 'joao@email.com', password: 'wrong-pass' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('never exposes passwordHash in the response', async () => {
    const result = await login.execute({
      email: 'joao@email.com',
      password: 'password123',
    });

    expect(Object.keys(result.user)).not.toContain('passwordHash');
  });
});
