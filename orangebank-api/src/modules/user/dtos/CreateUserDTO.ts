import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(11, 14)
  cpf: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  createInvestmentAccount?: boolean;
}
