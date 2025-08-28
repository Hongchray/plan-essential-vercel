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
        authData: user,
      });

      if (result?.error) {
        console.error("Telegram login error:", result.error);
        toast.error("Telegram authentication failed");
      } else {
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
    setIsLoading(true);

    // Create Telegram login widget dynamically
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute(
      "data-telegram-login",
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ""
    );
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;

    // Create temporary container
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.zIndex = "9999";
    container.style.backgroundColor = "white";
    container.style.padding = "20px";
    container.style.borderRadius = "8px";
    container.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "✕";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.background = "none";
    closeBtn.style.border = "none";
    closeBtn.style.fontSize = "20px";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => {
      document.body.removeChild(container);
      setIsLoading(false);
    };

    container.appendChild(closeBtn);
    container.appendChild(script);
    document.body.appendChild(container);

    // Clean up on successful auth
    const originalCallback = (window as any).onTelegramAuth;
    (window as any).onTelegramAuth = (user: TelegramUser) => {
      document.body.removeChild(container);
      originalCallback(user);
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
