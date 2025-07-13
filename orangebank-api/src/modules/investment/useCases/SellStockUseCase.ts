import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AccountType, TransactionType } from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { InvestmentRepository } from '../repositories/InvestmentRepository';
import assetsMock from 'src/mocks/assets-mock.json';
import { StockDTO } from '../dtos/StockDTO';

@Injectable()
export class SellStockUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly investmentRepo: InvestmentRepository,
  ) {}

  async execute(userId: string, data: StockDTO) {
    const account = await this.prisma.account.findUnique({
      where: { id: data.accountId },
    });

    // Verifica se a conta existe
    if (!account) throw new NotFoundException('Account not found');

    // Verifica se a conta pertente ao usuário autenticado
    if (account.userId !== userId)
      throw new ForbiddenException('Account does not belong to user');

    // Verifica se a conta é de investimento
    if (account.type !== AccountType.INVESTMENT)
      throw new BadRequestException('Only investment accounts can sell stocks');

    // Busca investimento do usuário pelo simbolo da ação
    const investment = await this.investmentRepo.findByUserIdAndSymbol(
      userId,
      data.symbol,
    );

    // Verifica se há investimento e se a quantidade de ativos que quer vender é maior da que possue
    if (!investment || investment.quantity < data.quantity)
      throw new BadRequestException('Not enough stocks to sell');

    // Procura ações no mock
    const stock = assetsMock.stocks.find((s) => s.symbol === data.symbol);
    if (!stock) throw new NotFoundException('Stock not found in mock');

    // Valor total da venda
    const salePrice = stock.currentPrice * data.quantity;

    // Pega quando o usuário pagou pela ação
    const costBasis = investment.averagePrice * data.quantity;

    // Lucro ou prejuizo obtido
    const profit = salePrice - costBasis;

    // Calcula taxa caso tenha lucro
    const tax = profit > 0 ? profit * 0.15 : 0;

    // Valor liquido da venda
    const netValue = salePrice - tax;

    // Verifica restante de ações que o usuario ainda tem
    const remainingQuantity = investment.quantity - data.quantity;

    // Se acabou as ações, vai deletar do investimento
    if (remainingQuantity === 0) {
      await this.investmentRepo.delete(investment.id);
    } else {
      // Atualiza valor das ações
      await this.investmentRepo.update(investment.id, {
        quantity: remainingQuantity,
      });
    }

    // Atualiza valor em caixa na conta de investimento
    await this.prisma.account.update({
      where: { id: account.id },
      data: { balance: { increment: netValue } },
    });

    // Cria uma nova trannsação
    await this.prisma.transaction.create({
      data: {
        accountId: account.id,
        amount: netValue,
        type: TransactionType.SELL,
      },
    });

    return {
      message: 'Stock sale completed successfully',
      grossValue: salePrice,
      tax,
      netValue,
    };
  }
}
