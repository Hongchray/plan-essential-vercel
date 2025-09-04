import { prisma } from "@/lib/prisma";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import crypto from "crypto";

// Extend NextAuth types to include all user fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      username?: string | null;
      photoUrl?: string | null;
      phone?: string | null;
      role: string;
      telegramId?: string | null;
      otp_code?: string | null;
      otp_expires_at?: Date | null;
      phone_verified?: boolean;
      phone_verified_at?: Date | null;
      createdAt?: Date;
      updatedAt?: Date;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    username?: string | null;
    photoUrl?: string | null;
    phone?: string | null;
    role: string;
    telegramId?: string | null;
    otp_code?: string | null;
    otp_expires_at?: Date | null;
    phone_verified?: boolean;
    phone_verified_at?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

// Helper to verify Telegram auth
function verifyTelegramAuth(authData: any, botToken: string): boolean {
  const { hash, ...data } = authData;
  const dataCheckString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return hmac === hash;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });
        if (!user) return null;
        if (!(await compare(credentials.password, user.password))) return null;

        return {
          id: user.id,
          email: user.email ?? "",
          name: user.name ?? null,
          username: user.username ?? null,
          photoUrl: user.photoUrl ?? null,
          phone: user.phone ?? null,
          role: user.role,
          telegramId: user.telegramId ?? null,
          otp_code: user.otp_code ?? null,
          otp_expires_at: user.otp_expires_at ?? null,
          phone_verified: user.phone_verified,
          phone_verified_at: user.phone_verified_at ?? null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      },
    }),
    CredentialsProvider({
      id: "telegram",
      name: "Telegram",
      credentials: {
        authData: { label: "Auth Data", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.authData) return null;
        const authData = JSON.parse(credentials.authData);
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) return null;
        if (!verifyTelegramAuth(authData, botToken)) return null;

        const telegramId = authData.id.toString();
        const firstName = authData.first_name;
        const lastName = authData.last_name || "";
        const username = authData.username ?? null;
        const photoUrl = authData.photo_url ?? null;

        let user = await prisma.user.findUnique({ where: { telegramId } });

        if (user) {
          const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: {
              name: `${firstName} ${lastName}`.trim(),
              username,
              photoUrl,
              updatedAt: new Date(),
            },
          });

          return {
            id: updatedUser.id,
            email: updatedUser.email ?? "",
            name: updatedUser.name ?? null,
            username: updatedUser.username ?? null,
            photoUrl: updatedUser.photoUrl ?? null,
            phone: updatedUser.phone ?? null,
            role: updatedUser.role,
            telegramId: updatedUser.telegramId ?? null,
            otp_code: updatedUser.otp_code ?? null,
            otp_expires_at: updatedUser.otp_expires_at ?? null,
            phone_verified: updatedUser.phone_verified,
            phone_verified_at: updatedUser.phone_verified_at ?? null,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
          };
        } else {
          const newUser = await prisma.user.create({
            data: {
              telegramId,
              email: ``,
              password: crypto.randomBytes(32).toString("hex"),
              name: `${firstName} ${lastName}`.trim(),
              username,
              photoUrl,
              role: "user",
              phone_verified: false,
            },
          });

          return {
            id: newUser.id,
            email: newUser.email ?? "",
            name: newUser.name ?? null,
            username: newUser.username ?? null,
            photoUrl: newUser.photoUrl ?? null,
            phone: newUser.phone ?? null,
            role: newUser.role,
            telegramId: newUser.telegramId ?? null,
            otp_code: newUser.otp_code ?? null,
            otp_expires_at: newUser.otp_expires_at ?? null,
            phone_verified: newUser.phone_verified,
            phone_verified_at: newUser.phone_verified_at ?? null,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
          };
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) Object.assign(token, user);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string | null,
          name: token.name as string | null,
          username: token.username as string | null,
          photoUrl: token.photoUrl as string | null,
          phone: token.phone as string | null,
          role: token.role as string,
          telegramId: token.telegramId as string | null,
          otp_code: token.otp_code as string | null,
          otp_expires_at: token.otp_expires_at as Date | null,
          phone_verified: token.phone_verified as boolean,
          phone_verified_at: token.phone_verified_at as Date | null,
          createdAt: token.createdAt as Date,
          updatedAt: token.updatedAt as Date,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  debug: false,
};
