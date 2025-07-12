import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountType, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { AccountNumberGeneratorService } from 'src/infra/services/AccountNumberGeneratorService';
import { AccountRepository } from 'src/modules/account/repositories/AccountRepository';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { UserRepository } from '../repositories/UserRepository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
    private readonly accountNumberGenerator: AccountNumberGeneratorService,
  ) {}

  async execute(data: CreateUserDTO): Promise<User> {
    // Validando CPF
    if (!cpfValidator.isValid(data.cpf))
      throw new BadRequestException('Invalid CPF');

    // Verificando se já existe o email cadastrado
    const existEmailUser = await this.userRepository.findByEmail(data.email);
    if (existEmailUser) throw new ConflictException('Email already registered');

    // Verificando se já existe o CPF cadastrado
    const existCpfUser = await this.userRepository.findByCpf(data.cpf);
    if (existCpfUser) throw new ConflictException('CPF already registered');

    const { password, createInvestmentAccount, ...rest } = data;

    // Fazendo hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      ...rest,
      password: hashedPassword,
    });

    // Criar conta corrente
    const checkingAccountNumber = await this.accountNumberGenerator.generate();
    await this.accountRepository.create({
      userId: user.id,
      type: AccountType.CHECKING,
      accountNumber: checkingAccountNumber,
    });

    // Criar conta de investimetno se for solicitado
    if (createInvestmentAccount) {
      const investmentAccountNumber =
        await this.accountNumberGenerator.generate();
      await this.accountRepository.create({
        userId: user.id,
        type: AccountType.INVESTMENT,
        accountNumber: investmentAccountNumber,
      });
    }

    const userWithAccounts = await this.userRepository.findByIdWithAccounts(
      user.id,
    );

    if (!userWithAccounts)
      throw new NotFoundException('User not found after creation');

    return userWithAccounts;
  }
}
