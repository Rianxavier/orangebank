import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { InvestmentRepository } from '../repositories/InvestmentRepository';
import { TransactionType } from '@prisma/client';

@Injectable()
export class SellFixedIncomeUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly investmentRepo: InvestmentRepository,
  ) {}

  async execute(userId: string, investmentId: string) {
    const investment = await this.prisma.fixedIncomeInvestment.findUnique({
      where: { id: investmentId },
    });

    // Verifica se o investimento existe
    if (!investment) throw new NotFoundException('Investment not found');

    // Verifica se o investimento pertence ao usuario logado
    if (investment.userId !== userId) {
      throw new ForbiddenException('Investment does not belong to the user');
    }

    // Calcula quantos dias se passaram desde o investimento
    const daysInvested =
      (new Date().getTime() - new Date(investment.investedAt).getTime()) /
      (1000 * 60 * 60 * 24);

    // Calcula taxa de juros diária
    const dailyRate = investment.rate / 365;

    // Calcula o investimento está valendo
    const grossYield =
      investment.investedAmount * Math.pow(1 + dailyRate, daysInvested); // simula o crescimento do valor dia a dia.

    // Calcula lucro
    const profit = grossYield - investment.investedAmount;

    // Calcula taxa
    const tax = profit > 0 ? profit * 0.15 : 0;

    // Valor liquido da venda
    const netValue = grossYield - tax;

    const account = await this.prisma.account.findFirst({
      where: {
        userId,
        type: 'INVESTMENT',
      },
    });

    // Verifica se o usuario tem conta de investimento
    if (!account) {
      throw new BadRequestException('User has no investment account');
    }

    // Atualiza valor da conta de investimento apos venda
    await this.prisma.account.update({
      where: { id: account.id },
      data: { balance: { increment: netValue } },
    });

    // Cria transação da venda
    await this.prisma.transaction.create({
      data: {
        accountId: account.id,
        amount: netValue,
        type: TransactionType.SELL,
      },
    });

    // Deleta investimento
    await this.investmentRepo.deleteFixedIncome(investmentId);

    return {
      message: 'Fixed income successfully sold',
      grossYield,
      profit,
      tax,
      netValue,
    };
  }
}
