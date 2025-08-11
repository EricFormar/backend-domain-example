import { login } from "@domain/use-cases/user/user-login";
import { cryptoService } from "src/services/crypto.service";
import { userService } from "src/services/user.service";
import { Request, Response } from "express";
import { AppError, createInternalServerError } from "@domain/errors/error";

export function authController() {

    return {
        login: async (req: Request, res: Response) => {

            const { email, password } = req.body;
            try {
                const resp = await login({
                    userRepository: userService(),
                    cryptoRepository: cryptoService()
                }, {
                    email,
                    password
                });                
                return res.status(200).json({
                    ok: true,
                    data: {
                        token: resp instanceof Error ? '' : resp.token
                    },
                    message: "Inicio de sesión exitoso"
                });
            } catch (e) {
                const error =
                    e instanceof AppError
                        ? e
                        : createInternalServerError(
                            "Ups, hubo un error al iniciar sesión"
                        );                    
                return res.status(error.httpStatus).json({
                    ok: false,
                    message: error.message,
                });
            }
        }
    };
};
