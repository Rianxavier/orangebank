import { Body, Controller, Post, Request } from '@nestjs/common';
import { FixedIncomeDTO } from '../dtos/FixedIncomeDTO';
import { BuyFixedIncomeUseCase } from '../useCases/BuyFixedImcomeUseCase';

@Controller('fixed-income')
export class FixedIncomeController {
  constructor(private readonly buyFixerIncomeUseCase: BuyFixedIncomeUseCase) {}

  @Post('buy')
  async buy(@Body() body: FixedIncomeDTO, @Request() req) {
    const userId: string = req.user.sub;

    return await this.buyFixerIncomeUseCase.execute(userId, body);
  }
}
