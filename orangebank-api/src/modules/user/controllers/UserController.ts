import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { CreateUserUseCase } from '../useCases/CreateUserUseCase';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    const user = await this.createUserUseCase.execute(body);
    return user;
  }
}
