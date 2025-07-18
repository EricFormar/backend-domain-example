import {describe, test, expect, Mock, beforeAll, beforeEach} from 'vitest';
import {User, UserRole} from "../entities/User";
import { UserRegister, UserRegisterDependencies, UserRegisterRequestModel } from './user-register';
import { createInvalidDataError } from '../errors/error';
import { MockedUsersRepository, mockUsersRepository } from '../mocks/user-repository-mock';

describe("UserRegister Use Case", async () => {
    const _mockedUserRepository : MockedUsersRepository = mockUsersRepository([]);


    const existingUser: User = {
        id : "existing user id",
        password: "12345678",
        email: "existing@user.com",
        username: "Existing User",
        role: "user" as UserRole
    }
    let _dependencies : UserRegisterDependencies;

    beforeEach(()=>{
        _dependencies = {
            users: _mockedUserRepository
        };
        _dependencies.users.save(existingUser);
    })

    test("With an email already in use, fails with InvalidData", async () => {
        const payload: UserRegisterRequestModel = {
            email:"existing@user.com",
            password:"12345678",
            username:"Test User",
        }

        const result = await UserRegister(_dependencies, payload);

        expect(result).toEqual(createInvalidDataError("Email already in use"));
    });

    test("With an empty email, fails with InvalidData", async () => {
        const payload : UserRegisterRequestModel = {
            email:"",
            password:"12345678",
            username:"Test User",
        };
        const result = await UserRegister(_dependencies, payload);

        expect(result).toEqual(createInvalidDataError("Email must be not empty"));
    })

    test("With an empty password, fails with InvalidData", async () => {
        const payload : UserRegisterRequestModel = {
            email:"valid@email.com",
            password:"",
            username:"Test User",
        };
        const result = await UserRegister(_dependencies, payload);

        expect(result).toEqual(createInvalidDataError("Password must be not empty"));
    })

    test("With an empty username, fails with InvalidData", async () => {
        const payload : UserRegisterRequestModel = {
            email:"valid@email.com",
            password:"12345678",
            username:"",
        };
        const result = await UserRegister(_dependencies, payload);

        expect(result).toEqual(createInvalidDataError("Username must be not empty"));
    });

    test("With valid data, registers the user successfully", async () => {
        const payload : UserRegisterRequestModel = {
            email:"valid@email.com",
            password:"12345678",
            username:"User Test",
        };

        const result = await UserRegister(_dependencies, payload);

        const user = await _mockedUserRepository.findByEmail(payload.email)
        expect(user).not.toBeNull();
        expect(result).toEqual(undefined);


        
    });
});
