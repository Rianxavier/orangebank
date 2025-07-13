import { IsUUID, IsString, IsNumber, Min } from 'class-validator';

export class BuyFixedIncomeDTO {
  @IsUUID()
  accountId: string;

  @IsString()
  assetId: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
