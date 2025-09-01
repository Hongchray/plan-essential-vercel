import { prisma } from "@/lib/prisma";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import crypto from "crypto";

// Helper function to verify Telegram auth data
function verifyTelegramAuth(authData: any, botToken: string): boolean {
  const { hash, ...data } = authData;

  // Create data check string
  const dataCheckArr: string[] = [];
  Object.keys(data)
    .sort()
    .forEach((key) => {
      dataCheckArr.push(`${key}=${data[key]}`);
    });
  const dataCheckString = dataCheckArr.join("\n");

  // Create secret key
  const secretKey = crypto.createHash("sha256").update(botToken).digest();

  // Create hash
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

        if (user && (await compare(credentials.password, user.password))) {
          return user;
        }

        return null;
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

        try {
          const authData = JSON.parse(credentials.authData);
          const botToken = process.env.TELEGRAM_BOT_TOKEN;

          if (!botToken) {
            console.error("TELEGRAM_BOT_TOKEN not found");
            return null;
          }

          // Verify Telegram auth data
          if (!verifyTelegramAuth(authData, botToken)) {
            console.error("Invalid Telegram auth data");
            return null;
          }

          // Check if auth data is not too old (1 day)
          const authDate = new Date(authData.auth_date * 1000);
          const now = new Date();
          const timeDiff = now.getTime() - authDate.getTime();
          const dayInMs = 24 * 60 * 60 * 1000;

          if (timeDiff > dayInMs) {
            console.error("Telegram auth data is too old");
            return null;
          }

          // Check if user exists in database
          let user = await prisma.user.findUnique({
            where: { telegramId: authData.id.toString() },
          });

          // If user doesn't exist, create a new one
          if (!user) {
            // You might want to also check by username or other identifiers
            user = await prisma.user.create({
              data: {
                telegramId: authData.id.toString(),
                name: `${authData.first_name} ${
                  authData.last_name || ""
                }`.trim(),
                username: authData.username || null,
                phone: null, // Telegram doesn't always provide phone
                password: "", // No password for Telegram users
                photoUrl: authData.photo_url || null,
              },
            });
          } else {
            // Update user info if it changed
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                name: `${authData.first_name} ${
                  authData.last_name || ""
                }`.trim(),
                username: authData.username || user.username,
                photoUrl: authData.photo_url || user.photoUrl,
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            username: user.username,
            phone: user.phone,
            telegramId: user.telegramId,
            image: user.photoUrl,
          };
        } catch (error) {
          console.error("Telegram auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    signOut: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.telegramId = user.telegramId;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.telegramId = token.telegramId;
        session.user.username = token.username;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("/admin/login")) return baseUrl + "/admin/dashboard";
      if (url.startsWith("/")) return baseUrl + url;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
