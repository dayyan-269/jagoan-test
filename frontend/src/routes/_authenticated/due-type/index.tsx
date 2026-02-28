import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {DIALOGUE_STATE, type DialogueType} from "@/types/dialogue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical, PlusCircle } from "lucide-react";

import BaseDialog from "@/components/base-dialog";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import SkeletonTable from "@/components/skeleton-table";
import {
  getDueTypes,
  createDueType,
  editDueType,
  deleteDueType,
  type IDueType,
  type IEditDueTypePayload,
} from "@/handlers/finance/due/due-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const dueTypeSchema = z.object({
  name: z.string().nonempty("Nama jenis iuran harus diisi"),
  amount: z.string(),
});

export const Route = createFileRoute("/_authenticated/due-type/")({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["dueTypes"],
        queryFn: () => getDueTypes(),
      }),
    );
  },
  component: RouteComponent,
  pendingComponent: SkeletonTable,
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const { data: dueTypes } = useSuspenseQuery(
    queryOptions({
      queryKey: ["dueTypes"],
      queryFn: () => getDueTypes(),
    }),
  );

  const [activeDialogue, setActiveDialogue] = useState<DialogueType>(
    DIALOGUE_STATE.CLOSE,
  );
  const [dueTypeDetail, setDueTypeDetail] = useState<IDueType | null>(null);

  const createForm = useForm<z.infer<typeof dueTypeSchema>>({
    resolver: zodResolver(dueTypeSchema),
    defaultValues: {
      name: "",
      amount: "",
    },
    mode: "onSubmit",
  });

  const editForm = useForm<z.infer<typeof dueTypeSchema>>({
    resolver: zodResolver(dueTypeSchema),
    defaultValues: {
      name: "",
      amount: "",
    },
    mode: "onSubmit",
  });

  const deleteForm = useForm({
    mode: "onSubmit",
  });

  useEffect(() => {
    editForm.reset({
      name: dueTypeDetail?.name || "",
      amount: dueTypeDetail?.amount || "",
    });
  }, [dueTypeDetail, editForm]);

  const createDueTypeMutation = useMutation({
    mutationFn: (payload: Omit<IDueType, "id">) => createDueType(payload),
    onSuccess: async () =>{
      await queryClient.invalidateQueries({ queryKey: ["dueTypes"] });
    },
  });

  const editDueTypeMutation = useMutation({
    mutationFn: (editPayload: IEditDueTypePayload) => editDueType(editPayload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dueTypes"] });
    },
  });

  const deleteDueTypeMutation = useMutation({
    mutationFn: (id: number) => deleteDueType(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dueTypes"] });
    },
  });

  const openDialogue = async (
    dialogue: DialogueType,
    dueType: IDueType = {},
  ) => {
    setActiveDialogue(dialogue);
    setDueTypeDetail(dueType);
  };

  const handleCreate = (payload: Omit<IDueType, "id">): void => {
    createDueTypeMutation.mutate(payload);
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data jenis iuran berhasil dibuat");
  };

  const handleEdit = (payload: Omit<IDueType, "id">): void => {
    if (!dueTypeDetail?.id) {
      throw new Error("Due type ID is missing");
    }
    editDueTypeMutation.mutate({ id: dueTypeDetail.id, payload: payload });
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data jenis iuran berhasil diubah");
  };

  const handleDelete = (): void => {
    if (!dueTypeDetail?.id) {
      throw new Error("Due type ID is missing");
    }
    deleteDueTypeMutation.mutate(dueTypeDetail.id);
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data jenis iuran berhasil dihapus");
  };
  return (
    <>
      <h1 className="text-2xl font-semibold">Olah Data Jenis Iuran</h1>
      <Button
        size={"lg"}
        className="mt-4 self-end w-fit"
        onClick={() => setActiveDialogue(DIALOGUE_STATE.CREATE)}>
        <PlusCircle className="text-white" />
        Tambah Jenis Iuran
      </Button>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Daftar Jenis Iuran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Nama Iuran</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dueTypes?.map((dueType, index) => (
                <TableRow key={dueType.id}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>{dueType.name}</TableCell>
                  <TableCell>{dueType.amount}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() =>
                              openDialogue(DIALOGUE_STATE.EDIT, dueType)
                            }>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              openDialogue(DIALOGUE_STATE.DELETE, dueType)
                            }>
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BaseDialog
        open={activeDialogue === DIALOGUE_STATE.CREATE}
        onOpenChange={() => setActiveDialogue(DIALOGUE_STATE.CLOSE)}
        title="Tambah Data Jenis Iuran"
        footer={
          <DialogFooter>
            <Button type="submit" disabled={false}>
              Simpan
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={createForm.handleSubmit(handleCreate)}>
        <div className="flex flex-col gap-y-3">
          <Controller
            name="name"
            control={createForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col"
                data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Jenis Iuran</FieldLabel>
                <Input
                  id="name"
                  placeholder="Masukkan nama jenis pengeluaran"
                  className="mt-3"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="amount"
            control={createForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col"
                data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nominal Iuran</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Masukkan nominal iuran"
                  className="mt-3"
                  type="number"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </BaseDialog>

      <BaseDialog
        open={activeDialogue === DIALOGUE_STATE.EDIT}
        onOpenChange={() => {
          if (activeDialogue === DIALOGUE_STATE.EDIT)
            setActiveDialogue(DIALOGUE_STATE.CLOSE);
        }}
        title="Edit Data Jenis Iuran"
        footer={
          <DialogFooter>
            <Button type="submit">Update</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={editForm.handleSubmit(handleEdit)}>
        <div className="flex flex-col gap-y-3">
          <Controller
            name="name"
            control={editForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col"
                data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Jenis Iuran</FieldLabel>
                <Input
                  id="name"
                  placeholder="Masukkan nama jenis pengeluaran"
                  className="mt-3"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="amount"
            control={editForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col"
                data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nominal Iuran</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Masukkan nominal iuran"
                  className="mt-3"
                  type="number"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </BaseDialog>

      <BaseDialog
        open={activeDialogue === DIALOGUE_STATE.DELETE}
        onOpenChange={() => {
          if (activeDialogue === DIALOGUE_STATE.DELETE)
            setActiveDialogue(DIALOGUE_STATE.CLOSE);
        }}
        title="Hapus Data Iuran?"
        description="Apakah anda yakin ingin menghapus data ini?"
        footer={
          <DialogFooter>
            <Button
              variant={"destructive"}
              type="submit"
              onClick={handleDelete}>
              Hapus
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={deleteForm.handleSubmit(handleDelete)}></BaseDialog>
    </>
  );
}
