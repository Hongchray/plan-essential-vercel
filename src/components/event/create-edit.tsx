"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { SubmitButton } from "../composable/button/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEffect, useState } from "react";
import { InputTextField } from "../composable/input/input-text-field";
import { Button } from "../ui/button";
import { SwitchField } from "../composable/input/switch";
import { SelectField } from "../composable/select/select-option";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/hooks/LoadingContext";
import { TextareaField } from "../composable/input/input-textarea-text-field";
import { DatePickerField } from "../composable/date/date-picker";
import ImageUpload from "../composable/upload/upload-image";
import { useTranslation } from "next-i18next";
import { Label } from "@/components/ui/label";
import { RequiredMark } from "../composable/required-mark";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trash2,
  Plus,
  Clock,
  Calendar,
  Users,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Timeline Schema
const timelineSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Timeline name is required"),
  time: z
    .string()
    .min(1, "Time is required")
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
});

// Shift Schema
const shiftSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Shift name is required"),
  date: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date",
  }),
  timelines: z
    .array(timelineSchema)
    .min(1, "At least one timeline item is required"),
});

// Schedule Schema
const scheduleSchema = z.object({
  id: z.string().optional(),
  shifts: z.array(shiftSchema),
});

export function CreateEditForm({ id }: { id?: string }) {
  const { t } = useTranslation("common");
  const { setOverlayLoading } = useLoading();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const formSchema = z
    .object({
      name: z
        .string()
        .min(1, t("EventPage.error.nameRequired"))
        .max(50, t("EventPage.error.nameMax")),
      type: z.string().min(1, t("EventPage.error.typeRequired")),
      bride: z.string().min(1, t("EventPage.error.brideRequired")),
      groom: z.string().min(1, t("EventPage.error.groomRequired")),
      image: z.string().nullable(),
      status: z.string(),
      description: z.string(),
      userId: z.string(),
      location: z.string(),
      latitude: z.coerce.string().optional(),
      longitude: z.coerce.string().optional(),
      startTime: z.coerce
        .date({
          required_error: t("EventPage.error.startTimeRequired"),
        })
        .refine((val: Date) => !isNaN(val.getTime()), {
          message: t("EventPage.error.startTimeInvalid"),
        })
        .transform((val) => new Date(val)),

      endTime: z.coerce
        .date({
          required_error: t("EventPage.error.endTimeRequired"),
        })
        .refine((val: Date) => !isNaN(val.getTime()), {
          message: t("EventPage.error.endTimeInvalid"),
        })
        .transform((val) => new Date(val)),
      owner: z.coerce.string().optional(),
      schedule: scheduleSchema.optional(),
    })
    .refine((data) => data.endTime >= data.startTime, {
      path: ["endTime"],
      message: t("EventPage.error.endTimeAfterStart"),
    });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "wedding",
      image: "",
      status: "active",
      description: "",
      userId: "",
      location: "",
      latitude: "",
      longitude: "",
      startTime: undefined,
      endTime: undefined,
      owner: "",
      bride: "",
      groom: "",
      schedule: {
        shifts: [],
      },
    },
  });

  const {
    fields: shiftFields,
    append: appendShift,
    remove: removeShift,
  } = useFieldArray({
    control: form.control,
    name: "schedule.shifts",
  });

  // ✅ API helpers (updated to handle schedule)
  const createEvent = async (data: FormData) => {
    const res = await fetch("/api/admin/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success(t("EventPage.message.createSuccess"));
    } else {
      toast.error(t("EventPage.error.createFailed"));
    }
    return res;
  };

  const updateEvent = async (id: string, data: FormData) => {
    const res = await fetch(`/api/admin/event/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success(t("EventPage.message.updateSuccess"));
    } else {
      toast.error(t("EventPage.error.updateFailed"));
    }
    return res;
  };

  const getEditEvent = async (id: string) => {
    const res = await fetch(`/api/admin/event/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) return res.json();
    toast.error(t("EventPage.error.getFailed"));
  };

  useEffect(() => {
    setMounted(true);
    if (!id) return;
    const fetchEvent = async () => {
      setOverlayLoading(true);
      const data = await getEditEvent(id);
      if (data) {
        // Get the first schedule (assuming one schedule per event)
        const scheduleData = data.schedules?.[0];

        // Transform the data to match form structure
        const formData = {
          ...data,
          schedule: scheduleData
            ? {
                id: scheduleData.id,
                shifts:
                  scheduleData.shifts?.map((shift: any) => ({
                    id: shift.id,
                    name: shift.name,
                    date: new Date(shift.date),
                    timelines: shift.timeLine?.map((timeline: any) => ({
                      id: timeline.id,
                      name: timeline.name,
                      time: timeline.time,
                    })) || [{ name: "", time: "" }],
                  })) || [],
              }
            : { shifts: [] },
        };
        form.reset(formData);
        if (scheduleData?.shifts?.length > 0) {
          setScheduleOpen(true);
        }
      }
      setOverlayLoading(false);
    };
    fetchEvent();
  }, [id]);

  if (!mounted) return null;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    if (id) {
      const res = await updateEvent(id, data);
      if (res.ok) {
        const json = await res.json();
        router.push(`/event/edit/${json.id}`);
      }
    } else {
      const res = await createEvent(data);
      if (res.ok) {
        const json = await res.json();
        form.reset();
        router.push(`/event/edit/${json.id}`);
      }
    }
    setLoading(false);
  };

  const addShift = () => {
    appendShift({
      name: "",
      date: new Date(),
      timelines: [{ name: "", time: "" }],
    });
    setScheduleOpen(true);
  };

  const hasSchedule = shiftFields.length > 0;

  return (
    <div className="p-2 sm:p-4 border rounded-md bg-white mx-auto max-w-4xl">
      <div>
        <h2 className="text-base sm:text-lg font-bold pb-1">
          {id ? t("EventPage.create.edit") : t("EventPage.create.title")}
        </h2>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 sm:space-y-4"
      >
        {/* Cover Image */}
        <div className="flex flex-col gap-1 mt-2">
          <Label>{t("EventPage.create.coverImage")}</Label>
          <ImageUpload
            label={t("EventPage.create.imageSize")}
            folder="/event/cover"
            {...form.register("image")}
            value={form.watch("image") ?? undefined}
            type="event"
          />
        </div>

        {/* Basic Event Fields - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div className="sm:col-span-1">
            <InputTextField
              label={t("EventPage.create.name")}
              name="name"
              placeholder={t("EventPage.create.namePlaceholder")}
              form={form}
              disabled={loading}
              required
            />
          </div>

          <div className="sm:col-span-1">
            <SelectField
              label={t("EventPage.create.type")}
              name="type"
              placeholder={t("EventPage.create.typePlaceholder")}
              disabled={id != null}
              className="w-full"
              required
              options={[
                { label: t("EventPage.create.wedding"), value: "wedding" },
                {
                  label: t("EventPage.create.housewarming"),
                  value: "housewarming",
                },
                { label: t("EventPage.create.birthday"), value: "birthday" },
                {
                  label: t("EventPage.create.anniversary"),
                  value: "anniversary",
                },
              ]}
              form={form}
            />
          </div>

          {form.getValues("type") !== "wedding" && (
            <div className="sm:col-span-2">
              <InputTextField
                label={t("EventPage.create.owner")}
                name="owner"
                placeholder={t("EventPage.create.ownerPlaceholder")}
                form={form}
                disabled={loading}
              />
            </div>
          )}

          {form.getValues("type") === "wedding" && (
            <>
              <div className="sm:col-span-1">
                <InputTextField
                  label={t("EventPage.create.groom")}
                  name="groom"
                  placeholder={t("EventPage.create.groomPlaceholder")}
                  form={form}
                  required
                  disabled={loading}
                />
              </div>
              <div className="sm:col-span-1">
                <InputTextField
                  label={t("EventPage.create.bride")}
                  name="bride"
                  required
                  placeholder={t("EventPage.create.bridePlaceholder")}
                  form={form}
                  disabled={loading}
                />
              </div>
            </>
          )}

          <div className="sm:col-span-1">
            <DatePickerField
              label={t("EventPage.create.startDate")}
              name="startTime"
              placeholder={t("EventPage.create.startDatePlaceholder")}
              form={form}
              required
            />
          </div>

          <div className="sm:col-span-1">
            <DatePickerField
              label={t("EventPage.create.endDate")}
              name="endTime"
              placeholder={t("EventPage.create.endDatePlaceholder")}
              form={form}
              required
            />
          </div>

          <div className="sm:col-span-1">
            <TextareaField
              label={t("EventPage.create.description")}
              name="description"
              placeholder={t("EventPage.create.descriptionPlaceholder")}
              form={form}
              disabled={loading}
            />
          </div>

          <div className="sm:col-span-1">
            <TextareaField
              label={t("EventPage.create.location")}
              name="location"
              placeholder={t("EventPage.create.locationPlaceholder")}
              form={form}
              disabled={loading}
            />
          </div>

          <div className="sm:col-span-2">
            <SwitchField
              label={t("EventPage.create.status")}
              name="status"
              trueValue="active"
              falseValue="inactive"
              form={form}
            />
          </div>
        </div>

        {/* Schedule Section */}
        <Card className="border-2 border-dashed">
          <Collapsible open={scheduleOpen} onOpenChange={setScheduleOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    <span className="text-base sm:text-lg">
                      របៀបវីរៈកម្មវិធី
                    </span>
                    {hasSchedule && (
                      <span className="text-xs sm:text-sm bg-blue-100 px-2 py-1 rounded">
                        {shiftFields.length} ពេល
                      </span>
                    )}
                  </div>
                  {scheduleOpen ? (
                    <ChevronUp className="w-5 h-5 self-end sm:self-center" />
                  ) : (
                    <ChevronDown className="w-5 h-5 self-end sm:self-center" />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0">
                {!hasSchedule ? (
                  <div className="text-center py-4 sm:py-6">
                    <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-3 text-sm">
                      មិនទាន់មានកម្មវិធី
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addShift}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      បន្ថែមពេល
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 flex items-center flex-col ">
                    {shiftFields.map((shift, shiftIndex) => (
                      <ShiftCard
                        key={shift.id}
                        shiftIndex={shiftIndex}
                        form={form}
                        onRemove={() => removeShift(shiftIndex)}
                        canRemove={shiftFields.length > 1}
                        loading={loading}
                      />
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addShift}
                      className="text-center"
                      disabled={loading}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      បន្ថែមពេល
                    </Button>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 items-stretch sm:items-center justify-end pt-2 sm:pt-3 border-t">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/event")}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            {t("EventPage.create.cancel")}
          </Button>
          <SubmitButton loading={loading} entityId={id} />
        </div>
      </form>
    </div>
  );
}

interface ShiftCardProps {
  shiftIndex: number;
  form: any;
  onRemove: () => void;
  canRemove: boolean;
  loading: boolean;
}

function ShiftCard({
  shiftIndex,
  form,
  onRemove,
  canRemove,
  loading,
}: ShiftCardProps) {
  const {
    fields: timelineFields,
    append: appendTimeline,
    remove: removeTimeline,
  } = useFieldArray({
    control: form.control,
    name: `schedule.shifts.${shiftIndex}.timelines`,
  });

  const addTimeline = () => {
    appendTimeline({ name: "", time: "" });
  };

  return (
    <Card className="relative w-full ">
      <CardHeader className="pb-2 px-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Users className="w-4 h-4" />
            ពេលទី {shiftIndex + 1}
          </CardTitle>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 self-end sm:self-center"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-2">
        <div className="grid grid-cols-1  gap-2 sm:gap-3">
          <div className="sm:col-span-1">
            <InputTextField
              label="ឈ្មោះពេល"
              name={`schedule.shifts.${shiftIndex}.name`}
              placeholder="ឧ. កម្មវិធីថ្ងៃទី ១​ : ថ្ងៃអាទិត្យ ទី២១ ខែកញ្ញា ឆ្នាំ២០២៥"
              form={form}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="space-y-2 pl-1 sm:pl-4">
            {timelineFields.map((timeline, timelineIndex) => (
              <div
                key={timeline.id}
                className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end"
              >
                <div className="flex-1">
                  <InputTextField
                    label="ឈ្មោះកម្មវិធី"
                    name={`schedule.shifts.${shiftIndex}.timelines.${timelineIndex}.name`}
                    placeholder="ឧ. ជួបជុំភ្ញៀវកិត្តិយស បងប្អូន រៀបពិធីហែលជំនូន"
                    form={form}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="w-full sm:w-32">
                  <InputTextField
                    label="ម៉ោង"
                    name={`schedule.shifts.${shiftIndex}.timelines.${timelineIndex}.time`}
                    placeholder="07:00"
                    form={form}
                    disabled={loading}
                    required
                  />
                </div>
                {timelineFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTimeline(timelineIndex)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 mb-0.5 w-full sm:w-auto"
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="ml-2 sm:hidden">Remove</span>
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTimeline}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              បន្ថែមកម្មវិធី
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
