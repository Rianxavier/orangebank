import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repositories/UserRepository';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { LoginDTO } from '../dtos/LoginDTO';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: LoginDTO) {
    const user = await this.userRepository.findByEmail(data.email);

    // Verificando se usuario existe
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await compare(data.password, user.password);

    // Verificando se a senha é válida
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
      cpf: user.cpf,
    });

    return { token };
  }
}
