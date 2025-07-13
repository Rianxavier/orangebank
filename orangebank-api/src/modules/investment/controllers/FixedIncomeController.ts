import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { FixedIncomeDTO } from '../dtos/FixedIncomeDTO';
import { BuyFixedIncomeUseCase } from '../useCases/BuyFixedIncomeUseCase';
import { GetUserFixedIncomesUseCase } from '../useCases/GetUserFixedIncomeUseCase';

@Controller('fixed-income')
export class FixedIncomeController {
  constructor(
    private readonly buyFixedIncomeUseCase: BuyFixedIncomeUseCase,
    private readonly getUserFixedIncomesUseCase: GetUserFixedIncomesUseCase,
  ) {}

  @Post('buy')
  async buy(@Body() body: FixedIncomeDTO, @Request() req) {
    const userId: string = req.user.sub;

    return await this.buyFixedIncomeUseCase.execute(userId, body);
  }

  @Get('buy')
  async getUserFixedIncome(@Request() req) {
    const userId: string = req.user.sub;

    return this.getUserFixedIncomesUseCase.execute(userId);
  }
}
