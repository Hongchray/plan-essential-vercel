"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PasswordInputProps {
  label?: string; // optional override
  id?: string;
  placeholder?: string; // optional override
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export function PasswordInput({
  label,
  id = "password",
  placeholder,
  value,
  onChange,
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col gap-1 relative">
      <Label htmlFor={id}>{label || t("component.password")}</Label>

      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder || t("component.enter_password")}
          value={value}
          onChange={onChange}
          className="pr-10"
        />

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
