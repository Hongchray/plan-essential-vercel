import { prisma } from "@/lib/prisma";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import crypto from "crypto";

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
        return user;
      },
    }),
    // Telegram provider here
  ],
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  callbacks: {
    /* jwt/session/redirect as before */
  },
};
