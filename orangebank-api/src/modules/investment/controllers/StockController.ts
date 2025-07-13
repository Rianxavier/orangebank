import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { BuyStockUseCase } from '../useCases/BuyStockUseCase';
import { GetUserStocksUseCase } from '../useCases/GetUserStocksUseCase';
import { StockDTO } from '../dtos/StockDTO';
import { SellStockUseCase } from '../useCases/SellStockUseCase';

@Controller('stocks')
export class StockController {
  constructor(
    private readonly buyStockUseCase: BuyStockUseCase,
    private readonly getUserStocksUseCase: GetUserStocksUseCase,
    private readonly sellStockUseCase: SellStockUseCase,
  ) {}

  @Post('buy')
  async buy(@Body() body: StockDTO, @Request() req) {
    const userId: string = req.user.sub;

    return await this.buyStockUseCase.execute(userId, body);
  }

  @Get('buy')
  async getUserStocks(@Request() req) {
    const userId: string = req.user.sub;

    return this.getUserStocksUseCase.execute(userId);
  }

  @Post('sell')
  async sell(@Body() body: StockDTO, @Request() req) {
    const userId: string = req.user.sub;

    return await this.sellStockUseCase.execute(userId, body);
  }
}
