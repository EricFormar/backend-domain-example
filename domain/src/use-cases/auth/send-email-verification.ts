import { CryptoRepository } from "src/repositories/crypto-repository";
import { EmailVerificationRepository } from "src/repositories/email-verification-repository";
import { UserRepository } from "src/repositories/user-repository";

export interface SendEmailVerificationDependencies {
    userRepository: UserRepository;
    emailVerificationRepository: EmailVerificationRepository;
    cryptoRepository: CryptoRepository;
}

export interface SendEmailVerificationRequest {
    email: string;
}

export interface SendEmailVerificationResponse {
    success: boolean;
    message: string;
}

export const sendEmailVerification = async (
    { userRepository, emailVerificationRepository, cryptoRepository }: SendEmailVerificationDependencies,
    {email}: SendEmailVerificationRequest
): Promise<SendEmailVerificationResponse> => {
    if (!email || email.trim() === '') {
        return {
            success: false,
            message: 'Email is required',
        };
    }
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        return {
            success: false,
            message: 'Email already registered',
        };
    }
    
    const token = await cryptoRepository.generateRandomToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await emailVerificationRepository.saveEmailVerificationToken(email, token, expiresAt);
    await emailVerificationRepository.sendVerificationEmail(email, token);
    return {
        success: true,
        message: 'Verification email sent successfully',
    };
};