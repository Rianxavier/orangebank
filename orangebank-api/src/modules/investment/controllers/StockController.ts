import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { BuyStockUseCase } from '../useCases/BuyStockUseCase';
import { BuyStockDTO } from '../dtos/BuyStockDTO';
import { GetUserStocksUseCase } from '../useCases/GetUserStocksUseCase';

@Controller('stocks')
export class StockController {
  constructor(
    private readonly buyStockUseCase: BuyStockUseCase,
    private readonly getUserStocksUseCase: GetUserStocksUseCase,
  ) {}

  @Post('buy')
  async buy(@Body() body: BuyStockDTO, @Request() req) {
    const userId: string = req.user.sub;

    const result = await this.buyStockUseCase.execute(userId, body);

    return result;
  }

  @Get('buy')
  async getUserStocks(@Request() req) {
    const userId: string = req.user.sub;

    return this.getUserStocksUseCase.execute(userId);
  }
}
