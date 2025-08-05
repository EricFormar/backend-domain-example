import { CryptoRepository } from "../../repositories/crypto-repository";
import { User } from "../../entities/User";
import { createInvalidDataError, InvalidDataError } from "../../errors/error";
import { UserRepository } from "../../repositories/user-repository";

export type UserCreateRequestModel = Omit<
  User,
  "id" | "locked" | "validated"
>;
export interface UserCreateDependencies {
  userRepository: UserRepository;
  cryptoRepository: CryptoRepository
}

export async function userCreate(
  { userRepository, cryptoRepository }: UserCreateDependencies,
  { email, password, name, surname, role, image }: UserCreateRequestModel
): Promise<Partial<User>| InvalidDataError> {
  const hasErrors = validateData(email, password, name);
  if (hasErrors) throw hasErrors;
  const existingUser = await userRepository.findByEmail(email); 

  if (existingUser) throw createInvalidDataError("Email already in use");

  const user: Omit<User, "id" | "validated" | "locked"> = {
    email,
    password : await cryptoRepository.hashPassword(password),
    name,
    surname,
    image,
    role,
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
