import { User } from "../entities/User";

export interface UsersRepository {
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
}