import { beforeEach, describe, expect, test } from "vitest";

import { createNotFoundError } from "../../errors/error";
import { createUserRepositoryMock, MockedUserRepository } from "../../mocks/user-repository-mock";
import { createUserMock } from "../../mocks/user-mock";
import { deleteUser, DeleteUserDependencies } from "./delete-usert";

describe("Delete user", () => {
  const _mockedUserRepository: MockedUserRepository =
    createUserRepositoryMock([
      createUserMock({ id: "any-id" }),
      createUserMock({ id: "other-id" }),
    ]);

  let _dependencies: DeleteUserDependencies;

  beforeEach(() => {
    _dependencies = {
      userRepository: _mockedUserRepository,
    };
  });

  test("should get user by id", async () => {
    const userId = "any-id";
    const result = await deleteUser(_dependencies, { id: userId });
    expect(result).toBe(true);
  });

  test("should throw error when user id does not exist", async () => {
    const userId = "non-exist-id";
    const result = await deleteUser(_dependencies, {
      id: userId,
    });
    expect(result).toEqual(createNotFoundError("User not found"));
  });
});
