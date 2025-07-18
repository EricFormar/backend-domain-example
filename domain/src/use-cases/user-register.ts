import { User, UserRole } from "../entities/User";
import { createInvalidDataError, InvalidDataError } from "../errors/error";
import { UsersRepository } from "../repositories/user-repository";

export type UserRegisterRequestModel = Omit<User, 'id' | 'role'>;

export interface UserRegisterDependencies{
    users: UsersRepository;
}

export async function  UserRegister(
    { users } : UserRegisterDependencies,
    { email, password, username }: UserRegisterRequestModel) :
    Promise < InvalidDataError | void > {

    const hasErrors = validateData(email, password, username);
    if (hasErrors) return hasErrors;

    const existingUser = await users.findByEmail(email);
    if (existingUser) return createInvalidDataError("Email already in use");

    const user : User = {
        id: crypto.randomUUID(),
        email,
        password,
        username,
        role: "user"
    }

    users.save(user);
}

function validateData(email: string, password: string, username: string): InvalidDataError | void {
    if (email.trim() === "") {
        return createInvalidDataError("Email must be not empty");
    }
    if (password.trim() === "") {
        return createInvalidDataError("Password must be not empty");
    }
    if (username.trim() === "") {
        return createInvalidDataError("Username must be not empty");
    }
}