import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { Investment } from '@prisma/client';
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
}
