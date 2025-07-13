import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { FixedIncomeInvestment, Investment } from '@prisma/client';
import { InvestmentRepository } from './InvestmentRepository';

@Injectable()
export class PrismaInvestmentRepository implements InvestmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserIdAndSymbol(
    userId: string,
    symbol: string,
  ): Promise<Investment | null> {
    return this.prisma.investment.findFirst({
      where: {
        userId,
        symbol,
      },
    });
  }

  async create(data: Omit<Investment, 'id'>): Promise<Investment> {
    return this.prisma.investment.create({ data });
  }

  async createFixedIncome(
    data: Omit<FixedIncomeInvestment, 'id' | 'investedAt'>,
  ): Promise<FixedIncomeInvestment> {
    return this.prisma.fixedIncomeInvestment.create({ data });
  }

  async update(id: string, data: Partial<Investment>): Promise<Investment> {
    return this.prisma.investment.update({
      where: { id },
      data,
    });
  }

  async findManyByUserId(userId: string): Promise<Investment[]> {
    return this.prisma.investment.findMany({
      where: { userId },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.investment.delete({
      where: { id },
    });
  }
}
