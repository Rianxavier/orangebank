import { Injectable } from '@nestjs/common';
import { UserRepository } from './UserRepository';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { User } from '../entities/UserEntity';
import { PrismaService } from 'src/infra/prisma/PrismaService';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { accounts: true },
    });
  }

  async create(data: CreateUserDTO): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        birthDate: new Date(data.birthDate),
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });
  }

  async findById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { cpf } });
  }

  async findByIdWithAccounts(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { accounts: true },
    });
  }
}
