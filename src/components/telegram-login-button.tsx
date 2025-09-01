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
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

    if (!botUsername) {
      toast.error("Telegram bot username not configured");
      return;
    }

    // Validate bot username format
    if (!botUsername.endsWith("_bot")) {
      toast.error(
        "Invalid bot username format. Bot username should end with '_bot'"
      );
      return;
    }

    console.log(`Using Bot Username: ${botUsername}`);
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

    // Create instructions
    const instructions = document.createElement("p");
    instructions.innerHTML = `
      <strong>Instructions:</strong><br>
      1. Make sure you have started the bot <strong>@${botUsername}</strong><br>
      2. Click the "Login" button below<br>
      3. You should receive a confirmation message in Telegram
    `;
    instructions.style.marginBottom = "20px";
    instructions.style.fontSize = "14px";
    instructions.style.color = "#666";
    instructions.style.lineHeight = "1.5";

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

    // Create widget container
    const widgetContainer = document.createElement("div");
    widgetContainer.style.textAlign = "center";
    widgetContainer.style.marginBottom = "20px";

    // Create Telegram widget script
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;

    // Add error handling for script loading
    script.onerror = () => {
      toast.error("Failed to load Telegram widget. Please try again.");
      document.body.removeChild(backdrop);
      setIsLoading(false);
    };

    // Create fallback link
    const fallbackLink = document.createElement("div");
    fallbackLink.style.marginTop = "15px";
    fallbackLink.style.textAlign = "center";

    const botLink = document.createElement("a");
    botLink.href = `https://t.me/${botUsername}`;
    botLink.target = "_blank";
    botLink.rel = "noopener noreferrer";
    botLink.textContent = `Start @${botUsername}`;
    botLink.style.color = "#0088cc";
    botLink.style.textDecoration = "none";
    botLink.style.fontSize = "14px";

    const linkText = document.createElement("p");
    linkText.style.fontSize = "12px";
    linkText.style.color = "#666";
    linkText.style.marginTop = "5px";
    linkText.textContent =
      "If the login button doesn't work, start the bot first:";

    fallbackLink.appendChild(linkText);
    fallbackLink.appendChild(botLink);

    // Assemble modal
    container.appendChild(closeBtn);
    container.appendChild(title);
    container.appendChild(instructions);

    widgetContainer.appendChild(script);
    container.appendChild(widgetContainer);
    container.appendChild(fallbackLink);

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

    // Set timeout to reset loading state if widget doesn't load
    setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 10000);
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
