import { User } from "../../entities/User";
import { BadRequestError, createBadRequestError, createNotFoundError, NotFoundError } from "../../errors/error";
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
): Promise<Partial<User> | NotFoundError | BadRequestError > {
  if(!id) throw createBadRequestError("ID required")
  const user = await userRepository.findById(id);
  if (!user) throw createNotFoundError("User not found");
  return user;
}
