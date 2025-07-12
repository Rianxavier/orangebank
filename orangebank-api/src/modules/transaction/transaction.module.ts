import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { CreateDepositUseCase } from './UseCases/CreateDepositUseCase';
import { TransactionController } from './controllers/TransactionController';
import { PrismaTransactionRepository } from './repositories/PrismaTransactionRepository';
import { TransactionRepository } from './repositories/TransactionRepository';

@Module({
  controllers: [TransactionController],
  providers: [
    PrismaService,
    CreateDepositUseCase,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
  ],
})
export class TransactionModule {}
