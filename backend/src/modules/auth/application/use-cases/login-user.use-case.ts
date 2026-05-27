import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../../users/domain/repositories/users.repository';
import { PasswordHasher } from '../../domain/services/password-hasher.interface';
import { TokenService } from '../../domain/services/token-service.interface';
import { AuthResponse } from '../contracts/auth-response';

export interface LoginUserInput {
  email: string;
  password: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginUserInput): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      // Generic message: do not reveal whether the email exists.
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken, user: user.toPublic() };
  }
}
