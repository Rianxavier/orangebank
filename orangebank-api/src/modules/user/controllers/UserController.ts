import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { CreateUserUseCase } from '../useCases/CreateUserUseCase';
import { UserRepository } from '../repositories/UserRepository';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly userRepository: UserRepository,
  ) {}

  @Get()
  async findAll() {
    return this.userRepository.findAll();
  }

  @Post()
  async create(@Body() body: CreateUserDTO) {
    const user = await this.createUserUseCase.execute(body);
    return user;
  }
}
