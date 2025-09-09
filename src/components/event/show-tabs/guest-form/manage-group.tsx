"use client";
import { useForm } from "react-hook-form";
import { InputTextField } from "@/components/composable/input/input-text-field";
import { useState, useEffect, useCallback } from "react";
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
import {
  GroupIcon,
  PlusIcon,
  Settings,
  Trash2Icon,
  XIcon,
  Check,
  PencilLine,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Group } from "@/interfaces/group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { Spining } from "@/components/composable/loading/loading";
const guestFormSchema = z.object({
  name_en: z.string().min(1, "Name (English) is required"),
  name_kh: z.string().min(1, "Name (Khmer) is required"),
});
type GuestFormData = z.infer<typeof guestFormSchema>;

export function ManageGroupForm() {
  const params = useParams();
  const id = params.id;
  const [editId, setEditId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name_en: "",
      name_kh: "",
    },
  });

  const editForm = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name_en: "",
      name_kh: "",
    },
  });

  const onUpdate = async (values: GuestFormData) => {
    setLoading(true);
    const res = await fetch(`/api/admin/event/${id}/group/${editId}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    getGroup();
    setLoading(false);
    setEditId("");
    editForm.reset();
    return data;
  };

  const onDelete = async (id: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/event/${id}/group/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    getGroup();
    setLoading(false);
    return data;
  };

  const onSubmit = async (values: GuestFormData) => {
    setLoading(true);
    const res = await fetch(`/api/admin/event/${id}/group`, {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    getGroup();
    setLoading(false);
    form.reset();
    return data;
  };

  const getGroup = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/event/${id}/group`);
    const data = await res.json();
    //check lang
    if (data) {
      setGroups(data);
    }
    setLoading(false);
    return data;
  }, [id]);

  useEffect(() => {
    if (dialogOpen) {
      getGroup();
    }
  }, [dialogOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="text-rose-500 hover:text-rose-700 text-sm flex items-center gap-1 cursor-pointer border border-dashed rounded-md p-1 border-rose-200"
      >
        <Settings className="h-4 w-4" />
        Manage Groups
      </button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {" "}
              <span className="flex gap-2">
                <Settings className="h-5 w-5" /> Manage Group
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 bg-gray-50 p-5 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4  ">
              <InputTextField
                label="Name (English)"
                name="name_en"
                placeholder="Enter name"
                form={form}
                disabled={loading}
              />
              <InputTextField
                label="Name (Khmer)"
                name="name_kh"
                placeholder="Enter name"
                form={form}
                disabled={loading}
              />
            </div>
            <Button
              size="sm"
              type="button"
              disabled={loading}
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              <PlusIcon></PlusIcon> Add Group{" "}
            </Button>
          </div>
          <div className="rounded-md gap-2 ">
            <div className="px-3 font-semibold ">
              List of Groups{" "}
              <span className="text-xs text-gray-500">
                (Total {groups.length})
              </span>
            </div>
            <ScrollArea className="h-[300px] rounded-md p-3">
              <div className="flex flex-col gap-2 p-1">
                {loading ? (
                  <Spining />
                ) : groups.length > 0 ? (
                  groups.map((group) =>
                    editId == group.id ? (
                      <div
                        key={group.id}
                        className="border-2 rounded-md p-2 shadow-md"
                      >
                        <div className=" grid grid-cols-2 gap-2">
                          <InputTextField
                            label="Name (English)"
                            name="name_en"
                            placeholder="Enter name"
                            form={editForm}
                            disabled={loading}
                          />
                          <InputTextField
                            label="Name (Khmer)"
                            name="name_kh"
                            placeholder="Enter name"
                            form={editForm}
                            disabled={loading}
                          />
                        </div>
                        <div className="flex justify-end pt-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditId("");
                              editForm.reset();
                            }}
                          >
                            <XIcon className="" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            disabled={loading}
                            onClick={() => editForm.handleSubmit(onUpdate)()}
                          >
                            <Check className="text-green-600" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={group.id}
                        className="flex justify-between items-center border rounded-md p-2 "
                      >
                        <div className="flex gap-2 items-center">
                          <div>
                            <GroupIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {group.name_en}
                            </div>
                            <div className="text-xs text-gray-500">
                              {group.name_kh}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditId(group.id);
                              editForm.reset(group);
                            }}
                          >
                            <PencilLine className="text-primary" />
                          </Button>
                          <ConfirmDialog
                            trigger={
                              <Button size="icon" variant="ghost">
                                <Trash2Icon className="text-red-600" />
                              </Button>
                            }
                            title="Delete this group?"
                            description="This will permanently remove the group."
                            onConfirm={() => onDelete(group.id)}
                          />
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-center">No group found</div>
                )}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  form.reset();
                  setDialogOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
