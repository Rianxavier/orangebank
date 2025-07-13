import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { StockController } from './controllers/StockController';
import { BuyStockUseCase } from './useCases/BuyStockUseCase';
import { InvestmentRepository } from './repositories/InvestmentRepository';
import { PrismaInvestmentRepository } from './repositories/PrismaInvestmentRepository';
import { GetUserStocksUseCase } from './useCases/GetUserStocksUseCase';

@Module({
  controllers: [StockController],
  providers: [
    PrismaService,
    BuyStockUseCase,
    GetUserStocksUseCase,
    {
      provide: InvestmentRepository,
      useClass: PrismaInvestmentRepository,
    },
  ],
})
export class InvestmentModule {}
