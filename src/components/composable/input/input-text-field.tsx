'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldError, UseFormReturn } from "react-hook-form"

interface InputFieldProps {
  label: string
  name: string
  placeholder?: string
  form: UseFormReturn<any>
  disabled?: boolean
  type?: string
}

export function InputTextField({
  label,
  name,
  placeholder,
  form,
  disabled = false,
  type = "text",
}: InputFieldProps) {
  const {
    register,
    formState: { errors },
  } = form

  const error: FieldError | undefined = errors[name] as FieldError

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
      />
      {error && (
        <p className="text-sm text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}
