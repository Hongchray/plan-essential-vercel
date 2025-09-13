"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError, UseFormReturn } from "react-hook-form";

interface SelectFieldProps {
  label: string;
  name: string;
  options: { label: string; value: string | number }[];
  form: UseFormReturn<any>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SelectField({
  label,
  name,
  options,
  form,
  placeholder = "Select...",
  disabled = false,
  className = "", // default empty string
}: SelectFieldProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const value = watch(name) || "";
  const error: FieldError | undefined = errors[name] as FieldError;

  return (
    <div className={`space-y-2 w-full ${className}`}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Select
        value={value}
        onValueChange={(val) => setValue(name, val)}
        disabled={disabled}
        {...register(name)}
      >
        <SelectTrigger className="w-full border rounded-md p-2">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="w-full">
          {options.map((opt) => (
            <SelectItem key={opt.value.toString()} value={opt.value.toString()}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
