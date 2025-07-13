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
export class BuyStockUseCase {
  constructor(
    private readonly investmentRepo: InvestmentRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string, data: StockDTO) {
    const account = await this.prisma.account.findUnique({
      where: { id: data.accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Verificar se a conta pertence ao user logado
    if (account.userId !== userId) {
      throw new ForbiddenException('Account does not belong to the user');
    }

    // Verificar se a conta é do tipo INVESTMENT
    if (account.type !== AccountType.INVESTMENT) {
      throw new BadRequestException('Account is not an investment account');
    }

    // Buscar ativo no mock pelo symbol
    const stock = assetsMock.stocks.find((s) => s.symbol === data.symbol);

    if (!stock) {
      throw new NotFoundException('Stock symbol not found');
    }

    // Calcular total e taxa corretagem (1%)
    const totalPrice = stock.currentPrice * data.quantity;
    const fee = totalPrice * 0.01;
    const totalCost = totalPrice + fee;

    if (account.balance < totalCost) {
      throw new BadRequestException(
        'Insufficient balance in investment account',
      );
    }

    // Verificar se já existe investimento do usuário para esse símbolo
    const existingInvestment = await this.investmentRepo.findByUserIdAndSymbol(
      userId,
      data.symbol,
    );

    if (existingInvestment) {
      // Atualizar investimento existente
      const newQuantity = existingInvestment.quantity + data.quantity;
      const newAveragePrice =
        (existingInvestment.averagePrice * existingInvestment.quantity +
          stock.currentPrice * data.quantity) /
        newQuantity;

      await this.investmentRepo.update(existingInvestment.id, {
        quantity: newQuantity,
        averagePrice: newAveragePrice,
      });
    } else {
      // Criar novo investimento
      await this.investmentRepo.create({
        userId,
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector,
        quantity: data.quantity,
        averagePrice: stock.currentPrice,
        createdAt: new Date(),
      });
    }

    // Debitar o saldo da conta investimento
    await this.prisma.account.update({
      where: { id: account.id },
      data: { balance: { decrement: totalCost } },
    });

    // Criar a transação do tipo BUY
    await this.prisma.transaction.create({
      data: {
        accountId: account.id,
        amount: -totalCost,
        type: TransactionType.BUY,
      },
    });

    return {
      message: 'Stock purchase completed successfully',
      totalCost,
      fee,
      stock: {
        symbol: stock.symbol,
        name: stock.name,
        quantity: data.quantity,
        pricePerUnit: stock.currentPrice,
      },
    };
  }
}
