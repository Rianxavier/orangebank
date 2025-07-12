import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountUseCase } from '../useCases/CreateAccountUseCase';
import { CreateAccountDTO } from '../dtos/CreateAccountDTO';

@Controller('accounts')
export class AccountController {
  constructor(private readonly createAccount: CreateAccountUseCase) {}

  @Post()
  async create(@Body() body: CreateAccountDTO) {
    return this.createAccount.execute(body);
  }
}
