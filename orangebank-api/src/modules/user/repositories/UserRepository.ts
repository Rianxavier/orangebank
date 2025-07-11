import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { User } from '../entities/UserEntity';

export abstract class UserRepository {
  abstract create(user: CreateUserDTO): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByCpf(cpf: string): Promise<User | null>;
}
