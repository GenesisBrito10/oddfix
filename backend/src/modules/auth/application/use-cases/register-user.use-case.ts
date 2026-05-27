import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../users/domain/repositories/users.repository';
import { PasswordHasher } from '../../domain/services/password-hasher.interface';
import { TokenService } from '../../domain/services/token-service.interface';
import { AuthResponse } from '../contracts/auth-response';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: RegisterUserInput): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();

    const existing = await this.usersRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.usersRepository.create({
      name: input.name.trim(),
      email,
      passwordHash,
    });

    const accessToken = await this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken, user: user.toPublic() };
  }
}
