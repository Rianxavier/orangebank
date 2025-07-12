import { Controller, Post, Body } from '@nestjs/common';
import { LoginDTO } from '../dtos/LoginDTO';
import { LoginUseCase } from '../useCases/LoginUseCase';
import { Public } from 'src/shared/decorators/isPublic';

@Controller('login')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Public()
  @Post()
  async login(@Body() body: LoginDTO) {
    return this.loginUseCase.execute(body);
  }
}
