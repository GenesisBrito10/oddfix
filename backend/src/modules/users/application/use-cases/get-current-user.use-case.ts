import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PublicUser } from '../../domain/entities/user.entity';
import { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<PublicUser> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    return user.toPublic();
  }
}
