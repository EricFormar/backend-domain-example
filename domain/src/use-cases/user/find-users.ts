import { User } from "src/entities/User";
import { createNotFoundError, NotFoundError } from "../../errors/error";
import { UserRepository } from "../../repositories/user-repository";

export interface FindUsersDependencies {
  userRepository: UserRepository;
}

export async function findUsers(
  { userRepository }: FindUsersDependencies,
): Promise<Partial<User>[] > {
  const users = await userRepository.findAll();
  return users;
}
