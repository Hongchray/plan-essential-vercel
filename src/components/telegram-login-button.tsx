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
    console.log("Telegram auth callback triggered:", user);
    setIsLoading(true);

    try {
      const result = await signIn("telegram", {
        redirect: false,
        authData: JSON.stringify(user),
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        console.error("Telegram login error:", result.error);
        toast.error(`Telegram authentication failed: ${result.error}`);
      } else if (result?.ok) {
        toast.success("Successfully logged in with Telegram!");
        // Small delay to show success message
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1000);
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
    if (!botUsername.toLowerCase().endsWith("bot")) {
      toast.error(
        "Invalid bot username format. Bot username should end with 'bot'"
      );
      return;
    }

    console.log(`Using Bot Username: ${botUsername}`);
    setIsLoading(true);

    // Create backdrop
    const backdrop = document.createElement("div");
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Create modal container
    const container = document.createElement("div");
    container.style.cssText = `
      background-color: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      position: relative;
      max-width: 400px;
      width: 90%;
    `;

    // Create title
    const title = document.createElement("h3");
    title.textContent = "Login with Telegram";
    title.style.cssText = `
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
    `;

    // Create instructions
    const instructions = document.createElement("p");
    instructions.innerHTML = `
      <strong>Instructions:</strong><br>
      1. Make sure you have started the bot <strong>@${botUsername}</strong><br>
      2. Click the "Login" button below<br>
      3. You should receive a confirmation message in Telegram
    `;
    instructions.style.cssText = `
      margin-bottom: 20px;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    `;

    // Create close button
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "✕";
    closeBtn.style.cssText = `
      position: absolute;
      top: 15px;
      right: 15px;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #666;
    `;
    closeBtn.onclick = () => {
      document.body.removeChild(backdrop);
      setIsLoading(false);
    };

    // Create widget container
    const widgetContainer = document.createElement("div");
    widgetContainer.style.cssText = `
      text-align: center;
      margin-bottom: 20px;
    `;

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

    script.onload = () => {
      console.log("Telegram widget script loaded successfully");
    };

    // Create fallback link
    const fallbackLink = document.createElement("div");
    fallbackLink.style.cssText = `
      margin-top: 15px;
      text-align: center;
    `;

    const linkText = document.createElement("p");
    linkText.style.cssText = `
      font-size: 12px;
      color: #666;
      margin: 5px 0;
    `;
    linkText.textContent =
      "If the login button doesn't work, start the bot first:";

    const botLink = document.createElement("a");
    botLink.href = `https://t.me/${botUsername}`;
    botLink.target = "_blank";
    botLink.rel = "noopener noreferrer";
    botLink.textContent = `Start @${botUsername}`;
    botLink.style.cssText = `
      color: #0088cc;
      text-decoration: none;
      font-size: 14px;
      display: inline-block;
      margin-top: 5px;
    `;

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
      console.log("Closing modal and processing auth");
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
    }, 15000);
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
