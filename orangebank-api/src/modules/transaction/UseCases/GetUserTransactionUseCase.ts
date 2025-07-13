import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/PrismaService';

@Injectable()
export class GetUserTransactionsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    // Buscar todas as contas do usuário
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true, accountNumber: true },
    });

    const accountIds = accounts.map((a) => a.id);

    // Buscar transações dessas contas
    const transactions = await this.prisma.transaction.findMany({
      where: { accountId: { in: accountIds } },
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map((tx) => {
      const account = accounts.find((a) => a.id === tx.accountId);
      return {
        id: tx.id,
        accountNumber: account?.accountNumber,
        type: tx.type,
        amount: tx.amount,
        createdAt: tx.createdAt,
      };
    });
  }
}
