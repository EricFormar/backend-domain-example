import { User } from "../entities/User";
import { UserRepository } from "../repositories/user-repository";

export interface MockedUsersRepository extends UserRepository {
    users: User[];
}

export function mockUsersRepository(users: User[] = []): MockedUsersRepository {
    return {
        users,
        findByEmail: async (email: string): Promise<User | null> => {
            const user = users.find(user => user.email === email);
            const result = user ? { ...user } : null; 
            return result;
        },
        save: async (user: User): Promise<void> => {
            const existingUserIndex = users.findIndex(u => u.email === user.email);
            if (existingUserIndex !== -1) {
                users[existingUserIndex] = { ...user };
            } else {
                users.push({ ...user });
            }
        }
    };
}