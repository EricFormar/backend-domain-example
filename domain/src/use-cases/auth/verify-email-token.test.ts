import { describe, it, expect, vi, beforeEach, test } from 'vitest';
import { verifyEmailToken, VerifyEmailTokenDependencies, VerifyEmailTokenRequest } from './verify-email-token';
import { createConflictError, createInvalidDataError, createNotFoundError } from '../../errors/error';
import { createUserRepositoryMock, MockedUserRepository } from '../../mocks/user-repository-mock';
import { createUserMock } from '../../mocks/user-mock';
import { createVerificationTokenRepositoryMock } from '../../mocks/verification-token-repository-mock';

describe('verifyEmailToken', () => {

    const _mockedUserRepository: MockedUserRepository =
    createUserRepositoryMock([
        createUserMock({ id: "any-id" , email : "any-email"}),
        createUserMock({ id: "other-id" }),
    ]);
const _mockedVerificationTokenRepository = createVerificationTokenRepositoryMock();

  let _dependencies: VerifyEmailTokenDependencies;

  beforeEach(() => {
  _dependencies = {
    userRepository: _mockedUserRepository,
    verificationTokenRepository: _mockedVerificationTokenRepository,
};
  });

    test('should successfully verify the email and update the user', async () => {
        const token = 'valid-token';
        const request : VerifyEmailTokenRequest = {token};

        _mockedVerificationTokenRepository.tokens.push({
            email: 'any-email',
            token,
            expiresAt: new Date(Date.now() + 100000),
        });

        const result = await verifyEmailToken(_dependencies, request);

        expect(result).toEqual({
            success: true,
            message: 'Email successfully verified',
        });
    });

    test('should return an InvalidDataError if token is empty', async () => {
        const request : VerifyEmailTokenRequest = { token: '' };
        await expect(verifyEmailToken(_dependencies, request)).rejects.toThrow('Token is required')
    });

    test('should return a NotFoundError if the token does not exist', async () => {
        
        const request = { token: 'invalid-token' };
        
        await expect(verifyEmailToken(_dependencies, request)).rejects.toThrow('Invalid or expired token')

    });

    test('should return a ConflictError if the token has expired', async () => {
        // Arrange
        const expiredToken = 'expired-token';
        const userEmail = 'any-email';
        const expiresAt =  new Date(Date.now() - 100000);

        _mockedVerificationTokenRepository.saveVerificationToken(userEmail, expiredToken, expiresAt);

        const request = { token: expiredToken };

        await expect(verifyEmailToken(_dependencies, request)).rejects.toThrow('Token has expired');

    });

    test('should return a NotFoundError if the user associated with the token is not found', async () => {
        const token = 'valid-token-789';
        const nonExistentEmail = 'nonexistent@example.com';
        
        _mockedVerificationTokenRepository.tokens.push({
            email: nonExistentEmail,
            token,
            expiresAt: new Date(Date.now() + 100000),
        });

        const request = { token };
        
        await expect(verifyEmailToken(_dependencies, request)).rejects.toThrow('User associated with the token not found');

    });
});