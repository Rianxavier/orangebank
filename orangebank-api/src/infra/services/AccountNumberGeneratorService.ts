import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/PrismaService';

@Injectable()
export class AccountNumberGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(): Promise<number> {
    let unique = false;
    let accountNumber = 0;

    while (!unique) {
      accountNumber = Math.floor(100000 + Math.random() * 900000);
      const exists = await this.prisma.account.findUnique({
        where: { accountNumber },
      });
      unique = !exists;
    }

    return accountNumber;
  }
}
