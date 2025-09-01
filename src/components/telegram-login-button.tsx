"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export default function TelegramLoginButton() {
  useEffect(() => {
    (window as any).onTelegramAuth = async (user: TelegramUser) => {
      console.log("Telegram auth callback:", user);

      try {
        // Sign in via NextAuth and let it handle the redirect
        await signIn("telegram", {
          redirect: true, // ✅ Let NextAuth handle redirect
          authData: JSON.stringify(user), // Send Telegram data
          callbackUrl: "/admin/dashboard", // Redirect after successful login
        });
      } catch (err) {
        console.error("Telegram auth error:", err);
        toast.error("Telegram authentication failed");
      }
    };
  }, []);

  useEffect(() => {
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

    if (!botUsername) {
      toast.error("Telegram bot username not configured");
      return;
    }

    if (!botUsername.toLowerCase().endsWith("bot")) {
      toast.error("Invalid bot username format. It must end with 'bot'");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;

    const container = document.getElementById("telegram-login-container");
    if (container) container.appendChild(script);

    return () => {
      if (container && script) container.removeChild(script);
    };
  }, []);

  return (
    <div className="flex justify-center">
      <div id="telegram-login-container"></div>
    </div>
  );
}
