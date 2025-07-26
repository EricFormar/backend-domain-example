import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/user-repository";

export class CreateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // Aquí podrías agregar lógica de negocio adicional antes de la creación
    const newUser: User = { ...userData };
    return this.userRepository.create(newUser);
  }
}