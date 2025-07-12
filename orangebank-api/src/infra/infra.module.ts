import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/PrismaService';
import { AccountNumberGeneratorService } from './services/AccountNumberGeneratorService';

@Global()
@Module({
  providers: [PrismaService, AccountNumberGeneratorService],
  exports: [PrismaService, AccountNumberGeneratorService],
})
export class InfraModule {}
