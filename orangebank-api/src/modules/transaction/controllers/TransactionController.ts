import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateDepositDTO } from '../dtos/CreateDepositDTO';
import { CreateDepositUseCase } from '../UseCases/CreateDepositUseCase';
import { CreateTransferDTO } from '../dtos/CreateTransferDTO';
import { CreateTransferUseCase } from '../UseCases/CreateTransferUseCase';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly depositUseCase: CreateDepositUseCase,
    private readonly transferUseCase: CreateTransferUseCase,
  ) {}

  @Post('deposit')
  async deposit(@Req() req, @Body() body: CreateDepositDTO) {
    const userId: string = req.user.sub;
    return this.depositUseCase.execute(userId, body);
  }

  @Post('transfer')
  async transfer(@Req() req, @Body() body: CreateTransferDTO) {
    const userId: string = req.user.sub;
    return this.transferUseCase.execute(userId, body);
  }
}
