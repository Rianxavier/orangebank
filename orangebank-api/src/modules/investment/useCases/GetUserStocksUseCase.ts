import { Injectable } from '@nestjs/common';
import { InvestmentRepository } from '../repositories/InvestmentRepository';
import assetsMock from 'src/mocks/assets-mock.json';

@Injectable()
export class GetUserStocksUseCase {
  constructor(private readonly investmentRepo: InvestmentRepository) {}

  async execute(userId: string) {
    const investments = await this.investmentRepo.findManyByUserId(userId);

    const stocks = assetsMock.stocks;

    return investments.map((inv) => {
      const stockData = stocks.find((s) => s.symbol === inv.symbol);

      // Pega o valor da ação ou valor médio do investimento
      const currentPrice = stockData?.currentPrice ?? inv.averagePrice;

      // Verifica posição atual das ações compradas
      const totalCurrentValue = inv.quantity * currentPrice;

      // Verifica total investido nas ações
      const totalInvested = inv.quantity * inv.averagePrice;

      // Verifica lucro ou prejuizo
      const profit = totalCurrentValue - totalInvested;

      return {
        symbol: inv.symbol,
        name: inv.name,
        sector: inv.sector,
        quantity: inv.quantity,
        averagePrice: inv.averagePrice,
        currentPrice,
        totalInvested,
        totalCurrentValue,
        profit,
      };
    });
  }
}
