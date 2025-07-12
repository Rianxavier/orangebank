import { PrismaService } from 'src/infra/prisma/PrismaService';
import { AccountRepository } from './AccountRepository';
import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { CreateAccountDTO } from '../dtos/CreateAccountDTO';

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private prisma: PrismaService) {}

  create(account: CreateAccountDTO): Promise<Account> {
    return this.prisma.account.create({ data: account });
  }
  findByUserId(userId: string): Promise<Account[]> {
    return this.prisma.account.findMany({ where: { userId } });
  }
}
