import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateDepositDTO } from '../dtos/CreateDepositDTO';
import { CreateDepositUseCase } from '../UseCases/CreateDepositUseCase';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly depositUseCase: CreateDepositUseCase) {}

  @Post('deposit')
  async handle(@Req() req, @Body() body: CreateDepositDTO) {
    const userId: string = req.user.sub;
    return this.depositUseCase.execute(userId, body);
  }
}
