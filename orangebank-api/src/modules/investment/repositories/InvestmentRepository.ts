import { FixedIncomeInvestment, Investment } from '@prisma/client';
import { Omit } from '@prisma/client/runtime/library';

export abstract class InvestmentRepository {
  abstract findByUserIdAndSymbol(
    userId: string,
    symbol: string,
  ): Promise<Investment | null>;

  abstract create(data: Omit<Investment, 'id'>): Promise<Investment>;

  abstract createFixedIncome(
    data: Omit<FixedIncomeInvestment, 'id' | 'investedAt'>,
  ): Promise<FixedIncomeInvestment>;

  abstract update(id: string, data: Partial<Investment>): Promise<Investment>;

  abstract findManyByUserId(userId: string): Promise<Investment[]>;

  abstract findUserFixedIncome(
    userId: string,
  ): Promise<FixedIncomeInvestment[]>;

  abstract delete(id: string): Promise<void>;
}
