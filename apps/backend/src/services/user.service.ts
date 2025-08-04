import { User } from "@project-example/domain/entities/User";
import UserModel from "../database/models/user";

import { UserRepository } from "@project-example/domain/repositories/user-repository";
import { createNotFoundError } from "@project-example/domain/errors/error";

export function userService(): UserRepository {
    const _mapToUserResponseDto = (user: UserModel): Partial<User> => {
        return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
        };
    };
    return {
        findByEmail: async function (email: string) {
            const user = await UserModel.findOne({
                where: { email }
            });
            if (!user)
                throw createNotFoundError(
                    "No existe un usuario con el email " + email
                );
            return _mapToUserResponseDto(user);
        },
        findById: async function (id: string) {
            const user = await UserModel.findByPk(id);
            if (!user)
                throw createNotFoundError(
                    "No existe un usuario con el ID " + id
                );
            return _mapToUserResponseDto(user);
        },
        create: async function (user: Omit<User, "id">) {
            const newUser = await UserModel.create(user);
            return _mapToUserResponseDto(newUser);
        },
        update: async function (user: User) {
            const userToUpdate = await UserModel.findByPk(user.id);
            if (!userToUpdate)
                throw createNotFoundError(
                    "No existe un usuario con el ID " + user.id
                );
            userToUpdate.update(user);
            const userUpdated = await userToUpdate.save();
            return _mapToUserResponseDto(userUpdated);
        },
        delete: async function (id: string) {
            const userToDelete = await UserModel.findByPk(id);
            if (!userToDelete) {
                throw createNotFoundError(
                    "No existe un usuario con el ID " + id
                );
            }
            await userToDelete.destroy();
            return true;
        },
    }
}