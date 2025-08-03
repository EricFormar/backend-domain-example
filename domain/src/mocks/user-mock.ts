import { User } from "../entities/User";

export function createUserMock(opts: Partial<User>) : User {
    return {
        id: 'id-any',
        name: 'any name',
        email : 'any-email',
        password :'any-password',
        ...opts
    }
}