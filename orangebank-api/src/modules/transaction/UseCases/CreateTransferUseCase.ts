import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountType, TransactionType } from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { CreateTransferDTO } from '../dtos/CreateTransferDTO';

@Injectable()
export class CreateTransferUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dados: CreateTransferDTO) {
    if (dados.amount <= 0)
      throw new BadRequestException('Invalid transfer amount');

    const source = await this.prisma.account.findUnique({
      where: { id: dados.sourceAccountId },
    });

    if (!source) throw new NotFoundException('Source account not found');

    // Verifica se a conta de origim pertence ao usuário autenticado
    if (source.userId !== userId)
      throw new ForbiddenException(
        'Not possible to transfer from an account that you are not authenticated',
      );

    if (!dados.sourceAccountId)
      throw new BadRequestException('Source account ID is required');

    const destination = await this.prisma.account.findUnique({
      where: { accountNumber: dados.accountNumber },
    });

    if (!destination)
      throw new NotFoundException('Destination account not found');

    // Verifica se a transferência é interna
    const isInternal = source.userId === destination.userId;

    // Verifica se o tipo da conta de origin é diferente da de destino
    if (isInternal && source.type === destination.type) {
      throw new BadRequestException(
        'Internal transfers must be between different account types',
      );
    }

    if (!isInternal) {
      // Verifica se a conta de origem é de investimento e se é para outro usuário
      if (source.type === AccountType.INVESTMENT)
        throw new ForbiddenException(
          'Cannot transfer from investment account to another user',
        );

      // Verifica se a transferência externa é para uma conta corrente
      if (destination.type === AccountType.INVESTMENT)
        throw new BadRequestException(
          'External transfer must be to a checking account',
        );
    }

    // Verifica quanto que vai ter de taxa
    const fee = isInternal ? 0 : dados.amount * 0.005;
    const totalDebit = dados.amount + fee;

    if (source.balance < totalDebit)
      throw new BadRequestException('Insufficient balance');

    await this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: source.id },
        data: { balance: { decrement: totalDebit } },
      }),
      this.prisma.account.update({
        where: { id: destination.id },
        data: { balance: { increment: dados.amount } },
      }),
      this.prisma.transaction.createMany({
        data: [
          {
            accountId: source.id,
            amount: -dados.amount,
            type: TransactionType.TRANSFER,
          },
          {
            accountId: destination.id,
            amount: dados.amount,
            type: TransactionType.TRANSFER,
          },
        ],
      }),
    ]);

    return {
      message: `Transfer ${isInternal ? 'completed' : 'with fee'} successfully`,
      fee: fee > 0 ? fee : undefined,
      destinationAccountNumber: destination.accountNumber,
      totalDebit: totalDebit,
    };
  }
}
