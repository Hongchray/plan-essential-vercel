"use client"

import { useForm } from "react-hook-form"
import { InputTextField } from "@/components/composable/input/input-text-field"
import { useState, useEffect, useMemo, useCallback } from "react"
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
import { Separator } from "@/components/ui/separator"
import { ManageGroupForm } from "./manage-group"
import { ManageTagForm } from "./manage-tag"
import { Group } from "@/interfaces/group"
import { Tag } from "@/interfaces/tag"
import { useParams, useRouter } from "next/navigation"
import { EditIcon } from "lucide-react"
import ImageUpload from "@/components/composable/upload/upload-image"
const guestFormSchema = z.object({
    image: z.string().nullable().optional(),
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().nullable().optional(),
    phone: z.string().min(1, { message: "Phone number is required" }).max(50),
    note: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    groups: z.array(z.string()).nullable().optional(),
})

type GuestFormData = z.infer<typeof guestFormSchema>

export function CreateEditForm({id}: {id: string}) {
    const params = useParams();
    const eventId = params.id;

    const form = useForm<GuestFormData>({
        resolver: zodResolver(guestFormSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            note: "",
            address: "",
            image: "",
            tags: [],
            groups: [],
        },
    })

    const [loading, setLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    const [tagList, setTagList] = useState<Tag[]>([]);
    const [groupList, setGroupList] = useState<Group[]>([]);
    const router = useRouter();

    //edit 
    const editGuest = useCallback(async()=>{
      setLoading(true)
      const res = await fetch(`/api/admin/event/${eventId}/guest/${id}`)
      const data = await res.json();
      if(data){
        form.reset(data)
      }
      setLoading(false)
      return data;
    },[id])

    const getTag = useCallback(async () => {
        setLoading(true)
        const res = await fetch(`/api/admin/event/${eventId}/tag`)
        const data = await res.json();
        if(data){
          setTagList(data)
        }
        setLoading(false)
        return data;
    },[])

    const getGroup = useCallback(async () => {
        setLoading(true)
        const res = await fetch(`/api/admin/event/${eventId}/group`)
        const data = await res.json();
        if(data){
          setGroupList(data)
        }
        setLoading(false)
        return data;
    },[])

    const onSubmit =async (values: GuestFormData) => {
        setLoading(true)
        if(id){
          await fetch(`/api/admin/event/${eventId}/guest/${id}`, {
            method: "PUT",
            body: JSON.stringify(values),
          })
        } else {
          await fetch(`/api/admin/event/${eventId}/guest`, {
            method: "POST",
            body: JSON.stringify(values),
          })
        }
        setLoading(false)
        setDialogOpen(false)
        form.reset();
        router.refresh()
    }
    const groupOptions = useMemo(
      () =>
        groupList.map(group => ({
          label: `${group.name_en} (${group.name_kh})`,
          value: group.id,
        })),
      [groupList]
    );
    const tagOptions = useMemo(
      () =>
        tagList.map(tag => ({
          label: `${tag.name_en} (${tag.name_kh})`,
          value: tag.id,
        })),
      [tagList]
    );
    useEffect(() => {
      if(dialogOpen){
        getTag()
        getGroup()
      }
    }, [dialogOpen]);

    useEffect(() => {
      if(id && dialogOpen){
        editGuest();
      }
    }, [dialogOpen]);

    return (
    <>
    {
      id ? (
        <Button size="icon" variant="outline"  onClick={() => setDialogOpen(true)}>
          <EditIcon />
        </Button>
      ) : (
          <Button size="sm" onClick={() => setDialogOpen(true)}>
          Add New
        </Button>
      )
    }
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{id ? "Edit Guest" : "Add New Guest"}</DialogTitle>
            <DialogDescription>Fill in guest details below</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <ImageUpload
                label="Photo"
                folder="/event/guest"
                {...form.register("image")}
                value={form.watch("image")??''}
              />
            </div>
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
                        <ManageGroupForm />
                    </div>
                    <MultiSelect
                        label=""
                        options={groupOptions}
                        form={form}
                        name="groups"
                        placeholder="Enter groups"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center pt-2">
                        <Label>Tags</Label>
                        <ManageTagForm/>
                    </div>
                    <MultiSelect
                        label=""
                        options={tagOptions}
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
                  variant="outline"
                  type="button"
                  onClick={() => {
                    form.reset()
                    setDialogOpen(false)
                    router.refresh()
                  }}
                >
                  Cancel
                </Button>
                <SubmitButton loading={loading} entityId={id} />
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
    )
}
