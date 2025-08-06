export interface EmailVerificationToken {
    email: string;
    token: string;
    expiresAt: Date;
}