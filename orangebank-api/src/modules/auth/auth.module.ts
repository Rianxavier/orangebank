import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { InfraModule } from 'src/infra/infra.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/AuthController';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginUseCase } from './useCases/LoginUseCase';

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
  providers: [JwtStrategy, LoginUseCase],
})
export class AuthModule {}
