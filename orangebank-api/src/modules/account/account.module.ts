import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { AccountController } from './controllers/AccountController';
import { AccountRepository } from './repositories/AccountRepository';
import { PrismaAccountRepository } from './repositories/PrismaAccountRepository';
import { CreateAccountUseCase } from './useCases/CreateAccountUseCase';
import { UserModule } from '../user/user.module';

@Module({
  imports: [InfraModule, UserModule],
  controllers: [AccountController],
  providers: [
    CreateAccountUseCase,
    {
      provide: AccountRepository,
      useClass: PrismaAccountRepository,
    },
  ],
})
export class AccountModule {}
