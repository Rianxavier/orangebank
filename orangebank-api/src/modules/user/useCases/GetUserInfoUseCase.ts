import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/UserRepository';

@Injectable()
export class GetUserInfoUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findByIdWithAccounts(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      accounts: user.accounts?.map((acc) => ({
        id: acc.id,
        type: acc.type,
        accountNumber: acc.accountNumber,
        balance: acc.balance,
      })),
    };
  }
}
