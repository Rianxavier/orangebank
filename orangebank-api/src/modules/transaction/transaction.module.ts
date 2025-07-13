import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { CreateDepositUseCase } from './UseCases/CreateDepositUseCase';
import { TransactionController } from './controllers/TransactionController';
import { PrismaTransactionRepository } from './repositories/PrismaTransactionRepository';
import { TransactionRepository } from './repositories/TransactionRepository';
import { CreateTransferUseCase } from './UseCases/CreateTransferUseCase';
import { GetUserTransactionsUseCase } from './UseCases/GetUserTransactionUseCase';
import { GetTaxReportUseCase } from './UseCases/GetTaxReportUseCase';
import { TaxReportController } from './controllers/TaxReportController';
import { UserRepository } from '../user/repositories/UserRepository';
import { PrismaUserRepository } from '../user/repositories/PrismaUserRepository';

@Module({
  controllers: [TransactionController, TaxReportController],
  providers: [
    PrismaService,
    CreateDepositUseCase,
    CreateTransferUseCase,
    GetUserTransactionsUseCase,
    GetTaxReportUseCase,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class TransactionModule {}
