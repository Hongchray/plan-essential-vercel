"use client"

import { useForm } from "react-hook-form";
import { InputTextField } from "../composable/input/input-text-field";
import { useState } from "react";
import { SubmitButton } from "../composable/button/submit-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "../ui/input";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  phone: z.string()
    .min(3, "Phone must be at least 3 characters")
    .max(50, "Phone must be less than 50 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function CreateEditForm()
{
    const form  = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
        }
    });
    const [loading, setLoading] =  useState(false);
    const [entityId, setEntityId] =  useState();
    const [dialogCreateEdit, setDialogCreateEdit] = useState(false);

    const onSubmit =()=>{};
    return(
        <>
            <Button size="sm" onClick={()=>setDialogCreateEdit(true)}>Add New</Button>
            <Dialog open={dialogCreateEdit} modal={true}>
                <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Store</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <div className="grid grid-cols-2 gap-2">
                            <InputTextField
                                label="Name"
                                name="name"
                                placeholder="Enter name"
                                form={form}
                                disabled={loading}
                            />
                            <InputTextField
                                label="Phone"
                                name="phone"
                                placeholder="Enter phone"
                                form={form}
                                disabled={loading}
                            />
                            <InputTextField
                                label="User"
                                name="userId"
                                placeholder="Enter userId"
                                form={form}
                                disabled={loading}
                            />
                        </div>
                        <DialogFooter>
                            <div className="pt-2 flex gap-2 items-center justify-end">
                                <Button variant='destructive' 
                                    type="button"
                                    onClick={()=>
                                        {
                                            form.reset();
                                            setDialogCreateEdit(false)
                                        }
                                    }>
                                    Cancel
                                </Button>
                                <SubmitButton
                                    loading={loading}
                                    entityId={entityId}
                                />
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}