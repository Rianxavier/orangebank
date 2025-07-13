import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class FixedIncomeDTO {
  @IsUUID()
  accountId: string;

  @IsString()
  fixedIncomeId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
