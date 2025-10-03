"use client";

import { useForm } from "react-hook-form";
import { InputTextField } from "@/components/composable/input/input-text-field";
import { useState, useEffect, useCallback, useMemo } from "react";
import { SubmitButton } from "@/components/composable/button/submit-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextareaField } from "@/components/composable/input/input-textarea-text-field";
import { useParams, useRouter } from "next/navigation";
import {
  EditIcon,
  QrCode,
  Receipt,
  Check,
  ChevronsUpDown,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Guest } from "@/interfaces/guest";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor, getInitials } from "@/utils/avatar";
import { NoData } from "@/components/composable/no-data";
import { RequiredMark } from "@/components/composable/required-mark";
import { PlusIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Circle, CircleDot, CircleCheck } from "lucide-react";
import { CustomCurrencyInput } from "./components/custom-currency-input";
export function CreateEditGiftForm({
  id,
  onSelect,
}: {
  id: string;
  onSelect: (guest: any) => void;
}) {
  const params = useParams();
  const eventId = params.id;
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestsLoading, setGuestsLoading] = useState(false);
  const [guestSearchOpen, setGuestSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");

  const GiftFormSchema = z
    .object({
      guestId: z
        .string()
        .min(1, { message: t("gift.form.error_guest_required") }),
      note: z.string().nullable().optional(),
      payment_type: z.enum(["CASH", "KHQR"], {
        message: t("gift.form.error_payment_required"),
      }),
      currency_type: z.string().min(1, {
        message: t("gift.form.error_currency_required"),
      }),
      amount_khr: z.coerce.number().optional(),
      amount_usd: z.coerce.number().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.currency_type === "KHR") {
        if (!data.amount_khr || data.amount_khr <= 0) {
          ctx.addIssue({
            path: ["amount_khr"],
            code: "custom",
            message: t("gift.form.error_amount_required"),
          });
        }
      }

      if (data.currency_type === "USD") {
        if (!data.amount_usd || data.amount_usd <= 0) {
          ctx.addIssue({
            path: ["amount_usd"],
            code: "custom",
            message: t("gift.form.error_amount_required"),
          });
        }
      }
    });

  type GiftFormData = z.infer<typeof GiftFormSchema>;

  const form = useForm<GiftFormData>({
    resolver: zodResolver(GiftFormSchema),
    defaultValues: {
      guestId: "",
      note: "",
      payment_type: "CASH",
      currency_type: "USD",
      amount_khr: 0,
      amount_usd: 0,
    },
  });

  const fetchGuests = useCallback(
    async (search = "") => {
      setGuestsLoading(true);
      try {
        const searchParams = new URLSearchParams();
        searchParams.append("per_page", "100");
        if (search.trim()) {
          searchParams.append("search", search.trim());
        }

        const res = await fetch(
          `/api/admin/event/${eventId}/guest?${searchParams.toString()}`
        );
        const data = await res.json();
        setGuests(data.data || []);
      } catch (error) {
        console.error("Failed to fetch guests:", error);
        setGuests([]);
      } finally {
        setGuestsLoading(false);
      }
    },
    [eventId]
  );

  const debouncedSearch = useMemo(() => {
    const timeoutId = setTimeout(() => {
      if (dialogOpen) {
        fetchGuests(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchGuests, dialogOpen]);

  useEffect(() => {
    if (guestSearchOpen) {
      const cleanup = debouncedSearch;
      return cleanup;
    }
  }, [debouncedSearch, guestSearchOpen]);

  const editGift = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/event/${eventId}/gift/${id}`);
    const data = await res.json();
    if (data) {
      form.reset(data);
    }
    setLoading(false);
    return data;
  }, [id]);

  const onSubmit = async (values: GiftFormData) => {
    console.log(values);
    setLoading(true);
    if (id) {
      await fetch(`/api/admin/event/${eventId}/gift/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
    } else {
      await fetch(`/api/admin/event/${eventId}/gift`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
    }
    setLoading(false);
    setDialogOpen(false);
    form.reset();
    router.refresh();
  };

  useEffect(() => {
    if (id && dialogOpen) {
      editGift();
    }
    if (dialogOpen && !searchQuery) {
      fetchGuests();
    }
  }, [dialogOpen]);

  const selectedGuest = useMemo(() => {
    return guests.find((guest) => guest.id === form.watch("guestId"));
  }, [guests, form.watch("guestId")]);

  const handleGuestSelect = (guest: Guest) => {
    form.setValue("guestId", guest.id, { shouldValidate: true });
    setSearchQuery(""); // clear search
    setOpen(false); // close popover
  };

  // Debounced query
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch guests whenever debouncedQuery changes
  useEffect(() => {
    if (guestSearchOpen) {
      fetchGuests(debouncedQuery);
    }
  }, [debouncedQuery, guestSearchOpen, fetchGuests]);

  // Client-side filtering for better UX
  const filteredGuests = useMemo(() => {
    if (!debouncedQuery) return guests;

    const query = debouncedQuery.toLowerCase();
    return guests.filter(
      (guest) =>
        guest.name?.toLowerCase().includes(query) ||
        guest.phone?.toLowerCase().includes(query) ||
        guest.address?.toLowerCase().includes(query) ||
        guest.email?.toLowerCase().includes(query)
    );
  }, [guests, debouncedQuery]);

  // Input handler
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <>
      <div className="space-y-4 = rounded-lg">
        {/* Trigger Button */}
        {id ? (
          <Button
            size="icon"
            variant="outline"
            onClick={() => setDialogOpen(true)}
            className="cursor-pointer"
          >
            <EditIcon />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="cursor-pointer"
          >
            <PlusIcon />
            {t("gift.form.addNew")}
          </Button>
        )}

        {/* Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
          <DialogContent className="max-w-xl sm:max-w-3xl p-0 ">
            <DialogHeader className="p-8">
              <DialogTitle>
                {id ? t("gift.form.editTitle") : t("gift.form.addTitle")}
              </DialogTitle>
              <DialogDescription>
                {t("gift.form.description")}
              </DialogDescription>
            </DialogHeader>

            {/* Scrollable form */}
            <ScrollArea className="max-h-[80vh] p-4">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:divide-x sm:divide-gray-300">
                  {/* Guest Selection */}
                  <div className="space-y-2 px-4">
                    <Label htmlFor="guest-select">
                      {t("gift.form.guest")} <RequiredMark />
                    </Label>

                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="flex justify-between w-full cursor-pointer"
                        >
                          {selectedGuest ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                {selectedGuest.image ? (
                                  <AvatarImage src={selectedGuest.image} />
                                ) : (
                                  <AvatarFallback className="text-xs font-bold">
                                    {selectedGuest.name
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <span className="truncate">
                                {selectedGuest.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              {t("gift.form.search_guest")}
                            </span>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-96">
                        <Command shouldFilter={false}>
                          <CommandInput
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            placeholder={t("gift.form.search_guest")}
                          />
                          <CommandList
                            className="max-h-60 overflow-y-auto"
                            onWheel={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <CommandEmpty>
                              {t("gift.form.no_guest_found")}
                            </CommandEmpty>
                            <CommandGroup>
                              {filteredGuests.map((guest) => (
                                <CommandItem
                                  key={guest.id}
                                  value={guest.name}
                                  onSelect={() => {
                                    handleGuestSelect(guest);
                                    onSelect?.(guest);
                                    setOpen(false);
                                  }}
                                  className={cn(
                                    "border mt-1",
                                    selectedGuest?.id === guest.id
                                      ? "!bg-rose-50 !hover:bg-rose-50 !text-primary !hover:text-primary border-rose-500 border-2"
                                      : " "
                                  )}
                                >
                                  <div className="flex items-center gap-3 py-2">
                                    {" "}
                                    {/* add some vertical padding */}
                                    <CircleCheck
                                      className={cn(
                                        "h-4 w-4 mt-0.5",
                                        selectedGuest?.id === guest.id
                                          ? "opacity-100 text-primary"
                                          : "opacity-0"
                                      )}
                                    />
                                    <Avatar className="h-8 w-8">
                                      {guest.image ? (
                                        <AvatarImage src={guest.image} />
                                      ) : (
                                        <AvatarFallback className="font-bold text-[12px]">
                                          {guest.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                      )}
                                    </Avatar>
                                    <div className="flex flex-col gap-1 min-w-0">
                                      <span className="font-medium text-sm">
                                        {guest.name}
                                      </span>
                                      <div className="flex gap-1 flex-wrap text-xs text-muted-foreground">
                                        {guest.guestGroup?.map((gg) => (
                                          <Badge
                                            key={gg.id}
                                            variant="default"
                                            className="text-[10px] px-2 py-0.5"
                                          >
                                            {gg.group?.name_kh}
                                          </Badge>
                                        ))}
                                        {guest.guestTag?.map((gt) => (
                                          <Badge
                                            key={gt.id}
                                            variant="secondary"
                                            className="text-[10px] px-2 py-0.5"
                                          >
                                            {gt.tag?.name_kh}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Error */}
                    {form.formState.errors.guestId && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.guestId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 sm:p-0 p-4">
                    {/* Payment Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        {t("gift.form.payment_type")}
                        <RequiredMark />
                      </Label>

                      <RadioGroup
                        value={form.watch("payment_type")}
                        onValueChange={(value) =>
                          form.setValue(
                            "payment_type",
                            value as "CASH" | "KHQR"
                          )
                        }
                        className="flex flex-wrap gap-3"
                      >
                        {[
                          {
                            type: "CASH",
                            label: "Cash",
                            icon: <Receipt size={28} />,
                          },
                          {
                            type: "KHQR",
                            label: "KHQR",
                            icon: <QrCode size={28} />,
                          },
                        ].map(({ type, label, icon }) => (
                          <Label
                            key={type}
                            htmlFor={type}
                            className={cn(
                              "cursor-pointer rounded-lg border-2 px-4 py-2",
                              "inline-flex items-center gap-2",
                              "transition-colors duration-200",
                              "hover:bg-accent/50",
                              "has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/5",
                              "dark:has-[[aria-checked=true]]:border-primary-900 dark:has-[[aria-checked=true]]:bg-primary-950"
                            )}
                          >
                            <RadioGroupItem
                              value={type}
                              id={type}
                              className="hidden"
                            />
                            <div className="text-muted-foreground">{icon}</div>
                            <span className="text-sm font-medium">{label}</span>
                          </Label>
                        ))}
                      </RadioGroup>

                      {form.formState.errors.payment_type && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.payment_type.message}
                        </p>
                      )}
                    </div>

                    {/* Currency Type */}
                    <div className="w-full max-w-md space-y-2">
                      <Label className="text-sm font-medium">
                        {t("gift.form.currency_type")} <RequiredMark />
                      </Label>

                      <RadioGroup
                        value={form.watch("currency_type")}
                        onValueChange={(value) =>
                          form.setValue("currency_type", value as "USD" | "KHR")
                        }
                        className="gap-4 flex flex-wrap"
                      >
                        {[
                          {
                            id: "USD",
                            label: t("gift.form.Dollar"),
                            desc: "US Dollar",
                          },
                          {
                            id: "KHR",
                            label: t("gift.form.Riel"),
                            desc: "Cambodian Riel",
                          },
                        ].map((currency) => (
                          <Label
                            key={currency.id}
                            htmlFor={currency.id}
                            className={cn(
                              "cursor-pointer rounded-xl border-2 p-3 min-w-[150px]",
                              "flex items-center gap-3 transition-all",
                              "hover:bg-accent/50",
                              "has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/5",
                              "dark:has-[[aria-checked=true]]:border-primary-900 dark:has-[[aria-checked=true]]:bg-primary-950"
                            )}
                          >
                            <RadioGroupItem
                              value={currency.id}
                              id={currency.id}
                              className="sr-only"
                            />

                            <span className="flex items-center gap-2">
                              {/* Radio icon state */}
                              <RadioGroupItem
                                value={currency.id}
                                id={currency.id}
                                className="peer hidden"
                              />
                              <span className="text-primary peer-aria-checked:block hidden">
                                <CircleCheck size={18} />
                              </span>
                              <span className="peer-aria-checked:hidden block text-muted-foreground">
                                <Circle size={18} />
                              </span>

                              {/* Label text */}
                              <span className="text-sm font-semibold">
                                {currency.label}
                              </span>
                            </span>
                          </Label>
                        ))}
                      </RadioGroup>

                      {form.formState.errors.currency_type && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.currency_type.message}
                        </p>
                      )}
                    </div>

                    {/* Amount & Note */}
                    {form.watch("currency_type") === "KHR" && (
                      <CustomCurrencyInput
                        label={t("gift.form.amount") + " (៛)"}
                        name="amount_khr"
                        placeholder={t("gift.form.amount_placeholder")}
                        currency="KHR"
                        form={form}
                        disabled={loading}
                      />
                    )}

                    {form.watch("currency_type") === "USD" && (
                      <CustomCurrencyInput
                        label={t("gift.form.amount") + " ($)"}
                        name="amount_usd"
                        placeholder={t("gift.form.amount_placeholder")}
                        currency="USD"
                        form={form}
                        disabled={loading}
                      />
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        {t("gift.form.note")}
                      </label>

                      <textarea
                        {...form.register("note")}
                        placeholder={t("gift.form.note_placeholder")}
                        disabled={loading}
                        className={cn(
                          "w-full resize-none border-0 border-b-2 border-border bg-transparent py-2 px-0 text-sm outline-none",
                          "focus:border-blue-600 focus:ring-0",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                        rows={4}
                      />

                      {form.formState.errors.note && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.note?.message as string}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dialog Footer */}
                <DialogFooter className="pb-4">
                  <div className="flex gap-2 justify-end pt-2 p-4">
                    <Button
                      variant="outline"
                      type="button"
                      className="cursor-pointer"
                      onClick={() => {
                        form.reset();
                        setDialogOpen(false);
                      }}
                    >
                      <X />
                      {t("gift.form.cancel")}
                    </Button>
                    <SubmitButton loading={loading} entityId={id} />
                  </div>
                </DialogFooter>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
