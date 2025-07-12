import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AccountModule,
    AuthModule,
  ],
})
export class AppModule {}
