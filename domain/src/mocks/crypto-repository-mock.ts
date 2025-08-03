import { CryptoRepository } from "../repositories/crypto-repository";
import {User} from '../entities/User';
import { ms } from "../utils/ms";

export function createCryptoServiceMock() : CryptoRepository {
    return {
        async hashPassword(password: string) : Promise<string>{
            await ms(100)
            return "[HASHED]" + password
        },
        async comparePassword(password: string, hashedPassword: string) : Promise<boolean> {
            return "[HASHED]" + password === hashedPassword
        },
        async generateJWT(user: User) : Promise<string>{
            return "JWT" + JSON.stringify(user)
        },
        async validateToken(token: string) : Promise<User> {
            return JSON.parse(token.slice(3))
        }
    }
}