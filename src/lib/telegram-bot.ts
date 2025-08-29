// lib/telegram-bot.ts - Complete Implementation with Detailed Explanation

import TelegramBot from "node-telegram-bot-api";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

// Initialize Telegram Bot with polling enabled
// Polling means the bot actively checks for new messages
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

// UTILITY FUNCTIONS
// =================

// Generate a 6-digit OTP (One Time Password)
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a secure random token for login sessions
function generateLoginToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// MEMORY STORAGE FOR PENDING LOGINS
// =================================
// This stores temporary login attempts while waiting for user interaction
// In production, you might want to use Redis or database for this
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

// BOT COMMAND HANDLERS
// ===================

// Handle /start command and deep links
// Pattern: /start or /start <login_token>
bot.onText(/\/start(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from?.id.toString();
  const username = msg.from?.username;
  const firstName = msg.from?.first_name;
  const lastName = msg.from?.last_name;

  console.log(
    `📱 Received /start command from user: ${firstName} (${telegramId})`
  );

  if (!telegramId) {
    bot.sendMessage(chatId, "Unable to identify user. Please try again.");
    return;
  }

  // Extract login token from the command (if present)
  const loginToken = match?.[1]?.trim();

  if (loginToken) {
    // User came from website with login token
    console.log(`🔗 Processing login with token: ${loginToken}`);
    await handleLoginWithToken(
      chatId,
      telegramId,
      username,
      firstName,
      lastName,
      loginToken
    );
  } else {
    // Regular /start command without token
    bot.sendMessage(
      chatId,
      `Welcome ${
        firstName || "User"
      }! 🎉\n\nTo login to your account, please click the "Continue with Telegram" button on the website.`
    );
  }
});

// MAIN LOGIN HANDLER
// ==================
async function handleLoginWithToken(
  chatId: number,
  telegramId: string,
  username: string | undefined,
  firstName: string | undefined,
  lastName: string | undefined,
  loginToken: string
) {
  try {
    console.log(`🔍 Checking if user exists with Telegram ID: ${telegramId}`);

    // Check if user already exists with this Telegram ID
    let user = await prisma.user.findUnique({
      where: { telegram_id: telegramId },
    });

    if (user) {
      // EXISTING USER - Generate OTP for login
      console.log(`✅ Found existing user: ${user.name} (${user.id})`);

      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

      // Save OTP to user record
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp_code: otp,
          otp_expires_at: otpExpiresAt,
        },
      });

      // Store pending login information
      pendingLogins.set(loginToken, {
        telegramId,
        username,
        firstName,
        lastName,
        timestamp: Date.now(),
      });

      // Send OTP to user via Telegram
      bot.sendMessage(
        chatId,
        `🔐 *Login Code*\n\nYour verification code is: \`${otp}\`\n\nThis code will expire in 5 minutes.\n\n⚠️ Don't share this code with anyone!`,
        { parse_mode: "Markdown" }
      );

      console.log(`📤 Sent OTP ${otp} to user ${user.name}`);
    } else {
      // NEW USER - Ask if they want to create account
      console.log(`👤 New user detected: ${firstName} (${telegramId})`);

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
    console.error("❌ Error handling login:", error);
    bot.sendMessage(chatId, "An error occurred. Please try again.");
  }
}

// CALLBACK QUERY HANDLER
// ======================
// Handles button clicks (inline keyboard responses)
bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const data = callbackQuery.data;
  const telegramId = callbackQuery.from.id.toString();
  const username = callbackQuery.from.username;
  const firstName = callbackQuery.from.first_name;
  const lastName = callbackQuery.from.last_name;

  console.log(`🔘 Received callback query: ${data} from ${firstName}`);

  if (!chatId || !data) return;

  if (data.startsWith("create_account:")) {
    // User clicked "Create Account"
    const loginToken = data.split(":")[1];
    await handleAccountCreation(
      chatId,
      telegramId,
      username,
      firstName,
      lastName,
      loginToken,
      callbackQuery.message?.message_id
    );
  } else if (data === "cancel") {
    // User clicked "Cancel"
    bot.editMessageText("Operation cancelled.", {
      chat_id: chatId,
      message_id: callbackQuery.message?.message_id,
    });
  }

  // Always answer callback queries to remove loading state
  bot.answerCallbackQuery(callbackQuery.id);
});

// ACCOUNT CREATION HANDLER
// ========================
async function handleAccountCreation(
  chatId: number,
  telegramId: string,
  username: string | undefined,
  firstName: string | undefined,
  lastName: string | undefined,
  loginToken: string,
  messageId?: number
) {
  try {
    console.log(
      `🆕 Creating new account for Telegram user: ${firstName} (${telegramId})`
    );

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Create new user in database
    const user = await prisma.user.create({
      data: {
        email: `${telegramId}@telegram.local`, // Temporary email (you might want to ask for real email later)
        password: crypto.randomBytes(32).toString("hex"), // Random password since they're using Telegram auth
        name:
          `${firstName || ""} ${lastName || ""}`.trim() || `User_${telegramId}`,
        telegram_id: telegramId,
        telegram_username: username,
        otp_code: otp,
        otp_expires_at: otpExpiresAt,
        phone_verified: false, // They haven't provided phone yet
      },
    });

    // Store pending login information
    pendingLogins.set(loginToken, {
      telegramId,
      username,
      firstName,
      lastName,
      timestamp: Date.now(),
    });

    // Edit the previous message to show success and OTP
    bot.editMessageText(
      `🎉 *Account Created Successfully!*\n\nYour verification code is: \`${otp}\`\n\nPlease enter this code on the website to complete login.\n\n⚠️ This code expires in 5 minutes.`,
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "Markdown",
      }
    );

    console.log(
      `✅ Created new user: ${user.name} (${user.id}) with OTP: ${otp}`
    );
  } catch (error) {
    console.error("❌ Error creating account:", error);
    if (messageId) {
      bot.editMessageText("Failed to create account. Please try again.", {
        chat_id: chatId,
        message_id: messageId,
      });
    }
  }
}

// CLEANUP FUNCTION
// ================
// Remove expired pending logins every minute
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [token, data] of pendingLogins.entries()) {
    // Remove entries older than 10 minutes
    if (now - data.timestamp > 10 * 60 * 1000) {
      pendingLogins.delete(token);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned up ${cleanedCount} expired login tokens`);
  }
}, 60 * 1000); // Run every minute

// ERROR HANDLING
// ==============
bot.on("polling_error", (error) => {
  console.error("❌ Telegram Bot polling error:", error);
});

bot.on("error", (error) => {
  console.error("❌ Telegram Bot error:", error);
});

// STARTUP MESSAGE
// ===============
console.log("🤖 Telegram Bot started successfully!");
console.log("📱 Bot is now listening for messages...");

// Export for use in other files
export { bot, pendingLogins };
