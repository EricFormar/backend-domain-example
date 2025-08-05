import { User } from "../entities/User";

export function createUserMock(opts: Partial<User>) : User {
    return {
        id: 'id-any',
        name: 'any-name',
        surname : 'any-surname',
        email : 'any-email',
        password :'any-password',
        image : 'any-image',
        validated : false,
        locked : false,
        role: 'user',
        ...opts
    }
}