"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  format?: "12" | "24"
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TimePicker({
  value = "",
  onChange,
  format = "12",
  placeholder = "Select time",
  disabled = false,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [hours, setHours] = React.useState("")
  const [minutes, setMinutes] = React.useState("")
  const [period, setPeriod] = React.useState("AM")

  // Parse initial value
  React.useEffect(() => {
    if (value) {
      const [time, periodPart] = value.split(" ")
      const [h, m] = time.split(":")

      if (format === "12" && periodPart) {
        setHours(h)
        setMinutes(m)
        setPeriod(periodPart)
      } else if (format === "24") {
        setHours(h)
        setMinutes(m)
      }
    }
  }, [value, format])

  const formatTime = (h: string, m: string, p?: string) => {
    if (!h || !m) return ""

    const formattedHours = h.padStart(2, "0")
    const formattedMinutes = m.padStart(2, "0")

    if (format === "12" && p) {
      return `${formattedHours}:${formattedMinutes} ${p}`
    }
    return `${formattedHours}:${formattedMinutes}`
  }

  const handleTimeChange = (newHours?: string, newMinutes?: string, newPeriod?: string) => {
    const h = newHours ?? hours
    const m = newMinutes ?? minutes
    const p = newPeriod ?? period

    if (h && m) {
      const timeString = formatTime(h, m, format === "12" ? p : undefined)
      onChange?.(timeString)
    }
  }

  const handleHoursChange = (value: string) => {
    setHours(value)
    handleTimeChange(value, minutes, period)
  }

  const handleMinutesChange = (value: string) => {
    setMinutes(value)
    handleTimeChange(hours, value, period)
  }

  const handlePeriodChange = (value: string) => {
    setPeriod(value)
    handleTimeChange(hours, minutes, value)
  }

  const displayValue = value || placeholder

  // Generate hour options
  const hourOptions =
    format === "12"
      ? Array.from({ length: 12 }, (_, i) => (i + 1).toString())
      : Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))

  // Generate minute options
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", className)}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium">Select Time</div>
          <div className="flex items-center space-x-2">
            <div className="space-y-2">
              <Label htmlFor="hours" className="text-xs">
                Hours
              </Label>
              <Select value={hours} onValueChange={handleHoursChange}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent>
                  {hourOptions.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6 text-xl font-bold">:</div>

            <div className="space-y-2">
              <Label htmlFor="minutes" className="text-xs">
                Minutes
              </Label>
              <Select value={minutes} onValueChange={handleMinutesChange}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent>
                  {minuteOptions.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {format === "12" && (
              <div className="space-y-2">
                <Label htmlFor="period" className="text-xs">
                  Period
                </Label>
                <Select value={period} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setHours("")
                setMinutes("")
                setPeriod("AM")
                onChange?.("")
                setOpen(false)
              }}
            >
              Clear
            </Button>
            <Button size="sm" onClick={() => setOpen(false)} disabled={!hours || !minutes}>
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Alternative input-based time picker
interface TimeInputProps {
  value?: string
  onChange?: (time: string) => void
  format?: "12" | "24"
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TimeInput({
  value = "",
  onChange,
  format = "12",
  placeholder = "HH:MM",
  disabled = false,
  className,
}: TimeInputProps) {
  const [inputValue, setInputValue] = React.useState(value)

  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Validate and format the time
    const timeRegex = format === "12" ? /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i : /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

    if (timeRegex.test(newValue) || newValue === "") {
      onChange?.(newValue)
    }
  }

  const handleBlur = () => {
    // Auto-format on blur if valid partial input
    if (inputValue && !inputValue.includes(":")) {
      // Handle cases like "9" -> "09:00"
      if (inputValue.length <= 2) {
        const hour = Number.parseInt(inputValue)
        if (hour >= 1 && hour <= (format === "12" ? 12 : 23)) {
          const formatted =
            format === "12" ? `${hour.toString().padStart(2, "0")}:00 AM` : `${hour.toString().padStart(2, "0")}:00`
          setInputValue(formatted)
          onChange?.(formatted)
        }
      }
    }
  }

  return (
    <div className="relative">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={format === "12" ? "HH:MM AM/PM" : "HH:MM"}
        disabled={disabled}
        className={cn("pl-10", className)}
      />
      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
