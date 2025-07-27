import { User } from "../../entities/User";
import { createNotFoundError, NotFoundError } from "../../errors/error";
import { UserRepository } from "../../repositories/user-repository";

export interface UserUpdateDependencies {
  userRepository: UserRepository;
}

export interface UserUpdateRequestModel {
  userToUpdate: User;
}

export async function updateUser(
  { userRepository }: UserUpdateDependencies,
  { userToUpdate }: UserUpdateRequestModel
): Promise<User | NotFoundError> {
  const user = await userRepository.findById(userToUpdate.id);
  if (!user) return createNotFoundError("User not found");
  const updatedBrand = await userRepository.update(userToUpdate);

  return updatedBrand;
}
