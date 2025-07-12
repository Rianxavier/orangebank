import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { User } from '../entities/UserEntity';

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>;
  abstract create(user: CreateUserDTO): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(userId: string): Promise<User | null>;
  abstract findByCpf(cpf: string): Promise<User | null>;
  abstract findByIdWithAccounts(cpf: string): Promise<User | null>;
}
