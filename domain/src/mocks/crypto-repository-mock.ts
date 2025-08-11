import { CryptoRepository } from "../repositories/crypto-repository";
import {User} from '../entities/User';
import { ms } from "../utils/ms";

export function createCryptoRepositoryMock() : CryptoRepository {
    return {
        async hashPassword(password: string) : Promise<string>{
            await ms(100)
            return "[HASHED]" + password
        },
        async comparePassword(password: string, hashedPassword: string) : Promise<boolean> {
            return "[HASHED]" + password === hashedPassword
        },
        async generateJWT(user: User) : Promise<string>{
            return "JWT" + JSON.stringify({
                id : user.id,
                name : user.name,
                surname : user.surname,
                email : user.email,
                role : user.role
            })
        },
        async validateToken(token: string) : Promise<User> {
            return JSON.parse(token.slice(3))
        },
        generateRandomToken(): string {
            return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        },
    }
}