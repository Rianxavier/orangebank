import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/PrismaService';
import { CreateAccountWithNumberDTO } from '../dtos/CreateAccountWithNumberDTO';
import { AccountRepository } from './AccountRepository';

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private prisma: PrismaService) {}

  create(account: CreateAccountWithNumberDTO): Promise<Account> {
    return this.prisma.account.create({ data: account });
  }
  findByUserId(userId: string): Promise<Account[]> {
    return this.prisma.account.findMany({ where: { userId } });
  }
}
