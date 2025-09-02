import { prisma } from "@/lib/prisma";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import crypto from "crypto";

// Extend NextAuth types to include custom user/session properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      phone: string;
      telegramId?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id: string;
    role: string;
    phone: string;
    telegramId: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
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
          name: user.name ?? "",
          phone: user.phone ?? "",
          role: user.role,
          telegramId: user.telegramId ?? "",
        };
      },
    }),
    // Telegram Authentication Provider
    CredentialsProvider({
      id: "telegram",
      name: "Telegram",
      credentials: {
        authData: { label: "Auth Data", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.authData) {
            console.error("No auth data provided");
            return null;
          }

          const authData = JSON.parse(credentials.authData);
          console.log("Received Telegram auth data:", authData);

          // Verify auth data integrity
          const botToken = process.env.TELEGRAM_BOT_TOKEN;
          if (!botToken) {
            console.error("TELEGRAM_BOT_TOKEN is not configured");
            return null;
          }

          if (!verifyTelegramAuth(authData, botToken)) {
            console.error("Telegram auth verification failed");
            return null;
          }

          // Check if auth is not too old (within 1 hour)
          const authTime = authData.auth_date * 1000; // Convert to milliseconds
          const now = Date.now();
          const oneHour = 60 * 60 * 1000;

          if (now - authTime > oneHour) {
            console.error("Telegram auth data is too old");
            return null;
          }

          const telegramId = authData.id.toString();
          const firstName = authData.first_name;
          const lastName = authData.last_name || "";
          const username = authData.username;
          const photoUrl = authData.photo_url;

          // Check if user exists by Telegram ID
          let user = await prisma.user.findUnique({
            where: { telegramId },
          });

          if (user) {
            // Update user info if changed
            const updatedUser = await prisma.user.update({
              where: { telegramId },
              data: {
                name: `${firstName} ${lastName}`.trim(),
                username: username,
                photoUrl: photoUrl,
                updatedAt: new Date(),
              },
            });

            return {
              id: updatedUser.id,
              email: updatedUser.email ?? "",
              name: updatedUser.name ?? "",
              phone: updatedUser.phone ?? "",
              role: updatedUser.role,
              telegramId: updatedUser.telegramId ?? "",
            };
          } else {
            // Create new user
            const newUser = await prisma.user.create({
              data: {
                telegramId,
                email: `telegram_${telegramId}@temp.com`, // Temporary email
                password: crypto.randomBytes(32).toString("hex"), // Random password
                name: `${firstName} ${lastName}`.trim(),
                username: username,
                photoUrl: photoUrl,
                role: "user",
                phone_verified: false,
              },
            });

            return {
              id: newUser.id,
              email: newUser.email ?? "",
              name: newUser.name ?? "",
              phone: newUser.phone ?? "",
              role: newUser.role,
              telegramId: newUser.telegramId ?? "",
            };
          }
        } catch (error) {
          console.error("Telegram authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login on error
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.phone = user.phone;
        token.telegramId = user.telegramId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string;
        session.user.telegramId = token.telegramId as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
