import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Generate unique login token
    const loginToken = crypto.randomBytes(32).toString("hex");

    // 🔥 THIS IS WHERE BOT USERNAME IS NEEDED
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME; // e.g., "myapp_login_bot"

    if (!botUsername) {
      return res.status(500).json({ error: "Bot username not configured" });
    }

    // Create Telegram deep link
    // Format: https://t.me/BOT_USERNAME?start=LOGIN_TOKEN
    const telegramUrl = `https://t.me/${botUsername}?start=${loginToken}`;

    console.log(`Generated Telegram URL: ${telegramUrl}`);

    res.status(200).json({
      success: true,
      telegramUrl,
      loginToken,
    });
  } catch (error) {
    console.error("Telegram login error:", error);
    res.status(500).json({ error: "Failed to generate Telegram login" });
  }
}
