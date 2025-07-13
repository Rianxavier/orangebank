import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateTransferDTO {
  @IsUUID()
  sourceAccountId: string;

  @IsNumber({}, { message: 'accountNumber must be a number' })
  @Min(100000, { message: 'accountNumber must be at least 6 digits' })
  accountNumber: number;

  @IsNumber()
  @Min(0.01)
  amount: number;
}
