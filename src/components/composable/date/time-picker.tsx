"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface SimpleTimePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TimePicker({
  value = "",
  onChange,
  placeholder = "Select time",
  disabled = false,
  className,
}: SimpleTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [hours, setHours] = React.useState("12")
  const [minutes, setMinutes] = React.useState("00")
  const [period, setPeriod] = React.useState("AM")

  // Parse existing value when component mounts or value changes
  React.useEffect(() => {
    if (value) {
      const timeMatch = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
      if (timeMatch) {
        setHours(timeMatch[1].padStart(2, "0"))
        setMinutes(timeMatch[2])
        setPeriod(timeMatch[3]?.toUpperCase() || "AM")
      }
    }
  }, [value])

  const handleTimeChange = (newHours: string, newMinutes: string, newPeriod: string) => {
    const formattedTime = `${newHours}:${newMinutes} ${newPeriod}`
    onChange?.(formattedTime)
    setOpen(false)
  }

  const generateOptions = (start: number, end: number, step = 1) => {
    const options = []
    for (let i = start; i <= end; i += step) {
      options.push(i.toString().padStart(2, "0"))
    }
    return options
  }

  const hourOptions = generateOptions(1, 12)
  const minuteOptions = generateOptions(0, 59, 5) // 5-minute intervals

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", className)}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium">Select Time</div>
          <div className="flex items-center space-x-2">
            {/* Hours */}
            <div className="space-y-2">
              <Label className="text-xs">Hour</Label>
              <select
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="flex h-9 w-16 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-6">:</div>

            {/* Minutes */}
            <div className="space-y-2">
              <Label className="text-xs">Min</Label>
              <select
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="flex h-9 w-16 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>

            {/* AM/PM */}
            <div className="space-y-2">
              <Label className="text-xs">Period</Label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="flex h-9 w-16 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => handleTimeChange(hours, minutes, period)}>
              Set Time
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Simple input-based time picker
export function SimpleTimeInput({
  value = "",
  onChange,
  placeholder = "HH:MM AM/PM",
  disabled = false,
  className,
}: SimpleTimePickerProps) {
  const [inputValue, setInputValue] = React.useState(value)

  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleBlur = () => {
    // Basic validation and formatting
    const timeMatch = inputValue.match(/^(\d{1,2}):?(\d{2})?\s*(AM|PM)?$/i)
    if (timeMatch) {
      const hours = timeMatch[1].padStart(2, "0")
      const minutes = (timeMatch[2] || "00").padStart(2, "0")
      const period = timeMatch[3]?.toUpperCase() || "AM"

      if (Number.parseInt(hours) >= 1 && Number.parseInt(hours) <= 12 && Number.parseInt(minutes) <= 59) {
        const formattedTime = `${hours}:${minutes} ${period}`
        setInputValue(formattedTime)
        onChange?.(formattedTime)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur()
    }
  }

  return (
    <div className="relative">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn("pl-10", className)}
      />
      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
