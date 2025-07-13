import { IsInt, IsPositive, IsString, IsUUID } from 'class-validator';

export class BuyStockDTO {
  @IsUUID()
  accountId: string;

  @IsString()
  symbol: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}
