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
): Promise<void | NotFoundError > {
  const user = await userRepository.findById(id);
  if (!user) return createNotFoundError("User not found");
  await userRepository.delete(id);
  return
}
