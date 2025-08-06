import { EmailVerificationToken } from "src/entities/EmailVerificationToken";
import { VerificationTokenRepository } from "../repositories/verification-token-repository";

export interface MockedVerificationTokenRepository extends VerificationTokenRepository {
    tokens: EmailVerificationToken[];
    sendEmails: Array<{ email: string; token: string }>;
}

export function createVerificationTokenRepositoryMock(): MockedVerificationTokenRepository {
    return {
        tokens: [],
        sendEmails: [],

        async saveVerificationToken(email: string, token: string, expiresAt: Date): Promise<void> {
            this.tokens = this.tokens.filter(t => t.email !== email);
            this.tokens.push({ email, token, expiresAt });
        },

        async findVerificationToken(
            token: string
        ): Promise<{ email: string; expiresAt: Date } | null> {
            const tokenData = this.tokens.find(t => t.token === token);
            if (!tokenData) return null;

            return {
                email: tokenData.email,
                expiresAt: tokenData.expiresAt,
            };
        },

        async deleteVerificationToken(token: string): Promise<void> {
            this.tokens = this.tokens.filter(t => t.token !== token);
        },

        async sendVerificationEmail(email: string, token: string): Promise<void> {
            this.sendEmails.push({ email, token });
        },
    };
}