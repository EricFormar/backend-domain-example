import { User } from "../../entities/User";
import { createInvalidDataError, InvalidDataError } from "../../errors/error";
import { UserRepository } from "../../repositories/user-repository";

export type UserCreateRequestModel = Omit<
  User,
  "id"
>;
export interface UserCreateDependencies {
  userRepository: UserRepository;
}

export async function userCreate(
  { userRepository }: UserCreateDependencies,
  { email, password, name }: UserCreateRequestModel
): Promise<InvalidDataError | User> {
  const hasErrors = validateData(email, password, name);
  if (hasErrors) return hasErrors;
  const existingUser = await userRepository.findByEmail(email);  
  if (existingUser) return createInvalidDataError("Email already in use");

  const user: User = {
    id: crypto.randomUUID(),
    email,
    password,
    name,
    role: "user",
  };

  return await userRepository.create(user);
}

function validateData(
  email: string,
  password: string,
  name: string
): InvalidDataError | void {
  if (email.trim() === "") {
    return createInvalidDataError("Email must be not empty");
  }
  if (password.trim() === "") {
    return createInvalidDataError("Password must be not empty");
  }
  if (name.trim() === "") {
    return createInvalidDataError("Name must be not empty");
  }
}
