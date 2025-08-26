'use client'

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FieldError, UseFormReturn } from "react-hook-form"

interface SwitchFieldProps {
  label: string
  name: string
  form: UseFormReturn<any>
  disabled?: boolean
  trueValue?: string | number | boolean
  falseValue?: string | number | boolean
}

export function SwitchField({
  label,
  name,
  form,
  disabled = false,
  trueValue = true,
  falseValue = false,
}: SwitchFieldProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form

  const currentValue = watch(name)
  const checked = currentValue === trueValue
  const error: FieldError | undefined = errors[name] as FieldError

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center justify-between text-sm font-medium">
        {label}
      </Label>
         <Switch
          id={name}
          checked={checked}
          disabled={disabled}
          onCheckedChange={(isChecked) =>
            setValue(name, isChecked ? trueValue : falseValue)
          }
        />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  )
}