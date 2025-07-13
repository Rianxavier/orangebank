import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { CreateDepositUseCase } from './UseCases/CreateDepositUseCase';
import { TransactionController } from './controllers/TransactionController';
import { PrismaTransactionRepository } from './repositories/PrismaTransactionRepository';
import { TransactionRepository } from './repositories/TransactionRepository';
import { CreateTransferUseCase } from './UseCases/CreateTransferUseCase';
import { GetUserTransactionsUseCase } from './UseCases/GetUserTransactionUseCase';

@Module({
  controllers: [TransactionController],
  providers: [
    PrismaService,
    CreateDepositUseCase,
    CreateTransferUseCase,
    GetUserTransactionsUseCase,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
  ],
})
export class TransactionModule {}
