import { beforeAll, describe, expect, test } from "vitest";
import { createUserRepositoryMock, MockedUserRepository } from "../../mocks/user-repository-mock";
import { createUserMock } from "../../mocks/user-mock";
import { createUnauthorizedError } from "../../errors/error";
import { createCryptoRepositoryMock } from "../../mocks/crypto-repository-mock";
import { login, UserLoginDependencies, UserLoginResponseModel } from "./user-login";

describe("Login & auth user", () => {
    const _mockedUserRepository: MockedUserRepository = createUserRepositoryMock([
        createUserMock({
            id: "stored-id",
            name: "stored-name",
            email: "stored@email.com",
            password: "[HASHED]stored-password",
            role: "user"
        })
    ]);

    let _dependencies: UserLoginDependencies;

    beforeAll(async () => {
        _dependencies = {
            userRepository: _mockedUserRepository,
            cryptoRepository: createCryptoRepositoryMock(),
        }
    });

    test("With a valid email not stored, fails with error 'INVALID_CREDENTIALS'", async () => {
        await expect(login(
            _dependencies,
            {
                email: "non-existent@email.com",
                password: "any password",
            }
        )).rejects.toThrow(createUnauthorizedError("Invalid credentials"));
    });

    test("With an existent email and an invalid password, fails with error 'INVALID_CREDENTIALS'", async () => {
        await expect(login(
            _dependencies,
            {
                email: "stored@email.com",
                password: "invalid password",
            }
        )).rejects.toThrow(createUnauthorizedError("Invalid credentials"));
    });

    test("With valid data, returns a valid token", async () => {
        const result = await login(
            _dependencies,
            {
                email: "stored@email.com",
                password: "stored-password",
            }
        );
        expect(result).toHaveProperty('token');
        const JWT = await _dependencies.cryptoRepository.generateJWT(_mockedUserRepository.users[0]);
        expect((result as UserLoginResponseModel).token).toStrictEqual(JWT);
        expect(_dependencies.cryptoRepository.validateToken((result as UserLoginResponseModel).token)).toStrictEqual(
            _dependencies.cryptoRepository.validateToken(JWT)
        );
    });
});
