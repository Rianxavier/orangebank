import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { StockController } from './controllers/StockController';
import { BuyStockUseCase } from './useCases/BuyStockUseCase';
import { InvestmentRepository } from './repositories/InvestmentRepository';
import { PrismaInvestmentRepository } from './repositories/PrismaInvestmentRepository';
import { GetUserStocksUseCase } from './useCases/GetUserStocksUseCase';
import { SellStockUseCase } from './useCases/SellStockUseCase';
import { BuyFixedIncomeUseCase } from './useCases/BuyFixedIncomeUseCase';
import { FixedIncomeController } from './controllers/FixedIncomeController';
import { GetUserFixedIncomesUseCase } from './useCases/GetUserFixedIncomeUseCase';

@Module({
  controllers: [StockController, FixedIncomeController],
  providers: [
    PrismaService,
    BuyStockUseCase,
    GetUserStocksUseCase,
    SellStockUseCase,
    BuyFixedIncomeUseCase,
    GetUserFixedIncomesUseCase,
    {
      provide: InvestmentRepository,
      useClass: PrismaInvestmentRepository,
    },
  ],
})
export class InvestmentModule {}
