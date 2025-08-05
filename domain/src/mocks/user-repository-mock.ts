import { User } from "../entities/User";
import { UserRepository } from "../repositories/user-repository";

export interface MockedUserRepository extends UserRepository {
  users: User[];
}

export function createUserRepositoryMock(users: User[] = []): MockedUserRepository {
  return {
    users,
    findAll: async function () {
      return this.users;
    },
    findByEmail: async function (email: string): Promise<User | null> {
      const user = this.users.find(u => u.email === email);
      const result = user ? { ...user } : null;
      return result;
    },
    findById : async function (id: string): Promise<User | null> {
      return this.users.find((u) => u.id === id) || null;
    },
    create: async function (user: Omit<User, "id">): Promise<User> {
      //TODO: validar el ROLE
      const newUser = {
        ...user,
        id: "any-id",
      };
      this.users.push(newUser);
      return newUser;
    },
    async update(user: User): Promise<Partial<User>> {
       const index = this.users.findIndex((p) => p.id === user.id);
      if (index !== -1) {
        this.users[index] = user;
      }
      return this.users[index]
    },
    async delete(id: string): Promise<void> {
       const index = this.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        this.users.splice(index, 1);
      }
    },
  };
}
