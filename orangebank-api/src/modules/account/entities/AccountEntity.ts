export class Account {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public type: 'CHECKING' | 'INVESTMENT',
    public balance: number,
  ) {}
}
