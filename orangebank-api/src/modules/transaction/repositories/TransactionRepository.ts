import { Account } from '@prisma/client';
import { CreateDepositDTO } from '../dtos/CreateDepositDTO';

export abstract class TransactionRepository {
  abstract createDeposit(data: CreateDepositDTO): Promise<Account>;
}
