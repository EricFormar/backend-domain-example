import {
  BadRequestError,
  createBadRequestError,
  createInternalServerError,
  createInvalidDataError,
  InternalServerError,
  InvalidDataError,
} from "src/errors/error";
import { CryptoRepository } from "src/repositories/crypto-repository";
import { VerificationTokenRepository } from "../../repositories/verification-token-repository";
import { UserRepository } from "src/repositories/user-repository";

export interface SendEmailVerificationDependencies {
  userRepository: UserRepository;
  verificationTokenRepository: VerificationTokenRepository;
  cryptoRepository: CryptoRepository;
}

export interface SendEmailVerificationRequest {
  email: string;
}

export interface SendEmailVerificationResponse {
  success: boolean;
  message: string;
}

const EMAIL_TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000;

export const sendEmailVerification = async (
  {
    userRepository,
    verificationTokenRepository,
    cryptoRepository,
  }: SendEmailVerificationDependencies,
  { email }: SendEmailVerificationRequest
): Promise<
  | SendEmailVerificationResponse
  | InvalidDataError
  | BadRequestError
  | InternalServerError
> => {
  const validationResult = validateEmail(email);
  if (!validationResult.isValid) {
    throw createInvalidDataError(validationResult.message);
  }

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser && existingUser.validated) {
    throw createBadRequestError("Email already validated");
  }
  const token = await cryptoRepository.generateRandomToken();
  const expiresAt = new Date(Date.now() + EMAIL_TOKEN_EXPIRATION_MS);
  
  try {
    await verificationTokenRepository.saveVerificationToken(
      email,
      token,
      expiresAt
    );
  } catch (error) {
    throw createInternalServerError("Error generating verification token");
  }

  try {
    await verificationTokenRepository.sendVerificationEmail(email, token);
  } catch (error) {
    throw createInternalServerError("Error sending verification email");
  }

  return {
    success: true,
    message: "Verification email sent successfully",
  };
};

function validateEmail(email: string): { isValid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!email){
    return { isValid: false, message: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Invalid email format" };
  }
  return { isValid: true };
}
