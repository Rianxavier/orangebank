import { Injectable } from '@nestjs/common';
import { Account, TransactionType } from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { TransactionRepository } from './TransactionRepository';
import { CreateDepositDTO } from '../dtos/CreateDepositDTO';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createDeposit({
    accountId,
    amount,
  }: CreateDepositDTO): Promise<Account> {
    const updatedAccount = await this.prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    await this.prisma.transaction.create({
      data: {
        accountId,
        amount,
        type: TransactionType.DEPOSIT,
      },
    });

    return updatedAccount;
  }
}
