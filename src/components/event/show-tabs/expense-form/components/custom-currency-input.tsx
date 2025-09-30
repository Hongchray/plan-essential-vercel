"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { RequiredMark } from "@/components/composable/required-mark";

interface CustomCurrencyInputProps {
  label: string;
  name: string;
  form: UseFormReturn<any>;
  currency?: "USD" | "KHR";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean; // 👈 make sure this is here
  className?: string;
}

export const CustomCurrencyInput: React.FC<CustomCurrencyInputProps> = ({
  label,
  name,
  form,
  currency = "USD",
  placeholder = "0.00",
  disabled = false,
  required = false,
  className,
}) => {
  const value = form.watch(name) ?? 0;
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  const currencySymbol = currency === "USD" ? "$" : "៛";

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9.]/g, "");
    setInputValue(cleaned);
    const numericValue = parseFloat(cleaned) || 0;
    form.setValue(name, numericValue, { shouldValidate: true });
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-muted-foreground">
        {label} {required && <RequiredMark />}
      </label>

      <div
        className={cn(
          "relative flex items-center border-b-2 transition-colors",
          isFocused ? "border-blue-600" : "border-border",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className="absolute left-0 pl-2 text-2xl font-bold text-muted-foreground">
          {currencySymbol}
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full pl-7 py-2 text-2xl text-blue-600 font-semibold outline-none bg-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      </div>

      {form.formState.errors[name] && (
        <p className="text-sm text-destructive">
          {form.formState.errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};
