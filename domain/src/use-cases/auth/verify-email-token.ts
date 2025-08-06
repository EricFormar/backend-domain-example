import { InvalidDataError, NotFoundError, ConflictError, createInvalidDataError, createNotFoundError, createConflictError } from "src/errors/error";
import { VerificationTokenRepository } from "../../repositories/verification-token-repository";
import { UserRepository } from "src/repositories/user-repository";

export interface VerifyEmailTokenDependencies {
    userRepository: UserRepository;
    verificationTokenRepository: VerificationTokenRepository;
}

export interface VerifyEmailTokenRequest {
    token: string;
}

export interface VerifyEmailTokenResponse {
    success: boolean;
    message: string;
}

export const verifyEmailToken = async (
    { userRepository, verificationTokenRepository }: VerifyEmailTokenDependencies,
    { token }: VerifyEmailTokenRequest
): Promise<VerifyEmailTokenResponse | InvalidDataError | NotFoundError | ConflictError> => {

    if (!token || token.trim() === '') {
        throw createInvalidDataError('Token is required');
    }

    const verificationToken = await verificationTokenRepository.findVerificationToken(token);

    if (!verificationToken) {
        throw createNotFoundError('Invalid or expired token');
    }

    const now = new Date();
    if (verificationToken.expiresAt < now) {
        throw createConflictError('Token has expired');
    }

    const user = await userRepository.findByEmail(verificationToken.email);
    if (!user) {
        throw createNotFoundError('User associated with the token not found');
    }

    await userRepository.update({
        id: user.id,
        validated: true,
    });

    await verificationTokenRepository.deleteVerificationToken(token);

    return {
        success: true,
        message: 'Email successfully verified',
    };
};