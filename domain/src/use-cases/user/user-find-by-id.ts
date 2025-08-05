import { User } from "../../entities/User";
import { createNotFoundError, NotFoundError } from "../../errors/error";
import { UserRepository } from "../../repositories/user-repository";

export interface UserFindByIdDependencies {
  userRepository: UserRepository;
}

export interface UserFindByIdRequestModel {
  id: string;
}

export async function findUserById(
  { userRepository }: UserFindByIdDependencies,
  { id }: UserFindByIdRequestModel
): Promise<Partial<User> | NotFoundError > {
  const user = await userRepository.findById(id);
  if (!user) throw createNotFoundError("User not found");
  return user;
}
