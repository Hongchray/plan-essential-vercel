"use client";

import * as React from "react";
import { UseFormReturn, FieldError } from "react-hook-form";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  XCircle,
  XIcon,
  ChevronDown,
  WandSparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";

// =====================
// Variants for badges
// =====================
const multiSelectVariants = cva("m-1 transition-all duration-300 ease-in-out", {
  variants: {
    variant: {
      default: "border-foreground/10 text-foreground bg-card hover:bg-card/80",
      secondary:
        "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      inverted: "inverted",
    },
    badgeAnimation: {
      bounce: "hover:-translate-y-1 hover:scale-110",
      pulse: "hover:animate-pulse",
      wiggle: "hover:animate-wiggle",
      fade: "hover:opacity-80",
      slide: "hover:translate-x-1",
      none: "",
    },
  },
  defaultVariants: {
    variant: "default",
    badgeAnimation: "bounce",
  },
});

// =====================
// Types
// =====================
export interface MultiSelectOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  style?: {
    badgeColor?: string;
    iconColor?: string;
    gradient?: string;
  };
}

export interface MultiSelectGroup {
  heading: string;
  options: MultiSelectOption[];
}

export interface AnimationConfig {
  badgeAnimation?: "bounce" | "pulse" | "wiggle" | "fade" | "slide" | "none";
  popoverAnimation?: "scale" | "slide" | "fade" | "flip" | "none";
  optionHoverAnimation?: "highlight" | "scale" | "glow" | "none";
  duration?: number;
  delay?: number;
}

// =====================
// RHF Props
// =====================
interface MultiSelectRHFProps
  extends Omit<VariantProps<typeof multiSelectVariants>, "badgeAnimation"> {
  options: MultiSelectOption[] | MultiSelectGroup[];
  form: UseFormReturn<any>;
  name: string;
  placeholder?: string;
  animation?: number;
  animationConfig?: AnimationConfig;
  maxCount?: number;
  singleLine?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  popoverClassName?: string;
  hideSelectAll?: boolean;
  label?: string;
}

// =====================
// MultiSelect Component
// =====================
export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectRHFProps
>(
  (
    {
      options,
      form,
      name,
      placeholder = "Select options",
      animation = 0,
      animationConfig,
      maxCount = 3,
      singleLine = false,
      searchable = true,
      disabled = false,
      popoverClassName,
      hideSelectAll = false,
      variant = "default",
      label = "",
      ...props
    },
    ref
  ) => {
    const {
      watch,
      setValue,
      formState: { errors },
    } = form;
    const value: string[] = watch(name) || [];
    const error = errors[name] as FieldError | undefined;

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");

    const multiSelectId = React.useId();
    const listboxId = `${multiSelectId}-listbox`;
    const triggerDescriptionId = `${multiSelectId}-description`;
    const selectedCountId = `${multiSelectId}-count`;

    const isGroupedOptions = React.useCallback(
      (
        opts: MultiSelectOption[] | MultiSelectGroup[]
      ): opts is MultiSelectGroup[] => {
        return opts.length > 0 && "heading" in opts[0];
      },
      []
    );

    const getAllOptions = React.useCallback(() => {
      if (options.length === 0) return [];
      if (isGroupedOptions(options)) return options.flatMap((g) => g.options);
      return options;
    }, [options, isGroupedOptions]);

    const getOptionByValue = React.useCallback(
      (val: string) => {
        return getAllOptions().find((o) => o.value === val);
      },
      [getAllOptions]
    );

    const toggleOption = (optionValue: string) => {
      if (disabled) return;
      const option = getOptionByValue(optionValue);
      if (option?.disabled) return;
      const newValues = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      setValue(name, newValues, { shouldValidate: true });
      // Remove closeOnSelect check since it's not defined in props interface
      setIsPopoverOpen(false);
    };

    const handleClear = () => {
      setValue(name, [], { shouldValidate: true });
    };

    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchValue) return options;
      if (isGroupedOptions(options)) {
        return options
          .map((g) => ({
            ...g,
            options: g.options.filter((o) =>
              o.label.toLowerCase().includes(searchValue.toLowerCase())
            ),
          }))
          .filter((g) => g.options.length > 0);
      }
      return options.filter((o) =>
        o.label.toLowerCase().includes(searchValue.toLowerCase())
      );
    }, [options, searchValue, searchable, isGroupedOptions]);

    const getBadgeAnimationClass = () => {
      if (!animationConfig?.badgeAnimation)
        return isAnimating ? "animate-bounce" : "";
      switch (animationConfig.badgeAnimation) {
        case "bounce":
          return isAnimating
            ? "animate-bounce"
            : "hover:-translate-y-1 hover:scale-110";
        case "pulse":
          return "hover:animate-pulse";
        case "wiggle":
          return "hover:animate-wiggle";
        case "fade":
          return "hover:opacity-80";
        case "slide":
          return "hover:translate-x-1";
        case "none":
          return "";
      }
    };

    return (
      <div className="space-y-2 w-full">
        <Label htmlFor={name}>{label}</Label>

        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              {...props}
              onClick={() => setIsPopoverOpen((prev) => !prev)}
              disabled={disabled}
              role="combobox"
              aria-expanded={isPopoverOpen}
              aria-haspopup="listbox"
              aria-controls={isPopoverOpen ? listboxId : undefined}
              aria-describedby={`${triggerDescriptionId} ${selectedCountId}`}
              className={cn(
                "flex p-1 w-full rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto",
                singleLine
                  ? "overflow-x-auto multiselect-singleline-scroll"
                  : "flex-wrap"
              )}
            >
              {value.length > 0 ? (
                <div className="flex items-center gap-1 flex-wrap">
                  {value.slice(0, maxCount).map((v) => {
                    const option = getOptionByValue(v);
                    if (!option) return null;
                    return (
                      <Badge
                        key={v}
                        className={cn(
                          getBadgeAnimationClass(),
                          multiSelectVariants({ variant })
                        )}
                        style={{ pointerEvents: "auto" }}
                      >
                        {option.label}
                        <XCircle
                          className="ml-1 h-3 w-3 cursor-pointer z-50"
                          style={{ pointerEvents: "auto" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleOption(v);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {value.length > maxCount && (
                    <Badge>{`+${value.length - maxCount} more`}</Badge>
                  )}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {placeholder}
                </span>
              )}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            className={cn("w-auto p-0", popoverClassName)}
          >
            <Command>
              {searchable && (
                <CommandInput
                  placeholder="Search..."
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
              )}
              <CommandList>
                {isGroupedOptions(filteredOptions)
                  ? filteredOptions.map((g) => (
                      <CommandGroup key={g.heading} heading={g.heading}>
                        {g.options.map((option) => {
                          const isSelected = value.includes(option.value);
                          return (
                            <CommandItem
                              key={option.value}
                              onSelect={() => toggleOption(option.value)}
                              aria-selected={isSelected}
                            >
                              <div
                                className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible"
                                )}
                              >
                                <CheckIcon className="h-4 w-4" />
                              </div>
                              {option.label}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    ))
                  : filteredOptions.map((option) => {
                      const isSelected = value.includes(option.value);
                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() => toggleOption(option.value)}
                          aria-selected={isSelected}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </div>
                          {option.label}
                        </CommandItem>
                      );
                    })}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {error && <p className="text-sm text-destructive">{error.message}</p>}
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
// export type { MultiSelectOption, MultiSelectGroup, AnimationConfig }
