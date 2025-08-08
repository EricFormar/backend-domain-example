import { beforeEach, describe, expect, test } from "vitest";
import {
  sendEmailVerification,
  SendEmailVerificationDependencies,
} from "./send-email-verification";
import {
  createUserRepositoryMock,
  MockedUserRepository,
} from "../../mocks/user-repository-mock";
import { createVerificationTokenRepositoryMock } from "../../mocks/verification-token-repository-mock";
import { createCryptoRepositoryMock } from "../../mocks/crypto-repository-mock";
import { createUserMock } from "../../mocks/user-mock";
import { CryptoRepository } from "../../repositories/crypto-repository";

describe("Send Email Verification Use Case", async () => {
  let _mockedVerificationTokenRepository =
    createVerificationTokenRepositoryMock();
  let _mockedCryptoRepository = createCryptoRepositoryMock();
  let _mockedUserRepository: MockedUserRepository = createUserRepositoryMock(
    []
  );
  let _dependencies: SendEmailVerificationDependencies;

  beforeEach(() => {
    _mockedVerificationTokenRepository =
      createVerificationTokenRepositoryMock();
    _mockedCryptoRepository = createCryptoRepositoryMock();
    _mockedUserRepository = createUserRepositoryMock([
      createUserMock({
        email: "email-validated@example.com",
        validated: true,
      }),
      createUserMock({
        email: "email-not-validated@example.com",
        validated: false,
      }),
    ]);

    _dependencies = {
      userRepository: _mockedUserRepository,
      verificationTokenRepository: _mockedVerificationTokenRepository,
      cryptoRepository: _mockedCryptoRepository,
    };
  });

  test("should send verification email successfully for new email", async () => {
    const email = "email-not-validated@example.com";

    const result = await sendEmailVerification(_dependencies, { email });

    expect(result.message).toBe("Verification email sent successfully");

    expect(_mockedVerificationTokenRepository.tokens).toHaveLength(1);
    expect(_mockedVerificationTokenRepository.tokens[0].email).toBe(email);
    expect(
      _mockedVerificationTokenRepository.tokens[0].expiresAt
    ).toBeInstanceOf(Date);

    const tokenExpirationTime =
      _mockedVerificationTokenRepository.tokens[0].expiresAt.getTime();
    const expectedExpirationTime = Date.now() + 24 * 60 * 60 * 1000;
    const timeDifference = Math.abs(
      tokenExpirationTime - expectedExpirationTime
    );
    expect(timeDifference).toBeLessThan(1000);

    expect(_mockedVerificationTokenRepository.sendEmails).toHaveLength(1);
    expect(_mockedVerificationTokenRepository.sendEmails[0].email).toBe(email);
    expect(_mockedVerificationTokenRepository.sendEmails[0].token).toBe(
      _mockedVerificationTokenRepository.tokens[0].token
    );
  });

  test("should fail when email is already registered", async () => {
    const email = "email-validated@example.com";

    await expect(
      sendEmailVerification(_dependencies, { email })
    ).rejects.toThrowError("Email already validated");

    expect(_mockedVerificationTokenRepository.tokens).toHaveLength(0);
    expect(_mockedVerificationTokenRepository.sendEmails).toHaveLength(0);
  });

  test("should fail when email is empty", async () => {
    await expect(
      sendEmailVerification(_dependencies, { email: "" })
    ).rejects.toThrowError("Email is required");
  });

  test("should handle multiple different emails simultaneously", async () => {
    const email1 = "user1@example.com";
    const email2 = "user2@example.com";

    await sendEmailVerification(_dependencies, { email: email1 });

    await sendEmailVerification(_dependencies, { email: email2 });

    expect(_mockedVerificationTokenRepository.tokens).toHaveLength(2);
    expect(
      _mockedVerificationTokenRepository.tokens.find((t) => t.email === email1)
    ).toBeDefined();
    expect(
      _mockedVerificationTokenRepository.tokens.find((t) => t.email === email2)
    ).toBeDefined();

    expect(_mockedVerificationTokenRepository.sendEmails).toHaveLength(2);
    expect(
      _mockedVerificationTokenRepository.sendEmails.find(
        (e) => e.email === email1
      )
    ).toBeDefined();
    expect(
      _mockedVerificationTokenRepository.sendEmails.find(
        (e) => e.email === email2
      )
    ).toBeDefined();
  });

  test("falla con token", async () => {
    const email = "email-not-validated@example.com";

    await expect(
      sendEmailVerification(
        {
          userRepository: _mockedUserRepository,
          verificationTokenRepository: _mockedVerificationTokenRepository,
          cryptoRepository: {
            generateRandomToken: () => Promise.reject(),
          } as any,
        },
        { email }
      )
    ).rejects.toThrow("Error generating verification token");
  });

  test("falla con al enviar el email", async () => {
    const email = "email-not-validated@example.com";

    await expect(
      sendEmailVerification(
        {
          userRepository: _mockedUserRepository,
          verificationTokenRepository: {
           ..._mockedVerificationTokenRepository,
           sendVerificationEmail: () => Promise.reject(), 
          },
          cryptoRepository: _mockedCryptoRepository,
        },
        { email }
      )
    ).rejects.toThrow("Error sending verification email");
  });
});
