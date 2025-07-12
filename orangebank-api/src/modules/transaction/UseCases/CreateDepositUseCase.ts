import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { CreateDepositDTO } from '../dtos/CreateDepositDTO';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { AccountType } from '@prisma/client';

@Injectable()
export class CreateDepositUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(userId: string, { amount, accountId }: CreateDepositDTO) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    // Verifica se a conta existe
    if (!account) throw new NotFoundException('Account not found');

    if (account.userId !== userId)
      throw new ForbiddenException(
        'You can only deposit into your own account',
      );

    // Verifica se a conta é corrent para poder fazer o deposito
    if (account.type !== AccountType.CHECKING)
      throw new BadRequestException(
        'Deposits can only be made to checking accounts',
      );

    // Verifica quanto vai depositar
    if (amount <= 0) throw new BadRequestException('Invalid deposit amount');

    const updatedAccount = await this.transactionRepository.createDeposit({
      accountId,
      amount,
    });

    return {
      message: 'Deposit successful',
      newBalance: updatedAccount.balance,
    };
  }
}
