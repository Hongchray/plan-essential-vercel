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
import { useParams } from "next/navigation"
import { Group } from "@/interfaces/group"
const guestFormSchema = z.object({
    id: z.string().uuid().optional(),
    eventId: z.string().uuid().optional(),
    name_en: z.string().min(3).max(50),
    name_kh: z.string().min(3).max(50),
})

type GuestFormData = z.infer<typeof guestFormSchema>

export function ManageGroupForm() {
    const params = useParams();
    const id = params.id;
    const form = useForm<GuestFormData>({
        resolver: zodResolver(guestFormSchema),
        defaultValues:{
            name_en: "",
            name_kh: "",
        },
    })

    const [loading, setLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    
    const onSubmit = async (values: GuestFormData) => {
        setLoading(true)
   
        await createGroup(values).then((data) => {
            getGroup();
            setLoading(false)
            form.reset()
        });
    }
    const [groups, setGroups] = useState<Group[]>([])

    const createGroup = async (values: GuestFormData) => {
        const res = await fetch(`/api/admin/event/${id}/group`, {
            method: "POST",
            body: JSON.stringify(values),
        })
        const data = await res.json()
        return data;
    }
    const getGroup = async () => {
        const res = await fetch(`/api/admin/event/${id}/group`)
        const data = await res.json();
        //check lang
        if(data){
          setGroups(data)
        }
        return data;
    }
    useEffect(() => {
        getGroup();
    }, [id])
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
            <div className="p-2 border border-gray-300 rounded-md">
                <div className="pb-2 font-semibold">List of Groups</div>
                {
                  groups.map(group => (
                    <div key={group.id} className="flex justify-between items-center">
                      <div>{group.name_en}</div>
                      <div>{group.name_kh}</div>
                    </div>
                  ))
                }
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
