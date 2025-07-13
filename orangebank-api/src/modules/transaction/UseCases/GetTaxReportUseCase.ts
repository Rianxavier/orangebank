import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { TransactionType } from '@prisma/client';
import { UserRepository } from 'src/modules/user/repositories/UserRepository';

@Injectable()
export class GetTaxReportUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findByIdWithAccounts(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Busca todas as contas do usuário
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });

    const accountIds = accounts.map((acc) => acc.id);

    // Busca todas as transações de venda
    const sellTransactions = await this.prisma.transaction.findMany({
      where: {
        accountId: { in: accountIds },
        type: TransactionType.SELL,
        NOT: { symbol: null },
      },
      orderBy: { createdAt: 'desc' },
    });

    const report: {
      date: Date;
      symbol: string | null;
      quantity: number;
      saleTotal: number;
      averagePrice: number;
      profit: number;
      tax: number;
    }[] = [];

    for (const transaction of sellTransactions) {
      const investment = await this.prisma.investment.findFirst({
        where: {
          userId,
          symbol: transaction.symbol!,
        },
      });

      const quantity = transaction.quantity ?? 0;
      const averagePrice = investment?.averagePrice ?? 0;
      const costBasis = averagePrice * quantity;
      const profit = transaction.amount - costBasis;
      const tax = profit > 0 ? profit * 0.15 : 0;

      report.push({
        date: transaction.createdAt,
        symbol: transaction.symbol,
        quantity,
        saleTotal: transaction.amount,
        averagePrice,
        profit,
        tax,
      });
    }

    return {
      userId,
      year: new Date().getFullYear(),
      transactions: report,
      totalTaxPaid: report.reduce((acc, cur) => acc + cur.tax, 0),
    };
  }
}
