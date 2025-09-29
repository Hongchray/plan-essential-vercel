"use client";

import { toast } from "sonner";
import { signIn } from "next-auth/react";
import TelegramLoginButton, { TelegramUser } from "telegram-login-button";

export default function TelegramLogin() {
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

  const handleTelegramResponse = async (user: TelegramUser) => {
    console.log("Telegram auth callback:", user);

    try {
      // Sign in via NextAuth and let it handle the redirect
      await signIn("telegram", {
        redirect: true, // ✅ Let NextAuth handle redirect
        authData: JSON.stringify(user), // Send Telegram data
        callbackUrl: "/dashboard", // Redirect after successful login
      });
    } catch (err) {
      console.error("Telegram auth error:", err);
      toast.error("Telegram authentication failed");
    }
  };

  if (!botUsername) {
    toast.error("Telegram bot username not configured");
    return null;
  }

  if (!botUsername.toLowerCase().endsWith("bot")) {
    toast.error("Invalid bot username format. It must end with 'bot'");
    return null;
  }

  return (
    <div className="flex justify-center">
      <TelegramLoginButton
        botName={botUsername}
        dataOnauth={handleTelegramResponse}
        buttonSize="large"
        requestAccess={true}
      />
    </div>
  );
}
