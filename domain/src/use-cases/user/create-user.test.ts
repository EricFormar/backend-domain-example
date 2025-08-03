import { describe, test, expect, Mock, beforeAll, beforeEach } from "vitest";
import { User, UserRole } from "../../entities/User";
import { createInvalidDataError } from "../../errors/error";
import {
  createUserRepositoryMock,
  MockedUserRepository,
} from "../../mocks/user-repository-mock";
import {
  userCreate,
  UserCreateDependencies,
  UserCreateRequestModel,
} from "./create-user";
import { createCryptoServiceMock } from "../../mocks/crypto-repository-mock";

describe("Create new user", async () => {
  const existingUser: User = {
    id: "existing-id",
    password: "12345678",
    email: "existing@user.com",
    name: "Existing User",
    role: "user" as UserRole,
  };
  const _mockedUserRepository: MockedUserRepository = createUserRepositoryMock([
    existingUser,
  ]);

  let _dependencies: UserCreateDependencies;

  beforeEach(() => {
    _dependencies = {
      userRepository: _mockedUserRepository,
      cryptoRepository: createCryptoServiceMock(),
    };
  });

  test("With an email already in use, fails with InvalidData", async () => {
    const payload: UserCreateRequestModel = {
      email: "existing@user.com",
      password: "12345678",
      name: "Test User",
    };
    await expect(userCreate(_dependencies, payload)).rejects.toThrow(
      createInvalidDataError("Email already in use")
    );
  });

  test("With an empty email, fails with InvalidData", async () => {
    const payload: UserCreateRequestModel = {
      email: "",
      password: "12345678",
      name: "Test User",
    };
    await expect(userCreate(_dependencies, payload)).rejects.toThrow(
      createInvalidDataError("Email must be not empty")
    );
  });

  test("With an empty password, fails with InvalidData", async () => {
    const payload: UserCreateRequestModel = {
      email: "valid@email.com",
      password: "",
      name: "Test User",
    };
    await expect(userCreate(_dependencies, payload)).rejects.toThrow(
      createInvalidDataError("Password must be not empty")
    );
  });

  test("With an empty name, fails with InvalidData", async () => {
    const payload: UserCreateRequestModel = {
      email: "valid@email.com",
      password: "12345678",
      name: "",
    };

    await expect(userCreate(_dependencies, payload)).rejects.toThrow(
      createInvalidDataError("Name must be not empty")
    );
  });

  test("With valid data, registers the user successfully", async () => {
    const payload: UserCreateRequestModel = {
      email: "valid@email.com",
      password: "12345678",
      name: "User Test",
    };

    const result = await userCreate(_dependencies, payload);
    const user = await _mockedUserRepository.findByEmail(payload.email);

    expect(user).not.toBeNull();
    expect(result).toEqual(user);
    if (user?.password) {
      expect(
        await _dependencies.cryptoRepository.comparePassword(
          payload.password,
          user.password
        )
      ).toBe(true);
    }
  });
});
