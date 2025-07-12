import { AccountType } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class CreateAccountDTO {
  @IsUUID()
  userId: string;

  @IsEnum(AccountType)
  type: AccountType;
}
