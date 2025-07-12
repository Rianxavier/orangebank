import { Account } from '@prisma/client';
import { CreateAccountWithNumberDTO } from '../dtos/CreateAccountWithNumberDTO';

export abstract class AccountRepository {
  abstract create(account: CreateAccountWithNumberDTO): Promise<Account>;
  abstract findByUserId(userId: string): Promise<Account[]>;
}
