import { Injectable } from '@nestjs/common';
import { InvestmentRepository } from '../repositories/InvestmentRepository';
import fixedMock from 'src/mocks/assets-mock.json';

@Injectable()
export class GetUserFixedIncomesUseCase {
  constructor(private readonly investmentRepo: InvestmentRepository) {}

  async execute(userId: string) {
    const investments = await this.investmentRepo.findUserFixedIncome(userId);

    return investments.map((inv) => {
      const mock = fixedMock.fixedIncome.find(
        (m) => m.id === inv.fixedIncomeId,
      );

      // Calcula quantos dias se passaram desde o investimento
      const daysInvested =
        (new Date().getTime() - new Date(inv.investedAt).getTime()) /
        (1000 * 60 * 60 * 24);

      // Calcula taxa de juros diária
      const dailyRate = inv.rate / 365;

      // Calcula o investimento está valendo
      const grossYield =
        inv.investedAmount * Math.pow(1 + dailyRate, daysInvested); // simula o crescimento do valor dia a dia.

      // Calcula lucro
      const profit = grossYield - inv.investedAmount;

      return {
        id: inv.id,
        name: inv.name,
        type: inv.type,
        rate: inv.rate,
        rateType: inv.rateType,
        maturity: inv.maturity,
        investedAmount: inv.investedAmount,
        investedAt: inv.investedAt,
        currentValue: grossYield,
        profit,
        mockInfo: {
          minimumInvestment: mock?.minimumInvestment,
        },
      };
    });
  }
}
