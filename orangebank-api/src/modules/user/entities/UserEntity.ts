import { Account } from 'src/modules/account/entities/AccountEntity';

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public cpf: string,
    public birthDate: Date,
    public accounts?: Account[],
  ) {}
}
