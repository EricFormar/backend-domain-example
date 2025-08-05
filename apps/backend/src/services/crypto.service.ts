import { CryptoRepository, User } from "@project-example/domain";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'key_secret';
const SALT_ROUNDS = 10;

export function cryptoService(): CryptoRepository {
  return {
    hashPassword : async function(password: string) {
      return bcrypt.hash(password, SALT_ROUNDS);
    },
    comparePassword: async function(password: string, hashedPassword: string) {
      return bcrypt.compare(password, hashedPassword);
    },
    generateJWT: async function(user: User) {
      const payload = {
              id : user.id,
                name : user.name,
                surname : user.surname,
                email : user.email,
                role : user.role
        };
          return new Promise((resolve, reject) => {
            jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    return reject(err);
                }
                resolve(token as string);
            });
        });
    },
    validateToken: async function(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                const decodedUser = decoded as User;
                resolve(decodedUser);
            });
        });
    }
  }
}
