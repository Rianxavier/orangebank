import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AccountModule } from './modules/account/account.module';

@Module({
  imports: [UserModule, AccountModule],
})
export class AppModule {}
