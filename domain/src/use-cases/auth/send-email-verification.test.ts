import { beforeEach, describe, expect, test } from 'vitest';
import { sendEmailVerification, SendEmailVerificationDependencies } from './send-email-verification';
import { createUserRepositoryMock, MockedUserRepository } from '../../mocks/user-repository-mock';
import { createEmailVerificationRepositoryMock, MockedEmailVerificationRepository } from '../../mocks/email-verification-repository-mock';
import { createCryptoRepositoryMock } from '../../mocks/crypto-repository-mock';
import { UserRole } from '../../entities/User';
import { createUserMock } from '../../mocks/user-mock';
import { CryptoRepository } from '../../repositories/crypto-repository';

describe('Send Email Verification Use Case', async () => {
        
// Declaramos y asignamos las variables para evitar el error de TypeScript
let _mockedEmailVerificationRepository = createEmailVerificationRepositoryMock();
let _mockedCryptoRepository = createCryptoRepositoryMock();
let _mockedUserRepository: MockedUserRepository = createUserRepositoryMock([]);
let _dependencies: SendEmailVerificationDependencies;

beforeEach(() => {
    // Reasignamos nuevas instancias para cada test
    _mockedEmailVerificationRepository = createEmailVerificationRepositoryMock();
    _mockedCryptoRepository = createCryptoRepositoryMock();
    _mockedUserRepository = createUserRepositoryMock([
        createUserMock({
            email: 'existing@example.com',
            validated: false,
        })
    ]);
    
    _dependencies = {
        userRepository: _mockedUserRepository,
        emailVerificationRepository: _mockedEmailVerificationRepository,
        cryptoRepository: _mockedCryptoRepository,
    };
});

    test('should send verification email successfully for new email', async () => {
        const email = 'newuser@example.com';

        const result = await sendEmailVerification(
            _dependencies,
            { email }
        );

        expect(result.success).toBe(true);
        expect(result.message).toBe('Verification email sent successfully');

        expect(_mockedEmailVerificationRepository.tokens).toHaveLength(1);
        expect(_mockedEmailVerificationRepository.tokens[0].email).toBe(email);
        expect(_mockedEmailVerificationRepository.tokens[0].expiresAt).toBeInstanceOf(Date);

        const tokenExpirationTime = _mockedEmailVerificationRepository.tokens[0].expiresAt.getTime();
        const expectedExpirationTime = Date.now() + 24 * 60 * 60 * 1000;
        const timeDifference = Math.abs(tokenExpirationTime - expectedExpirationTime);
        expect(timeDifference).toBeLessThan(1000);

        expect(_mockedEmailVerificationRepository.sendEmails).toHaveLength(1);
        expect(_mockedEmailVerificationRepository.sendEmails[0].email).toBe(email);
        expect(_mockedEmailVerificationRepository.sendEmails[0].token).toBe(
            _mockedEmailVerificationRepository.tokens[0].token
        );
    });
    test('should fail when email is already registered', async () => {
        const email = 'existing@example.com';

        await sendEmailVerification(
          _dependencies,
            { email }
        );

        expect(_mockedEmailVerificationRepository.tokens).toHaveLength(0);
        expect(_mockedEmailVerificationRepository.sendEmails).toHaveLength(0);
    });
    test('should fail when email is empty', async () => {
        const result = await sendEmailVerification(
            _dependencies,
            { email: '' }
        );

        expect(result.success).toBe(false);
        expect(result.message).toBe('Email is required');

        expect(_mockedEmailVerificationRepository.tokens).toHaveLength(0);
        expect(_mockedEmailVerificationRepository.sendEmails).toHaveLength(0);
    });
    test('should fail when email is only whitespace', async () => {
        const result = await sendEmailVerification(
            _dependencies,
            { email: '   ' }
        );

        expect(result.success).toBe(false);
        expect(result.message).toBe('Email is required');

        expect(_mockedEmailVerificationRepository.tokens).toHaveLength(0);
        expect(_mockedEmailVerificationRepository.sendEmails).toHaveLength(0);
    });
    test('should handle multiple different emails simultaneously', async () => {
        const email1 = 'user1@example.com';
        const email2 = 'user2@example.com';

        const result1 = await sendEmailVerification(
            _dependencies,
            { email: email1 }
        );

        const result2 = await sendEmailVerification(
            _dependencies,
            { email: email2 }
        );

        expect(result1.success).toBe(true);
        expect(result2.success).toBe(true);

        expect(_mockedEmailVerificationRepository.tokens).toHaveLength(2);
        expect(_mockedEmailVerificationRepository.tokens.find(t => t.email === email1)).toBeDefined();
        expect(_mockedEmailVerificationRepository.tokens.find(t => t.email === email2)).toBeDefined();

        expect(_mockedEmailVerificationRepository.sendEmails).toHaveLength(2);
        expect(_mockedEmailVerificationRepository.sendEmails.find(e => e.email === email1)).toBeDefined();
        expect(_mockedEmailVerificationRepository.sendEmails.find(e => e.email === email2)).toBeDefined();
    });
});