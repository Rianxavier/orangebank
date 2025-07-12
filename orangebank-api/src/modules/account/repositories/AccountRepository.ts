import { Account } from '@prisma/client';
import { CreateAccountDTO } from '../dtos/CreateAccountDTO';

export abstract class AccountRepository {
  abstract create(account: CreateAccountDTO): Promise<Account>;
  abstract findByUserId(userId: string): Promise<Account[]>;
}
