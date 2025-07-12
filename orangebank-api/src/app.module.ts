import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UserModule, AccountModule, AuthModule],
})
export class AppModule {}
