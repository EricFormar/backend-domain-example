import { User } from "../entities/User";

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
    /* getAll() : Promise<User[]>;
    getById(id: string) : Promise<User | null>;
    getByEmail(email : string) : Promise<User | null>;
    register(user: User) : Promise<User>, */
}