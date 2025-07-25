import { ms } from "../../utils/ms";
import { CryptoRepository } from "../repositories/crypto-repository";
import {User} from '../entities/User';

export function createCryptoServiceMock() : CryptoRepository {
    return {
        async generateNewID() : Promise<string>{
            await ms(100)
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                function (c) {
                    const r = (Math.random() * 16) | 0,
                        v = c === "x" ? r : (r & 0x3) | 0x8;
                    return v.toString(16);
                },
            ); 
        },
        async hastPassword(password: string) : Promise<string>{
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