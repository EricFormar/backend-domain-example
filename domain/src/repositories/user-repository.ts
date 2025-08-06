import { User } from "../entities/User";

export interface UserRepository {
    findAll() : Promise<Partial<User>[]>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<Partial<User> | null>;
    create(user: Pick<User, "name" | "surname" | "email" | "password" | "role">): Promise<Partial<User>>;
    update(user: Partial<User>): Promise<Partial<User>>;
    delete(id: string): Promise<void>;
    // findByVerificationToken(token: string): Promise<User | null>;
    // updateVerificationToken(id: string, token: string): Promise<void>;
    // findByResetPasswordToken(token: string): Promise<User | null>;
}