import { IsPositive, IsUUID } from 'class-validator';

export class CreateDepositDTO {
  @IsUUID()
  accountId: string;

  @IsPositive()
  amount: number;
}
