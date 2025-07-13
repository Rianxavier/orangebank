import { IsString, IsUUID, IsInt, Min } from 'class-validator';

export class BuyStockDTO {
  @IsUUID()
  accountId: string;

  @IsString()
  symbol: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
