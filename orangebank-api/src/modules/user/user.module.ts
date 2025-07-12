import { Module } from '@nestjs/common';
import { UserController } from './controllers/UserController';
import { PrismaUserRepository } from './repositories/PrismaUserRepository';
import { CreateUserUseCase } from './useCases/CreateUserUseCase';
import { InfraModule } from 'src/infra/infra.module';
import { UserRepository } from './repositories/UserRepository';

@Module({
  imports: [InfraModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserModule {}
