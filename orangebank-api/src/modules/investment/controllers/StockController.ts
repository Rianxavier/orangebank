import { Body, Controller, Post, Request } from '@nestjs/common';
import { BuyStockUseCase } from '../useCases/BuyStockUseCase';
import { BuyStockDTO } from '../dtos/BuyStockDTO';

@Controller('stocks')
export class StockController {
  constructor(private readonly buyStockUseCase: BuyStockUseCase) {}

  @Post('buy')
  async buy(@Body() body: BuyStockDTO, @Request() req) {
    const userId: string = req.user.sub;

    const result = await this.buyStockUseCase.execute(userId, body);

    return result;
  }
}
