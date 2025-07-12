import { AccountType } from '@prisma/client';

export interface CreateAccountWithNumberDTO {
  userId: string;
  type: AccountType;
  accountNumber: number;
}
