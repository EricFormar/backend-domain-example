import { EmailVerificationRepository } from "src/repositories/email-verification-repository";

interface EmailVerificationToken {
    email: string;
    token: string;
    expiresAt: Date;
}

export interface MockedEmailVerificationRepository extends EmailVerificationRepository {
    tokens: EmailVerificationToken[];
    sendEmails: Array<{ email: string; token: string }>;
}

export function createEmailVerificationRepositoryMock(): MockedEmailVerificationRepository {
    return {
        tokens: [],
        sendEmails: [],

        async saveEmailVerificationToken(email: string, token: string, expiresAt: Date): Promise<void> {
            this.tokens = this.tokens.filter(t => t.email !== email);
            this.tokens.push({ email, token, expiresAt });
        },

        async findEmailVerificationToken(
            token: string
        ): Promise<{ email: string; expiresAt: Date } | null> {
            const tokenData = this.tokens.find(t => t.token === token);
            if (!tokenData) return null;

            return {
                email: tokenData.email,
                expiresAt: tokenData.expiresAt,
            };
        },

        async deleteEmailVerificationToken(token: string): Promise<void> {
            this.tokens = this.tokens.filter(t => t.token !== token);
        },

        async sendVerificationEmail(email: string, token: string): Promise<void> {
            this.sendEmails.push({ email, token });
        },
    };
}