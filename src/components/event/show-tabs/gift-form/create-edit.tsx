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
} from "lucide-react";
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

export function CreateEditGiftForm({ id }: { id: string }) {
  const params = useParams();
  const eventId = params.id;
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestsLoading, setGuestsLoading] = useState(false);
  const [guestSearchOpen, setGuestSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { t } = useTranslation("common");

  const GiftFormSchema = z.object({
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
    amount: z.coerce
      .number()
      .min(0.01, { message: t("gift.form.error_amount_required") }),
  });

  type GiftFormData = z.infer<typeof GiftFormSchema>;

  const form = useForm<GiftFormData>({
    resolver: zodResolver(GiftFormSchema),
    defaultValues: {
      guestId: "",
      note: "",
      payment_type: "CASH",
      currency_type: "USD",
      amount: 0,
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
    form.setValue("guestId", guest.id);
    setGuestSearchOpen(false);
    setSearchQuery(""); // Clear search after selection
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
      {/* Trigger Button */}
      {id ? (
        <Button
          size="icon"
          variant="outline"
          onClick={() => setDialogOpen(true)}
        >
          <EditIcon />
        </Button>
      ) : (
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          {t("gift.form.addNew")}
        </Button>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {id ? t("gift.form.editTitle") : t("gift.form.addTitle")}
            </DialogTitle>
            <DialogDescription>{t("gift.form.description")}</DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Guest Selection */}
              <div className="space-y-2">
                <Label htmlFor="guest-select">{t("gift.form.guest")} *</Label>
                <Popover
                  open={guestSearchOpen}
                  onOpenChange={setGuestSearchOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={guestSearchOpen}
                      className="w-full justify-between"
                      disabled={loading || guestsLoading}
                    >
                      {selectedGuest ? (
                        <div className="flex items-center gap-2 truncate">
                          <span className="truncate font-medium">
                            {selectedGuest.name}
                          </span>
                          {(selectedGuest.phone || selectedGuest.address) && (
                            <span className="text-muted-foreground text-sm truncate">
                              ({selectedGuest.phone || selectedGuest.address})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {guestsLoading
                            ? "Loading guests..."
                            : "Select guest..."}
                        </span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0" align="start">
                    <Command shouldFilter={false}>
                      <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <CommandInput
                          placeholder="Search by name, phone, or address..."
                          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          value={searchQuery}
                          onValueChange={handleSearchChange}
                        />
                      </div>

                      <CommandList className="max-h-[300px] overflow-y-auto">
                        <CommandEmpty>
                          {guestsLoading ? (
                            <div className="py-6 text-center text-sm">
                              <div className="flex items-center justify-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground"></div>
                                Loading guests...
                              </div>
                            </div>
                          ) : (
                            <div className="py-6 text-center text-sm">
                              No guests found.
                              {searchQuery && (
                                <div className="mt-1 text-xs text-muted-foreground">
                                  Try searching with different terms
                                </div>
                              )}
                            </div>
                          )}
                        </CommandEmpty>

                        <CommandGroup>
                          {filteredGuests.map((guest) => (
                            <CommandItem
                              key={guest.id}
                              value={`${guest.name} ${guest.email || ""} ${
                                guest.phone || ""
                              } ${guest.address || ""}`}
                              onSelect={() => handleGuestSelect(guest)}
                              className="flex items-start gap-3 p-3 cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "h-4 w-4 mt-0.5 flex-shrink-0",
                                  selectedGuest?.id === guest.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col gap-1 min-w-0 flex-1">
                                <span className="font-medium text-sm">
                                  {guest.name}
                                </span>
                                <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                                  {guest.phone && (
                                    <span className="flex items-center gap-1">
                                      {guest.phone}
                                    </span>
                                  )}
                                  {guest.email && (
                                    <span className="flex items-center gap-1">
                                      {guest.email}
                                    </span>
                                  )}
                                  {guest.address && (
                                    <span className="flex items-center gap-1">
                                      {guest.address}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {form.formState.errors.guestId && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.guestId.message}
                  </p>
                )}
              </div>

              {/* Payment Type */}
              <div className="space-y-2">
                <Label>{t("gift.form.payment_type")}</Label>
                <RadioGroup
                  value={form.watch("payment_type")}
                  onValueChange={(value) =>
                    form.setValue("payment_type", value as "CASH" | "KHQR")
                  }
                  className="flex gap-4"
                >
                  {["CASH", "KHQR"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border-2 p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-rose-50 dark:has-[[aria-checked=true]]:border-primary-900 dark:has-[[aria-checked=true]]:bg-primary-950 cursor-pointer">
                        <RadioGroupItem
                          value={type}
                          id={type}
                          className="hidden data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-primary dark:data-[state=checked]:bg-primary"
                        />
                        <div className="grid gap-1.5 font-normal">
                          <p className="text-xl leading-none font-bold">
                            {type === "CASH" ? "Cash" : "KHQR"}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {type === "CASH" ? (
                              <Receipt size={120} />
                            ) : (
                              <QrCode size={120} />
                            )}
                          </p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {form.formState.errors.payment_type && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.payment_type.message}
                  </p>
                )}
              </div>

              {/* Currency Type */}
              <div className="space-y-2">
                <Label>{t("gift.form.currency_type")}</Label>
                <RadioGroup
                  value={form.watch("currency_type")}
                  onValueChange={(value) =>
                    form.setValue("currency_type", value as "USD" | "KHR")
                  }
                  className="flex gap-4"
                >
                  {[
                    { id: "USD", label: "USD ($)", desc: "US Dollar" },
                    { id: "KHR", label: "KHR (៛)", desc: "Cambodian Riel" },
                  ].map((currency) => (
                    <div
                      key={currency.id}
                      className="flex items-center space-x-2"
                    >
                      <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-rose-50 dark:has-[[aria-checked=true]]:border-primary-900 dark:has-[[aria-checked=true]]:bg-primary-950 cursor-pointer">
                        <RadioGroupItem
                          value={currency.id}
                          id={currency.id}
                          className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-primary dark:data-[state=checked]:bg-primary"
                        />
                        <div className="grid gap-1.5 font-normal">
                          <p className="text-sm leading-none font-medium">
                            {currency.label}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {currency.desc}
                          </p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {form.formState.errors.currency_type && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.currency_type.message}
                  </p>
                )}
              </div>

              {/* Amount & Note */}
              <InputTextField
                label={t("gift.form.amount")}
                name="amount"
                placeholder={t("gift.form.amount_placeholder")}
                step={0.01}
                form={form}
                disabled={loading}
              />
              <TextareaField
                label={t("gift.form.note")}
                name="note"
                placeholder={t("gift.form.note_placeholder")}
                form={form}
                disabled={loading}
              />
            </div>

            {/* Dialog Footer */}
            <DialogFooter>
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    form.reset();
                    setDialogOpen(false);
                    router.refresh();
                  }}
                >
                  {t("gift.form.cancel")}
                </Button>
                <SubmitButton loading={loading} entityId={id} />
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
