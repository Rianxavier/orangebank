import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { LoginUseCase } from './useCases/LoginUseCase';
import { AuthController } from './controllers/AuthController';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    InfraModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [LoginUseCase],
})
export class AuthModule {}
