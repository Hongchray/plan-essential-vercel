import TelegramBot from "node-telegram-bot-api";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

// Generate OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate secure login token
function generateLoginToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Store pending login attempts
const pendingLogins = new Map<
  string,
  {
    telegramId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    timestamp: number;
  }
>();

// Bot command handlers
bot.onText(/\/start(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from?.id.toString();
  const username = msg.from?.username;
  const firstName = msg.from?.first_name;
  const lastName = msg.from?.last_name;

  if (!telegramId) {
    bot.sendMessage(chatId, "Unable to identify user. Please try again.");
    return;
  }

  const loginToken = match?.[1]?.trim();

  if (loginToken) {
    // Handle login with token
    await handleLoginWithToken(
      chatId,
      telegramId,
      username,
      firstName,
      lastName,
      loginToken
    );
  } else {
    // Regular start command
    bot.sendMessage(
      chatId,
      `Welcome ${
        firstName || "User"
      }! 🎉\n\nTo login to your account, please click the "Continue with Telegram" button on the website.`
    );
  }
});

async function handleLoginWithToken(
  chatId: number,
  telegramId: string,
  username: string | undefined,
  firstName: string | undefined,
  lastName: string | undefined,
  loginToken: string
) {
  try {
    // Check if user exists with this Telegram ID
    let user = await prisma.user.findUnique({
      where: { telegram_id: telegramId },
    });

    if (user) {
      // User exists, generate OTP for login
      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp_code: otp,
          otp_expires_at: otpExpiresAt,
        },
      });

      // Store pending login
      pendingLogins.set(loginToken, {
        telegramId,
        username,
        firstName,
        lastName,
        timestamp: Date.now(),
      });

      bot.sendMessage(
        chatId,
        `🔐 *Login Code*\n\nYour verification code is: \`${otp}\`\n\nThis code will expire in 5 minutes.\n\n⚠️ Don't share this code with anyone!`,
        { parse_mode: "Markdown" }
      );
    } else {
      // New user, ask if they want to create account
      bot.sendMessage(
        chatId,
        `👋 Hello ${
          firstName || "there"
        }!\n\nI don't have an account linked to this Telegram. Would you like to create a new account?`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✅ Create Account",
                  callback_data: `create_account:${loginToken}`,
                },
                { text: "❌ Cancel", callback_data: "cancel" },
              ],
            ],
          },
        }
      );
    }
  } catch (error) {
    console.error("Error handling login:", error);
    bot.sendMessage(chatId, "An error occurred. Please try again.");
  }
}

// Handle callback queries
bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const data = callbackQuery.data;
  const telegramId = callbackQuery.from.id.toString();
  const username = callbackQuery.from.username;
  const firstName = callbackQuery.from.first_name;
  const lastName = callbackQuery.from.last_name;

  if (!chatId || !data) return;

  if (data.startsWith("create_account:")) {
    const loginToken = data.split(":")[1];
    await handleAccountCreation(
      chatId,
      telegramId,
      username,
      firstName,
      lastName,
      loginToken
    );
  } else if (data === "cancel") {
    bot.editMessageText("Operation cancelled.", {
      chat_id: chatId,
      message_id: callbackQuery.message?.message_id,
    });
  }

  bot.answerCallbackQuery(callbackQuery.id);
});

async function handleAccountCreation(
  chatId: number,
  telegramId: string,
  username: string | undefined,
  firstName: string | undefined,
  lastName: string | undefined,
  loginToken: string
) {
  try {
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: `${telegramId}@telegram.local`, // Temporary email
        password: crypto.randomBytes(32).toString("hex"), // Random password
        name:
          `${firstName || ""} ${lastName || ""}`.trim() || `User_${telegramId}`,
        telegram_id: telegramId,
        telegram_username: username,
        otp_code: otp,
        otp_expires_at: otpExpiresAt,
        phone_verified: false,
      },
    });

    // Store pending login
    pendingLogins.set(loginToken, {
      telegramId,
      username,
      firstName,
      lastName,
      timestamp: Date.now(),
    });

    bot.editMessageText(
      `🎉 *Account Created Successfully!*\n\nYour verification code is: \`${otp}\`\n\nPlease enter this code on the website to complete login.\n\n⚠️ This code expires in 5 minutes.`,
      {
        chat_id: chatId,
        message_id: callbackQuery.message?.message_id,
        parse_mode: "Markdown",
      }
    );
  } catch (error) {
    console.error("Error creating account:", error);
    bot.editMessageText("Failed to create account. Please try again.", {
      chat_id: chatId,
      message_id: callbackQuery.message?.message_id,
    });
  }
}

// Cleanup expired pending logins
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of pendingLogins.entries()) {
    if (now - data.timestamp > 10 * 60 * 1000) {
      // 10 minutes
      pendingLogins.delete(token);
    }
  }
}, 60 * 1000); // Check every minute

export { bot, pendingLogins };
