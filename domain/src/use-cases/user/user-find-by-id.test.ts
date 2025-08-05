import { beforeEach, describe, expect, test } from "vitest";

import {
  createUserRepositoryMock,
  MockedUserRepository,
} from "../../mocks/user-repository-mock";
import { createUserMock } from "../../mocks/user-mock";
import {
  findUserById,
  UserFindByIdDependencies,
} from "./user-find-by-id";

describe("Find User by ID", () => {
  const _mockedUserRepository: MockedUserRepository =
    createUserRepositoryMock([
      createUserMock({ id: "any-id" }),
      createUserMock({ id: "other-id" }),
    ]);

  let _dependencies: UserFindByIdDependencies;

  beforeEach(() => {
    _dependencies = {
      userRepository: _mockedUserRepository,
    };
  });

  test("should get user by id", async () => {
    const userId = "any-id";
    const result = await findUserById(_dependencies, { id: userId });

    expect(result).toHaveProperty("id", userId);
  });

  test("should throw error when user id does not exist", async () => {
    const userId = "non-exist-id";
    await expect(
      findUserById(_dependencies, {
        id: userId,
      })
    ).rejects.toThrow("User not found");
  });
});
