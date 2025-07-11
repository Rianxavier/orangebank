import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '@prisma/client';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    // Validando CPF
    if (!cpfValidator.isValid(data.cpf))
      throw new BadRequestException('Invalid CPF');

    // Verificando se já existe o email cadastrado
    const existEmailUser = await this.userRepository.findByEmail(data.email);
    if (existEmailUser) throw new ConflictException('Email already registered');

    // Verificando se já existe o CPF cadastrado
    const existCpfUser = await this.userRepository.findByEmail(data.email);
    if (existCpfUser) throw new ConflictException('CPF already registered');

    return this.userRepository.create(data);
  }
}
