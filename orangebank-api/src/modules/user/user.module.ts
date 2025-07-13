import { Module } from '@nestjs/common';
import { UserController } from './controllers/UserController';
import { PrismaUserRepository } from './repositories/PrismaUserRepository';
import { CreateUserUseCase } from './useCases/CreateUserUseCase';
import { InfraModule } from 'src/infra/infra.module';
import { UserRepository } from './repositories/UserRepository';
import { AccountRepository } from '../account/repositories/AccountRepository';
import { PrismaAccountRepository } from '../account/repositories/PrismaAccountRepository';
import { GetUserInfoUseCase } from './useCases/GetUserInfoUseCase';

@Module({
  imports: [InfraModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetUserInfoUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: AccountRepository,
      useClass: PrismaAccountRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserModule {}
