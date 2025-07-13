import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AccountType,
  FixedIncomeType,
  RateType,
  TransactionType,
} from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import fixedMock from 'src/mocks/assets-mock.json';
import { FixedIncomeDTO } from '../dtos/FixedIncomeDTO';
import { InvestmentRepository } from '../repositories/InvestmentRepository';

@Injectable()
export class BuyFixedIncomeUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly investmentRepository: InvestmentRepository,
  ) {}

  async execute(userId: string, data: FixedIncomeDTO) {
    const account = await this.prisma.account.findUnique({
      where: { id: data.accountId },
    });

    // Verifica se a conta existe
    if (!account) throw new NotFoundException('Account not found');

    // Verificar se a conta pertence ao user logado
    if (account.userId !== userId)
      throw new ForbiddenException('Account does not belong to the user');

    // Verificar se a conta é do tipo INVESTMENT
    if (account.type !== AccountType.INVESTMENT)
      throw new BadRequestException('Account is not an investment account');

    // Buscar ativo no mock pelo id
    const fixed = fixedMock.fixedIncome.find(
      (f) => f.id === data.fixedIncomeId,
    );
    if (!fixed) throw new NotFoundException('Fixed income asset not found');

    // Verifica se a quantidade que irá investir é menor que o minimo
    if (data.amount < fixed.minimumInvestment)
      throw new BadRequestException(
        `Minimum investment for this asset is ${fixed.minimumInvestment}`,
      );

    // Verifica se o salto é menor que o valor investido
    if (account.balance < data.amount)
      throw new BadRequestException('Insufficient balance');

    // Criar o investimento
    await this.investmentRepository.createFixedIncome({
      userId,
      fixedIncomeId: data.fixedIncomeId,
      name: fixed.name,
      type:
        fixed.type === 'Tesouro Direto'
          ? FixedIncomeType.TESOURO_DIRETO
          : FixedIncomeType.CDB,
      rate: fixed.rate,
      rateType: fixed.rateType === 'pre' ? RateType.PRE : RateType.POS,
      maturity: new Date(fixed.maturity),
      investedAmount: data.amount,
    });

    // Debitar o saldo
    await this.prisma.account.update({
      where: { id: account.id },
      data: { balance: { decrement: data.amount } },
    });

    // Criar transação
    await this.prisma.transaction.create({
      data: {
        accountId: account.id,
        amount: -data.amount,
        type: TransactionType.BUY,
      },
    });

    return {
      message: 'Fixed income purchase completed successfully',
      investedAmount: data.amount,
      fixedIncome: {
        id: fixed.id,
        name: fixed.name,
        rate: fixed.rate,
        maturity: fixed.maturity,
      },
    };
  }
}
