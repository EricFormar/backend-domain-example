import { beforeAll, describe, expect, test } from "vitest";
import {
  createUserRepositoryMock,
  MockedUserRepository,
} from "../../mocks/user-repository-mock";
import { createUserMock } from "../../mocks/user-mock";
import { createForbiddenError, createInvalidDataError } from "../../errors/error";
import { createCryptoServiceMock } from "../../mocks/crypto-repository-mock";
import {
  login,
  UserLoginDependencies,
  UserLoginResponseModel,
} from "./user-login";
import { UserRole } from "../../entities/User";

describe("User Role Verification", () => {
  const _mockedUserRepository: MockedUserRepository = createUserRepositoryMock([
    createUserMock({
      id: "admin-id",
      name: "admin-name",
      email: "admin@example.com",
      password: "[HASHED]admin-password",
      role: "admin" as UserRole,
    }),
    createUserMock({
      id: "user-id",
      name: "user-name",
      email: "user@example.com",
      password: "[HASHED]user-password",
      role: "user" as UserRole,
    }),
    createUserMock({
      id: "bocked-id",
      name: "bocked-name",
      email: "bocked@example.com",
      password: "[HASHED]bocked-password",
    }),
  ]);

  let _dependencies: UserLoginDependencies;

  beforeAll(async () => {
    _dependencies = {
      userRepository: _mockedUserRepository,
      cryptoRepository: createCryptoServiceMock(),
    };
  });

  test("Login with admin user returns token with admin role", async () => {
    const adminUser = _mockedUserRepository.users.find(
      (user) => user.role === "admin"
    );
    if (!adminUser) throw new Error("Admin user not found in mocks");
    const result = await login(_dependencies, {
      email: adminUser.email,
      password: adminUser.password.slice(8),
    });
    expect(result).toBeTruthy();
    const decodedToken = await _dependencies.cryptoRepository.validateToken(
      (result as UserLoginResponseModel).token
    );
    expect(decodedToken).toHaveProperty("role", "admin");
  });

  test("Login with admin user returns token with regular user role", async () => {
    const regularUser = _mockedUserRepository.users.find(
      (user) => user.role === "user"
    );
    if (!regularUser) throw new Error("Regular user not found in mocks");
    const result = await login(_dependencies, {
      email: regularUser.email,
      password: regularUser.password.slice(8),
    });
    expect(result).toBeTruthy();
    const decodedToken = await _dependencies.cryptoRepository.validateToken(
      (result as UserLoginResponseModel).token
    );
    expect(decodedToken).toHaveProperty("role", "user");
  });

  test("Login with a 'blocked' user throws ForbiddenError", async () => {
     const blockedUser = _mockedUserRepository.users.find(
      (user) => !user.role
    );
    if (!blockedUser) throw new Error("Blocked user not found in mocks");
    await expect(
      login(_dependencies, {
        email: blockedUser.email,
        password: blockedUser.password.slice(8),
      })
    ).rejects.toThrow(createForbiddenError("Access forbidden"));
  });
});
