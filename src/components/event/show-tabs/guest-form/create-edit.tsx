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
import { Settings } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ManageGroupForm } from "./manage-group"
const guestFormSchema = z.object({
    id: z.string().uuid().optional(),
    eventId: z.string().uuid().optional(),
    name: z.string().min(3).max(50),
    email: z.string().email().optional(),
    phone: z.string().min(3).max(50),
    note: z.string().optional(),
    address: z.string().optional(),
    tags: z.array(z.string()).optional(),
    groups: z.array(z.string()).optional(),
})

type GuestFormData = z.infer<typeof guestFormSchema>

export function CreateEditForm({ defaultValues }: { defaultValues?: GuestFormData }) {
    const form = useForm<GuestFormData>({
        resolver: zodResolver(guestFormSchema),
        defaultValues: defaultValues || {
            name: "",
            phone: "",
            email: "",
            note: "",
            address: "",
            tags: [],
            groups: [],
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
      <Button size="sm" onClick={() => setDialogOpen(true)}>
        Add New
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{defaultValues ? "Edit Guest" : "Add New Guest"}</DialogTitle>
            <DialogDescription>Fill in guest details below</DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputTextField label="Name" name="name" placeholder="Enter name" form={form} disabled={loading} />
                <InputTextField label="Phone" name="phone" placeholder="Enter phone" form={form} disabled={loading} />
                <TextareaField
                    label="Note"
                    name="note"
                    placeholder="Enter note"
                    form={form}
                    disabled={loading}
                />
                <TextareaField
                    label="Address"
                    name="address"
                    placeholder="Enter address"
                    form={form}
                    disabled={loading}
                />
                <div className="col-span-2">
                    <Separator />
                </div>
                <div>
                    <div className="flex justify-between items-center pt-2">
                        <Label>Groups</Label>
                        <ManageGroupForm/>
                    </div>
                    <MultiSelect
                        label=""
                        options={groupsList}
                        form={form}
                        name="groups"
                        placeholder="Enter groups"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center pt-2">
                        <Label>Tags</Label>
                        <button
                          type="button"
                          className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1 cursor-pointer"
                        >
                            <Settings className="h-4 w-4" />
                            Manage tags
                        </button>
                    </div>
                    <MultiSelect
                        label=""
                        options={tagsList}
                        form={form}
                        name="tags"
                        hideSelectAll={false}
                        placeholder="Enter tags"
                    />
                </div>
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
                <SubmitButton loading={loading} entityId={defaultValues?.id} />
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
    )
}
