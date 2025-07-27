import { beforeEach, describe, expect, test } from "vitest";

import { createNotFoundError } from "../../errors/error";
import { createUserRepositoryMock, MockedUserRepository } from "../../mocks/user-repository-mock";
import { createUserMock } from "../../mocks/user-mock";
import { updateUser, UserUpdateDependencies } from "./update-user";


describe("Update User", () => {
  const _mockedUserRepository: MockedUserRepository =
    createUserRepositoryMock([
      createUserMock({ id: "any-id", name: "any-name" }),
      createUserMock({ id: "other-id" }),
    ]);

  let _dependencies: UserUpdateDependencies;

  beforeEach(() => {
    _dependencies = {
      userRepository: _mockedUserRepository,
    };
  });

  test("should update a user", async () => {
    const userToUpdate = createUserMock({ id: "any-id", name: "update-name", email : "update-email"});
    const result = await updateUser(_dependencies, { userToUpdate });

    expect(result).toHaveProperty("name", userToUpdate.name);
    expect(result).toHaveProperty("email", userToUpdate.email);
  });

  test("should throw error when user id does not exist", async () => {
    const userToUpdate = createUserMock({ id: "non-exist-id", name: "update-name"});
    const result = await updateUser(_dependencies, {
      userToUpdate,
    });
    expect(result).toEqual(createNotFoundError("User not found"));
  });
});
