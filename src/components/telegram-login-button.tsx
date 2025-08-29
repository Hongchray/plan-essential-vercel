"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export function TelegramLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleTelegramAuth = async (user: TelegramUser) => {
    setIsLoading(true);

    try {
      const result = await signIn("telegram", {
        redirect: false,
        authData: JSON.stringify(user),
      });

      if (result?.error) {
        console.error("Telegram login error:", result.error);
        toast.error("Telegram authentication failed");
      } else if (result?.ok) {
        toast.success("Successfully logged in with Telegram!");
        window.location.href = "/admin/dashboard";
      }
    } catch (error) {
      console.error("Telegram auth error:", error);
      toast.error("An error occurred during Telegram authentication");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Set global callback function
    (window as any).onTelegramAuth = handleTelegramAuth;

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, []);

  const initTelegramLogin = () => {
    if (!process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME) {
      toast.error("Telegram bot username not configured");
      return;
    }

    setIsLoading(true);

    // Create backdrop
    const backdrop = document.createElement("div");
    backdrop.style.position = "fixed";
    backdrop.style.top = "0";
    backdrop.style.left = "0";
    backdrop.style.width = "100%";
    backdrop.style.height = "100%";
    backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    backdrop.style.zIndex = "9998";
    backdrop.style.display = "flex";
    backdrop.style.alignItems = "center";
    backdrop.style.justifyContent = "center";

    // Create modal container
    const container = document.createElement("div");
    container.style.backgroundColor = "white";
    container.style.padding = "30px";
    container.style.borderRadius = "12px";
    container.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
    container.style.position = "relative";
    container.style.maxWidth = "400px";
    container.style.width = "90%";

    // Create title
    const title = document.createElement("h3");
    title.textContent = "Login with Telegram";
    title.style.marginBottom = "20px";
    title.style.fontSize = "18px";
    title.style.fontWeight = "600";
    title.style.textAlign = "center";

    // Create close button
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "✕";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "15px";
    closeBtn.style.right = "15px";
    closeBtn.style.background = "none";
    closeBtn.style.border = "none";
    closeBtn.style.fontSize = "20px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.color = "#666";
    closeBtn.onclick = () => {
      document.body.removeChild(backdrop);
      setIsLoading(false);
    };

    // Create Telegram widget
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute(
      "data-telegram-login",
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
    );
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;

    // Assemble modal
    container.appendChild(closeBtn);
    container.appendChild(title);
    container.appendChild(script);
    backdrop.appendChild(container);
    document.body.appendChild(backdrop);

    // Override callback to close modal on success
    const originalCallback = (window as any).onTelegramAuth;
    (window as any).onTelegramAuth = (user: TelegramUser) => {
      document.body.removeChild(backdrop);
      originalCallback(user);
    };

    // Close modal on backdrop click
    backdrop.onclick = (e) => {
      if (e.target === backdrop) {
        document.body.removeChild(backdrop);
        setIsLoading(false);
      }
    };
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      type="button"
      disabled={isLoading}
      onClick={initTelegramLogin}
    >
      {isLoading && <Loader2 className="animate-spin mr-2" />}
      <Image
        src="/telegram-icon-free-png.webp"
        alt="Telegram"
        width={20}
        height={20}
        className="mr-2"
      />
      Continue with Telegram
    </Button>
  );
}
