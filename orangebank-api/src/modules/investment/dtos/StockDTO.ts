import { IsInt, IsPositive, IsString, IsUUID } from 'class-validator';

export class StockDTO {
  @IsUUID()
  accountId: string;

  @IsString()
  symbol: string;

  @IsInt()
  @IsPositive({ message: 'Quantity must be a positive integer' })
  quantity: number;
}
