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
import { Label } from "@/components/ui/label";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  createSpendingType,
  deleteSpendingType,
  editSpendingType,
  getSpendingTypes,
  type IEditSpendingTypePayload,
  type ISpendingType,
} from "@/handlers/finance/spending/spending-type";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DIALOGUE_STATE, type DialogueType } from "@/types/dialogue";
import { Field, FieldError } from "@/components/ui/field";
import SkeletonTable from "@/components/skeleton-table";

const spendingTypeSchema = z.object({
  name: z.string().nonempty("Nama jenis pengeluaran harus diisi"),
  amount: z.string().nonempty("Nominal harus diisi"),
});

export const Route = createFileRoute("/_authenticated/spending-type/")({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["spendingTypes"],
        queryFn: () => getSpendingTypes(),
      }),
    );
  },
  component: RouteComponent,
  pendingComponent: SkeletonTable,
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const { data: spendingTypes } = useSuspenseQuery(
    queryOptions({
      queryKey: ["spendingTypes"],
      queryFn: () => getSpendingTypes(),
    }),
  );

  const [activeDialogue, setActiveDialogue] = useState<DialogueType>(
    DIALOGUE_STATE.CLOSE,
  );
  const [spendingTypeDetail, setSpendingTypeDetail] =
    useState<ISpendingType | null>(null);

  const createForm = useForm<z.infer<typeof spendingTypeSchema>>({
    resolver: zodResolver(spendingTypeSchema),
    defaultValues: {
      name: "",
      amount: "",
    },
    mode: "onSubmit",
  });

  const editForm = useForm<z.infer<typeof spendingTypeSchema>>({
    resolver: zodResolver(spendingTypeSchema),
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
      name: spendingTypeDetail?.name || "",
      amount: spendingTypeDetail?.amount || "",
    });
  }, [spendingTypeDetail, editForm]);

  const createSpendingTypeMutation = useMutation({
    mutationFn: (payload: Omit<ISpendingType, "id">) =>
      createSpendingType(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spendingTypes"] });
    },
  });

  const editSpendingTypeMutation = useMutation({
    mutationFn: (editPayload: IEditSpendingTypePayload) =>
      editSpendingType(editPayload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spendingTypes"] });
    },
  });

  const deleteSpendingTypeMutation = useMutation({
    mutationFn: (id: number) => deleteSpendingType(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spendingTypes"] });
    },
  });

  const openDialogue = async (
    dialogue: DialogueType,
    spendingType: ISpendingType = {},
  ) => {
    setActiveDialogue(dialogue);
    setSpendingTypeDetail(spendingType);
  };

  const handleCreate = (payload: Omit<ISpendingType, "id">): void => {
    createSpendingTypeMutation.mutate(payload);
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data jenis pengeluaran berhasil dibuat");
  };

  const handleEdit = (payload: Omit<ISpendingType, "id">): void => {
    if (!spendingTypeDetail?.id) {
      throw new Error("Spending type ID is missing");
    }
    editSpendingTypeMutation.mutate({
      id: spendingTypeDetail.id,
      payload: payload,
    });
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data jenis pengeluaran berhasil diubah");
  };

  const handleDelete = (): void => {
    if (!spendingTypeDetail?.id) {
      throw new Error("Spending type ID is missing");
    }
    deleteSpendingTypeMutation.mutate(spendingTypeDetail.id);
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data jenis pengeluaranberhasil dihapus");
  };

  return (
    <>
      <h1 className="text-2xl font-semibold">Olah Data Jenis Pengeluaran</h1>
      <Button
        size={"lg"}
        className="mt-4 self-end w-fit"
        onClick={() => openDialogue(DIALOGUE_STATE.CREATE)}>
        <PlusCircle className="text-white" />
        Tambah Jenis Pengeluaran
      </Button>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Daftar Jenis Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Nama Pengeluaran</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spendingTypes.map((type, index) => (
                <TableRow key={type.id}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>Rp {type.amount}</TableCell>
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
                              openDialogue(DIALOGUE_STATE.EDIT, type)
                            }>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              openDialogue(DIALOGUE_STATE.DELETE, type)
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
        title="Tambah Data Jenis Pengeluaran"
        footer={
          <DialogFooter>
            <Button>Simpan</Button>
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
                <Label htmlFor={field.name}>Jenis Pengeluaran</Label>
                <Input
                  id={field.name}
                  placeholder="Masukkan jenis pengeluaran"
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
                <Label htmlFor={field.name}>Nominal</Label>
                <Input
                  id={field.name}
                  placeholder="Masukkan nominal pengeluaran"
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
        </div>
      </BaseDialog>

      <BaseDialog
        open={activeDialogue === DIALOGUE_STATE.EDIT}
        onOpenChange={() => setActiveDialogue(DIALOGUE_STATE.CLOSE)}
        title="Edit Data Jenis Pengeluaran"
        footer={
          <DialogFooter>
            <Button>Update</Button>
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
                <Label htmlFor={field.name}>Jenis Pengeluaran</Label>
                <Input
                  id={field.name}
                  placeholder="Masukkan jenis pengeluaran"
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
                <Label htmlFor={field.name}>Nominal</Label>
                <Input
                  id={field.name}
                  placeholder="Masukkan nominal pengeluaran"
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
        </div>
      </BaseDialog>

      <BaseDialog
        open={activeDialogue === DIALOGUE_STATE.DELETE}
        onOpenChange={() => setActiveDialogue(DIALOGUE_STATE.CLOSE)}
        title="Hapus Data Pengeluaran?"
        description="Apakah anda yakin ingin menghapus data ini?"
        footer={
          <DialogFooter>
            <Button variant={"destructive"}>Hapus</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={deleteForm.handleSubmit(handleDelete)}
      />
    </>
  );
}
