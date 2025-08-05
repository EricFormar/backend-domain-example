import { beforeEach, describe, expect, test } from "vitest";

import { createUserRepositoryMock, MockedUserRepository } from "../../mocks/user-repository-mock";
import { createUserMock } from "../../mocks/user-mock";
import { findUsers, FindUsersDependencies } from "./find-users";

describe("Find users", () => {
  const _mockedUserRepository: MockedUserRepository =
    createUserRepositoryMock([
      createUserMock({ id: "any-id" }),
      createUserMock({ id: "other-id" }),
    ]);

  let _dependencies: FindUsersDependencies;

  beforeEach(() => {
    _dependencies = {
      userRepository: _mockedUserRepository,
    };
  });

  test("should get users", async () => {
    const result = await findUsers(_dependencies);
    expect(result).toHaveLength(2);
  });

});
