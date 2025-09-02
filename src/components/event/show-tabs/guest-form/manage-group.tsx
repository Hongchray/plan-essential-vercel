"use client"

import { useForm } from "react-hook-form"
import { InputTextField } from "@/components/composable/input/input-text-field"
import { useState, useEffect } from "react"
import { SubmitButton } from "@/components/composable/button/submit-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { TextareaField } from "@/components/composable/input/input-textarea-text-field"
import { MultiSelect } from "@/components/composable/select/muliple-select-option";
import { Label } from "@/components/ui/label"
import { PlusIcon, Settings } from "lucide-react"
import { Separator } from "@/components/ui/separator"
const guestFormSchema = z.object({
    id: z.string().uuid().optional(),
    eventId: z.string().uuid().optional(),
    name_en: z.string().min(3).max(50),
    name_kh: z.string().min(3).max(50),
})

type GuestFormData = z.infer<typeof guestFormSchema>

export function ManageGroupForm({ defaultValues }: { defaultValues?: GuestFormData }) {
    const form = useForm<GuestFormData>({
        resolver: zodResolver(guestFormSchema),
        defaultValues:{
            name_en: "",
            name_kh: "",
        },
    })

    const [loading, setLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    const onSubmit = (values: GuestFormData) => {
        setLoading(true)

        setTimeout(() => {
        setLoading(false)
        setDialogOpen(false)
        form.reset()
        }, 1000)
    }
    const groupsList = [
        { value: "groom", label: "Groom's side" },
        { value: "bride", label: "Bride's side" },
    ];
    const tagsList = [
        { value: "high_school_friend", label: "High School Friend" },
        { value: "college_friend", label: "College Friend" },
        { value: "friend", label: "Friend" },
        { value: "teamwork", label: "Teamwork" },
        { value: "relative", label: "Relative" },
        { value: "others", label: "Others" },
    ];
    return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1 cursor-pointer"
        >
          <Settings className="h-4 w-4" />
          Manage Groups
      </button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Manage Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded place-content-end place-items-end">
                <InputTextField label="Name (English)" name="name_en" placeholder="Enter name" form={form} disabled={loading} />
                <InputTextField label="Name (Khmer)" name="name_kh" placeholder="Enter name" form={form} disabled={loading} />
                <Button size="sm"><PlusIcon></PlusIcon> Add Group </Button>
            </div>
            <DialogFooter>
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => {
                    form.reset()
                    setDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
                {/* <SubmitButton loading={loading} entityId={defaultValues?.id} /> */}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
    )
}
