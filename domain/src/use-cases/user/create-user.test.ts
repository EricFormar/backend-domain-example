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

describe("Create new user", async () => {
  const _mockedUserRepository: MockedUserRepository = createUserRepositoryMock([]);

  const existingUser: User = {
    id: "existing user id",
    password: "12345678",
    email: "existing@user.com",
    name: "Existing User",
    role: "user" as UserRole,
  };
  let _dependencies: UserCreateDependencies;

  beforeEach(() => {
    _dependencies = {
      userRepository: _mockedUserRepository,
    };
    _dependencies.userRepository.create(existingUser);
  });

  test("With an email already in use, fails with InvalidData", async () => {
    const payload: UserCreateRequestModel = {
      email: "existing@user.com",
      password: "12345678",
      name: "Test User",
    };    
    const result = await userCreate(_dependencies, payload);
    expect(result).toEqual(createInvalidDataError("Email already in use"));
  });

  test("With an empty email, fails with InvalidData", async () => {
    const payload: UserCreateRequestModel = {
      email: "",
      password: "12345678",
      name: "Test User",
    };
    const result = await userCreate(_dependencies, payload);

    expect(result).toEqual(createInvalidDataError("Email must be not empty"));
  });

  test("With an empty password, fails with InvalidData", async () => {
    const payload: UserCreateRequestModel = {
      email: "valid@email.com",
      password: "",
      name: "Test User",
    };
    const result = await userCreate(_dependencies, payload);

    expect(result).toEqual(
      createInvalidDataError("Password must be not empty")
    );
  });

  test("With an empty name, fails with InvalidData", async () => {
    const payload: UserCreateRequestModel = {
      email: "valid@email.com",
      password: "12345678",
      name: "",
    };
    const result = await userCreate(_dependencies, payload);

    expect(result).toEqual(createInvalidDataError("Name must be not empty"));
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
  });
});
