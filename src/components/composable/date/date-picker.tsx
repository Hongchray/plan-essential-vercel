'use client'

import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FieldError, UseFormReturn } from "react-hook-form"

interface DatePickerFieldProps {
  label: string
  name: string
  placeholder?: string
  form: UseFormReturn<any>
  disabled?: boolean
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }
  return format(date, "PPP")
}

function isValidDate(date: Date | undefined): date is Date {
  if (!date) {
    return false
  }
  return date instanceof Date && !isNaN(date.getTime())
}

export function DatePickerField({
  label,
  name,
  placeholder = "Select a date",
  form,
  disabled = false,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false)
  
  const {
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = form

  const error: FieldError | undefined = errors[name] as FieldError
  const watchedValue = watch(name)
  
  // Convert watched value to Date object if it's a string
  const selectedDate = watchedValue instanceof Date ? watchedValue : 
                      (watchedValue ? new Date(watchedValue) : undefined)

  const [inputValue, setInputValue] = useState(
    isValidDate(selectedDate) ? formatDate(selectedDate) : ""
  )
  
  // Set initial month to selected date or current date
  const [month, setMonth] = useState<Date>(
    isValidDate(selectedDate) ? selectedDate : new Date()
  )

  // Sync input value when form value changes externally
  useEffect(() => {
    if (isValidDate(selectedDate)) {
      const formatted = formatDate(selectedDate)
      if (inputValue !== formatted) {
        setInputValue(formatted)
      }
      if (month?.getTime() !== selectedDate.getTime()) {
        setMonth(selectedDate)
      }
    } else {
      if (inputValue !== "") {
        setInputValue("")
      }
    }
  }, [selectedDate]) 

  const handleDateSelect = (date: Date | undefined) => {
    setValue(name, date, { shouldValidate: true, shouldDirty: true })
    setInputValue(date && isValidDate(date) ? formatDate(date) : "")
    if (date && isValidDate(date)) {
      setMonth(date)
    }
    setOpen(false)
    // Trigger validation
    trigger(name)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    if (!value.trim()) {
      // Handle empty input
      setValue(name, undefined, { shouldValidate: true, shouldDirty: true })
      trigger(name)
      return
    }
    
    // Try to parse the input as a date
    const parsedDate = new Date(value)
    if (isValidDate(parsedDate)) {
      setValue(name, parsedDate, { shouldValidate: true, shouldDirty: true })
      setMonth(parsedDate)
      trigger(name)
    } else {
      // Set invalid value to trigger validation error
      setValue(name, value, { shouldValidate: true, shouldDirty: true })
      trigger(name)
    }
  }

  const handleInputBlur = () => {
    // On blur, if we have a valid selected date but input doesn't match, reset input
    if (isValidDate(selectedDate) && inputValue !== formatDate(selectedDate)) {
      setInputValue(formatDate(selectedDate))
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={name}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
          className="pr-10"
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0"
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={isValidDate(selectedDate) ? selectedDate : undefined}
              onSelect={handleDateSelect}
              month={month}
              onMonthChange={setMonth}
              captionLayout="dropdown"
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>
      {error && (
        <p className="text-sm text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}