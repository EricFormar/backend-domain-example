import { describe, it, expect, vi } from 'vitest';
import { verifyEmailToken } from './verify-email-token';
import { createConflictError, createInvalidDataError, createNotFoundError } from '../../errors/error';

// Mock de las dependencias
const mockUserRepository = {
    findByEmail: vi.fn(),
    updateUser: vi.fn(),
};

const mockEmailVerificationRepository = {
    findToken: vi.fn(),
    deleteToken: vi.fn(),
};

const dependencies = {
    userRepository: mockUserRepository,
    emailVerificationRepository: mockEmailVerificationRepository,
};

describe('verifyEmailToken', () => {

    it('should successfully verify the email and update the user', async () => {
        // Arrange
        const token = 'valid-token-123';
        const userEmail = 'test@example.com';
        const userId = 'user-id-123';
        
        // Simula la existencia de un token válido y no expirado
        mockEmailVerificationRepository.findToken.mockResolvedValueOnce({
            email: userEmail,
            token,
            expiresAt: new Date(Date.now() + 100000), // En el futuro
        });
        
        // Simula la existencia del usuario
        mockUserRepository.findByEmail.mockResolvedValueOnce({
            id: userId,
            email: userEmail,
            isVerified: false,
        });

        const request = { token };

        // Act
        const result = await verifyEmailToken(dependencies, request);

        // Assert
        expect(result).toEqual({
            success: true,
            message: 'Email successfully verified',
        });
        
        // Verifica que se llamó a los métodos correctos
        expect(mockEmailVerificationRepository.findToken).toHaveBeenCalledWith(token);
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userEmail);
        expect(mockUserRepository.updateUser).toHaveBeenCalledWith(userId, { isVerified: true });
        expect(mockEmailVerificationRepository.deleteToken).toHaveBeenCalledWith(token);
    });

    it('should return an InvalidDataError if token is empty', async () => {
        // Arrange
        const request = { token: '' };

        // Act
        const result = await verifyEmailToken(dependencies, request);

        // Assert
        expect(result).toEqual(createInvalidDataError('Token is required'));
        
        // Verifica que no se llamó a ningún repositorio
        expect(mockEmailVerificationRepository.findToken).not.toHaveBeenCalled();
    });

    it('should return a NotFoundError if the token does not exist', async () => {
        // Arrange
        const request = { token: 'invalid-token' };
        
        // Simula que el token no se encuentra en la base de datos
        mockEmailVerificationRepository.findToken.mockResolvedValueOnce(null);

        // Act
        const result = await verifyEmailToken(dependencies, request);

        // Assert
        expect(result).toEqual(createNotFoundError('Invalid or expired token'));
        
        // Verifica que no se llamó a otros métodos
        expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should return a ConflictError if the token has expired', async () => {
        // Arrange
        const expiredToken = 'expired-token-456';
        const userEmail = 'test@example.com';
        
        // Simula la existencia de un token expirado
        mockEmailVerificationRepository.findToken.mockResolvedValueOnce({
            email: userEmail,
            token: expiredToken,
            expiresAt: new Date(Date.now() - 100000), // En el pasado
        });

        const request = { token: expiredToken };

        // Act
        const result = await verifyEmailToken(dependencies, request);

        // Assert
        expect(result).toEqual(createConflictError('Token has expired'));
        
        // Verifica que no se llamó a otros métodos
        expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should return a NotFoundError if the user associated with the token is not found', async () => {
        // Arrange
        const validToken = 'valid-token-789';
        const nonExistentEmail = 'nonexistent@example.com';
        
        // Simula un token válido
        mockEmailVerificationRepository.findToken.mockResolvedValueOnce({
            email: nonExistentEmail,
            token: validToken,
            expiresAt: new Date(Date.now() + 100000),
        });

        // Simula que el usuario no existe
        mockUserRepository.findByEmail.mockResolvedValueOnce(null);

        const request = { token: validToken };

        // Act
        const result = await verifyEmailToken(dependencies, request);

        // Assert
        expect(result).toEqual(createNotFoundError('User associated with the token not found'));
        
        // Verifica que no se llamó a los métodos de actualización o eliminación
        expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
        expect(mockEmailVerificationRepository.deleteToken).not.toHaveBeenCalled();
    });
});