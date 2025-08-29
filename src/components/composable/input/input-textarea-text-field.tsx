'use client'

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FieldError, UseFormReturn } from "react-hook-form"

interface TextareaFieldProps {
  label: string
  name: string
  placeholder?: string
  form: UseFormReturn<any>
  disabled?: boolean
  rows?: number
}

export function TextareaField({
  label,
  name,
  placeholder,
  form,
  disabled = false,
  rows = 4,
}: TextareaFieldProps) {
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
      <Textarea
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
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
