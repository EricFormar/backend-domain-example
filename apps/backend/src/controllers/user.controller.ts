import { AppError, createInternalServerError } from "@project-example/domain/errors/error";
import { Request, Response } from "express";

export function userController() {
    return {
        // Register new user
        registerNewUser: async (req: Request, res: Response) => {
            try {

                return res.status(200).json({
                    ok: true,
                    message: "Usuario registrado con éxito"
                });
            } catch (e) {
                const error =
                    e instanceof AppError
                        ? e
                        : createInternalServerError(
                            "Ups, hubo un error al registrar el usuario"
                        );
                return res.status(error.httpStatus).json({
                    ok: false,
                    message: error.message,
                });
            }
        },
        // Get user data
        getUserProfile: async (req: Request, res: Response) => {
            try {

                return res.status(200).json({
                    ok: true,
                    data: null,
                    message: "Perfil de usuario"
                });
            } catch (e) {
                const error =
                    e instanceof AppError
                        ? e
                        : createInternalServerError(
                            "Ups, hubo un error al obtener el perfil de usuario"
                        );
                return res.status(error.httpStatus).json({
                    ok: false,
                    message: error.message,
                });
            }
        },
        // Update user
        updateUser: async (req: Request, res: Response) => {
            try {
            
        
                return res.status(200).json({
                    ok: true,
                    data: null,
                    message: "Usuario actualizado con éxito"
                });
            } catch (e) {
                console.log(e);

                const error =
                    e instanceof AppError
                        ? e
                        : createInternalServerError(
                            "Ups, hubo un error al actualizar el usuario"
                        );
                return res.status(error.httpStatus).json({
                    ok: false,
                    message: error.message,
                });
            }
        },
        // Delete user
        deleteUser: async (req: Request, res: Response) => {
            try {
                return res.status(200).json({
                    ok: true,
                    message: "Usuario eliminado con éxito"
                });
            } catch (e) {
                const error =
                    createInternalServerError(
                        "Ups, hubo un error al eliminar el usuario"
                    ) || e;
                return res.status(error.httpStatus).json({
                    ok: false,
                    message: error.message,
                });
            }
        },
    };
}
