import { User, UserRole } from "@domain/entities/User";
import UserModel from "../database/models/user";
import RoleModel from "../database/models/rol";

import { UserRepository } from "@domain/repositories/user-repository";
import { createBadRequestError, createNotFoundError } from "@domain/errors/error";

export function userService(): UserRepository {
    const _mapToUserResponseDto = (user: UserModel): Partial<User> => {
        
        return {
            id: user.id.toString(),
            name: user.name,
            surname : user.surname,
            email: user.email,
            role : user.role?.name as UserRole
        };
    };
    return {
        findAll : async function() {
            const users = await UserModel.findAll({
                include : ['role']
            });
            return users.map(_mapToUserResponseDto);
        },
        findByEmail: async function (email: string) {
            const user = await UserModel.findOne({
                where: { email },
                include : ['role']
            });

            return user ? {
                id : user.id.toString(),
                name : user.name,
                surname : user.surname,
                email : user.email,
                role : user.role.name as UserRole,
                password : user.password,
                validated : user.validated,
                locked : user.locked,
            } : null ;
        },
        findById: async function (id: string) {
            if(!id) throw createBadRequestError("El ID del usuario es requerido")
            const user = await UserModel.findByPk(id,{
                include : ['role']
            });
            if (!user)
                throw createNotFoundError(
                    "No existe un usuario con el ID " + id
                );
            return _mapToUserResponseDto(user);
        },
        create: async function (user: Pick<User, "name" | "surname" | "email" | "password" | "role">) {
            
            const role = await RoleModel.findOne({
                where : {
                    name : user.role
                }
            });
            const dataUser = {
                ...user,
                rolId : role?.id as number,
            }            
            const newUser = await UserModel.create(dataUser);
            
            return _mapToUserResponseDto(await newUser.reload({
                include : ['role']
            }));
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
        },
    }
}