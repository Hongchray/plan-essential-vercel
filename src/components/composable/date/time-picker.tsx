"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function TimePicker({
  value = "",
  onChange,
  placeholder,
  disabled = false,
  className,
  label,
}: TimePickerProps) {
  const { t } = useTranslation("common");
  const [open, setOpen] = React.useState(false);
  const [hours, setHours] = React.useState("05");
  const [minutes, setMinutes] = React.useState("00");
  const [period, setPeriod] = React.useState("PM");

  React.useEffect(() => {
    if (value) {
      const timeMatch = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (timeMatch) {
        setHours(timeMatch[1].padStart(2, "0"));
        setMinutes(timeMatch[2]);
        setPeriod(timeMatch[3]?.toUpperCase() || "AM");
      }
    }
  }, [value]);

  const handleTimeChange = (
    newHours: string,
    newMinutes: string,
    newPeriod: string
  ) => {
    const formattedTime = `${newHours}:${newMinutes} ${newPeriod}`;
    onChange?.(formattedTime);
    setOpen(false);
  };

  const generateOptions = (start: number, end: number, step = 1) =>
    Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) =>
      String(start + i * step).padStart(2, "0")
    );

  const hourOptions = generateOptions(1, 12);
  const minuteOptions = generateOptions(0, 59, 5);

  return (
    <div className="flex flex-col">
      {label && (
        <Label className="mb-3.5">
          {t(label)}
          <span className="text-rose-600">*</span>
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <Clock className="mr-2 h-4 w-4" />
            {value || t(placeholder || "component.time_picker.placeholder")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <div className="text-sm font-medium">
              {t("component.time_picker.select_time")}
            </div>
            <div className="flex items-center space-x-2">
              {/* Hours */}
              <div className="space-y-2">
                <Label className="text-xs">
                  {t("component.time_picker.hour")}
                </Label>
                <Select value={hours} onValueChange={setHours}>
                  <SelectTrigger className="h-9 w-18 text-sm">
                    <SelectValue />
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

              <div className="pt-6">:</div>

              {/* Minutes */}
              <div className="space-y-2">
                <Label className="text-xs">
                  {t("component.time_picker.minutes")}
                </Label>
                <Select value={minutes} onValueChange={setMinutes}>
                  <SelectTrigger className="h-9 w-18 text-sm">
                    <SelectValue />
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

              {/* AM/PM */}
              <div className="space-y-2">
                <Label className="text-xs">
                  {t("component.time_picker.period")}
                </Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="h-9 w-19 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">
                      {t("component.time_picker.am")}
                    </SelectItem>
                    <SelectItem value="PM">
                      {t("component.time_picker.pm")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                {t("component.time_picker.cancel")}
              </Button>
              <Button
                size="sm"
                onClick={() => handleTimeChange(hours, minutes, period)}
              >
                {t("component.time_picker.set_time")}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
