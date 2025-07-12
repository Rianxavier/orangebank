import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repositories/UserRepository';
import { CreateAccountDTO } from '../dtos/CreateAccountDTO';
import { AccountRepository } from '../repositories/AccountRepository';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(account: CreateAccountDTO) {
    const user = await this.userRepository.findById(account.userId);

    // Verificando se existe usuario
    if (!user) throw new NotFoundException('User not found');

    const alreadyHasAccount = user.accounts?.some(
      (acc) => acc.type === account.type,
    );

    // Verificando se já existe o tipo de conta cadastrado
    if (alreadyHasAccount)
      throw new ConflictException(`User already has a ${account.type} account`);

    return this.accountRepository.create(account);
  }
}
