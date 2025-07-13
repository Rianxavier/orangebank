import { Investment } from '@prisma/client';

export abstract class InvestmentRepository {
  abstract findByUserIdAndSymbol(
    userId: string,
    symbol: string,
  ): Promise<Investment | null>;

  abstract create(data: Omit<Investment, 'id'>): Promise<Investment>;

  abstract update(id: string, data: Partial<Investment>): Promise<Investment>;

  abstract findManyByUserId(userId: string): Promise<Investment[]>;
}
