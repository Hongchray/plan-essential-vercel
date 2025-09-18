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
      <div className="space-y-4 = rounded-lg">
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
            <PlusIcon />
            {t("gift.form.addNew")}
          </Button>
        )}

        {/* Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
          <DialogContent className="max-w-xl sm:max-w-3xl p-0 ">
            <DialogHeader className="pt-4">
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
                  <div className="space-y-2 p-4">
                    <Label htmlFor="guest-select">
                      {t("gift.form.guest")} *
                    </Label>

                    {/* Search Input */}
                    <div className="flex items-center border rounded-md px-3">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <input
                        id="guest-select"
                        placeholder="Search by name, phone, or address..."
                        className="flex h-10 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        disabled={loading || guestsLoading}
                      />
                    </div>

                    {/* Guest List (always under input) */}
                    <div className="max-h-[300px] overflow-y-auto border rounded-md">
                      {guestsLoading ? (
                        <div className="py-6 text-center text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground"></div>
                            Loading guests...
                          </div>
                        </div>
                      ) : filteredGuests.length === 0 ? (
                        <div className="py-6 text-center text-sm">
                          <NoData icon="database" />
                          {searchQuery && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              Try searching with different terms
                            </div>
                          )}
                        </div>
                      ) : (
                        filteredGuests.map((guest) => (
                          <div
                            key={guest.id}
                            onClick={() => handleGuestSelect(guest)}
                            className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-accent border-t first:border-t-0 ${
                              selectedGuest?.id === guest.id
                                ? "bg-accent/50"
                                : ""
                            }`}
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
                              {/* Avatar */}
                              <div className="flex items-center gap-3">
                                {" "}
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  {guest.image ? (
                                    <AvatarImage src={guest.image} />
                                  ) : (
                                    <AvatarFallback
                                      className={` font-bold text-[12px]`}
                                    >
                                      {getInitials(guest.name)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <span className="font-medium text-sm">
                                  {guest.name}
                                </span>
                              </div>

                              <div className="flex flex-row gap-1 text-xs text-muted-foreground">
                                {/* Tags */}
                                {guest.guestTag &&
                                  guest.guestTag.length > 0 && (
                                    <div className="flex items-center gap-1 flex-wrap">
                                      <div className="flex gap-1 flex-wrap">
                                        {guest.guestTag.map((gt) => (
                                          <Badge
                                            key={gt.id}
                                            variant="secondary"
                                            className="text-[10px] px-2 py-0.5"
                                          >
                                            {gt.tag?.name_en}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                {/* Groups */}
                                {guest.guestGroup &&
                                  guest.guestGroup.length > 0 && (
                                    <div className="flex items-center gap-1 flex-wrap">
                                      <div className="flex gap-1 flex-wrap">
                                        {guest.guestGroup.map((gg) => (
                                          <Badge
                                            key={gg.id}
                                            variant="outline"
                                            className="text-[10px] px-2 py-0.5"
                                          >
                                            {gg.group?.name_en}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

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
                      <Label>
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
                        className="flex gap-4"
                      >
                        {["CASH", "KHQR"].map((type) => (
                          <div key={type} className="flex flex-1">
                            <Label className="hover:bg-accent/50 flex flex-1 items-center justify-center rounded-lg border-2 p-2 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-rose-50 dark:has-[[aria-checked=true]]:border-primary-900 dark:has-[[aria-checked=true]]:bg-primary-950 cursor-pointer">
                              <RadioGroupItem
                                value={type}
                                id={type}
                                className="hidden"
                              />
                              <div className="flex items-center justify-center gap-4">
                                <p className="text-md font-bold">
                                  {type === "CASH" ? "Cash" : "KHQR"}
                                </p>
                                <div className="text-muted-foreground flex-shrink-0">
                                  {type === "CASH" ? (
                                    <Receipt size={50} />
                                  ) : (
                                    <QrCode size={50} />
                                  )}
                                </div>
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
                      <Label>
                        {t("gift.form.currency_type")} <RequiredMark />
                      </Label>
                      <RadioGroup
                        value={form.watch("currency_type")}
                        onValueChange={(value) =>
                          form.setValue("currency_type", value as "USD" | "KHR")
                        }
                        className="grid grid-cols-2 gap-4" // two columns
                      >
                        {[
                          { id: "USD", label: "USD ($)", desc: "US Dollar" },
                          {
                            id: "KHR",
                            label: "KHR (៛)",
                            desc: "Cambodian Riel",
                          },
                        ].map((currency) => (
                          <Label
                            key={currency.id}
                            className="hover:bg-accent/50 flex flex-col items-start gap-1 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-rose-50 dark:has-[[aria-checked=true]]:border-primary-900 dark:has-[[aria-checked=true]]:bg-primary-950 cursor-pointer w-full"
                          >
                            <RadioGroupItem
                              value={currency.id}
                              id={currency.id}
                              className="hidden data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-primary dark:data-[state=checked]:bg-primary"
                            />
                            <p className="text-sm font-medium">
                              {currency.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {currency.desc}
                            </p>
                          </Label>
                        ))}
                      </RadioGroup>

                      {form.formState.errors.currency_type && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.currency_type.message}
                        </p>
                      )}
                    </div>

                    {/* Amount & Note */}
                    {form.watch("currency_type") === "KHR" && (
                      <InputTextField
                        label={
                          t("gift.form.amount") +
                          (form.watch("currency_type") === "USD"
                            ? " ($)"
                            : " (៛)")
                        }
                        required
                        name="amount_khr"
                        placeholder={t("gift.form.amount_placeholder")}
                        step={0.01}
                        form={form}
                        disabled={loading}
                      />
                    )}

                    {form.watch("currency_type") === "USD" && (
                      <InputTextField
                        label={
                          t("gift.form.amount") +
                          (form.watch("currency_type") === "USD"
                            ? " ($)"
                            : " (៛)")
                        }
                        name="amount_usd"
                        placeholder={t("gift.form.amount_placeholder")}
                        step={0.01}
                        required
                        form={form}
                        disabled={loading}
                      />
                    )}
                    <TextareaField
                      label={t("gift.form.note")}
                      name="note"
                      placeholder={t("gift.form.note_placeholder")}
                      form={form}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Dialog Footer */}
                <DialogFooter className="pb-4">
                  <div className="flex gap-2 justify-end pt-2 p-4">
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
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
