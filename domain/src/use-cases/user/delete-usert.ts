import { createNotFoundError, NotFoundError } from "../../errors/error";
import { UserRepository } from "../../repositories/user-repository";

export interface DeleteUserDependencies {
  userRepository: UserRepository;
}

export interface DeleteUserRequestModel {
  id: string;
}

export async function deleteUser(
  { userRepository }: DeleteUserDependencies,
  { id }: DeleteUserRequestModel
): Promise<Boolean | NotFoundError > {
  const result = await userRepository.delete(id);
  if (!result) return createNotFoundError("User not found");
  return result;
}
