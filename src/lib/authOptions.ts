import { prisma } from "@/lib/prisma";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import crypto from "crypto";
import { User } from "@/interfaces/user";
// Extend NextAuth types to include all user fields
declare module "next-auth" {
  interface Session {
    user: User;
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
        if (!credentials?.phone || !credentials?.password) {
          throw new Error("login.missing_fields");
        }

        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
          include: { userPlan: { include: { plan: true } } },
        });
        if (!user) {
          throw new Error("login.user_not_found");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("login.invalid_password");
        }
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
          plans: user.userPlan.map((up) => ({
            id: up.plan.id,
            name: up.plan.name,
            price: up.plan.price,
            limit_guests: up.limit_guests,
            limit_template: up.limit_template,
            limit_export_excel: up.limit_export_excel,
          })),
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
        if (!botToken || !verifyTelegramAuth(authData, botToken)) return null;

        const telegramId = authData.id.toString();
        const firstName = authData.first_name;
        const lastName = authData.last_name || "";
        const username = authData.username ?? null;
        const photoUrl = authData.photo_url ?? null;

        let user = await prisma.user.findUnique({ where: { telegramId } });

        if (user) {
          user = await prisma.user.update({
            where: { telegramId },
            data: {
              name: `${firstName} ${lastName}`.trim(),
              username,
              photoUrl,
              updatedAt: new Date(),
            },
            include: {
              userPlan: { include: { plan: true } },
            },
          });

          return {
            ...updatedUser,
            plans: updatedUser.userPlan.map((up) => ({
              id: up.plan.id,
              name: up.plan.name,
              price: up.plan.price,
              limit_guests: up.limit_guests,
              limit_template: up.limit_template,
              limit_export_excel: up.limit_export_excel,
            })),
          };
        } else {
          // ✅ Find default plan (you can adjust the name or ID as needed)
          const defaultPlan = await prisma.plan.findFirst({
            where: { price: 0 },
          });

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
              userPlan: defaultPlan
                ? {
                    create: {
                      planId: defaultPlan.id,
                      limit_guests: defaultPlan.limit_guests,
                      limit_template: defaultPlan.limit_template,
                      limit_export_excel: defaultPlan.limit_export_excel,
                    },
                  }
                : undefined, // fallback: no plan assigned if none found
            },
            include: {
              userPlan: { include: { plan: true } },
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
            plans: newUser.userPlan.map((up) => ({
              id: up.plan.id,
              name: up.plan.name,
              price: up.plan.price,
              limit_guests: up.limit_guests,
              limit_template: up.limit_template,
              limit_export_excel: up.limit_export_excel,
            })),
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
      // When user logs in, merge user info
      if (user) {
        Object.assign(token, user);
      } else if (token?.id) {
        // Always fetch fresh user from DB on subsequent calls
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: { userPlan: { include: { plan: true } } },
        });

        if (dbUser) {
          token.name = dbUser.name;
          token.username = dbUser.username;
          token.photoUrl = dbUser.photoUrl;
          token.updatedAt = dbUser.updatedAt;
          token.plans = dbUser.userPlan.map((up) => ({
            id: up.plan.id,
            name: up.plan.name,
            price: up.plan.price,
            limit_guests: up.limit_guests,
            limit_template: up.limit_template,
            limit_export_excel: up.limit_export_excel,
          }));
        }
      }
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
          plans: (token.plans as any[]) ?? [],
        };
      }
      return session;
    },
  },

  debug: false,
};
