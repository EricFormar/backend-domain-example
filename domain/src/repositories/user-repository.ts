import { User } from "../entities/User";

export interface UserRepository {
    findByEmail(email: string): Promise<Partial<User> | null>;
    findById(id: string): Promise<Partial<User> | null>;
    create(user: User): Promise<Partial<User>>;
    update(user: User): Promise<Partial<User>>;
    delete(id: string): Promise<boolean>;
}