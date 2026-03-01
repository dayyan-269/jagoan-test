import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import * as z from "zod";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import SkeletonTable from "@/components/skeleton-table";
import {
  createSpendingPayment,
  deleteSpendingPayment,
  editSpendingPayment,
  getSpendingPayments,
  type ISpendingEditPayload,
  type ISpendingPayment,
  type ISpendingPaymentPayload,
} from "@/handlers/finance/spending/spending-payment";
import {
  getSpendingTypes,
  type ISpendingType,
} from "@/handlers/finance/spending/spending-type";
import { formatDate, formatRupiah } from "@/utils";
import { DIALOGUE_STATE, type DialogueType } from "@/types/dialogue";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export const Route = createFileRoute("/_authenticated/spending/")({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["spendingPayment"],
        queryFn: getSpendingPayments,
      }),
    );
    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["spendingType"],
        queryFn: getSpendingTypes,
      }),
    );
  },
  component: RouteComponent,
  pendingComponent: SkeletonTable,
});

const spendingSchema = z.object({
  spending_type_id: z.string().nonempty("Tipe pengeluaran harus dipilih"),
  date: z.string().nonempty("Tanggal pembayaran harus diisi"),
  description: z.string().nullish(),
});

type IPaymentDetail = Omit<ISpendingPayment, "spending_type"> & {
  spending_type_id: string;
};

function RouteComponent() {
  const [activeDialogue, setActiveDialogue] = useState<DialogueType>(
    DIALOGUE_STATE.CLOSE,
  );
  const [paymentDetail, setPaymentDetail] = useState<IPaymentDetail | null>(
    null,
  );

  const queryClient = useQueryClient();

  const { data: spendings } = useSuspenseQuery(
    queryOptions({
      queryKey: ["spendingPayment"],
      queryFn: () => getSpendingPayments(),
    }),
  );

  const { data: spendingType } = useSuspenseQuery(
    queryOptions({
      queryKey: ["spendingType"],
      queryFn: () => getSpendingTypes(),
    }),
  );

  const createForm = useForm<z.infer<typeof spendingSchema>>({
    resolver: zodResolver(spendingSchema),
    defaultValues: {
      description: "",
      spending_type_id: "",
      date: new Date().toISOString().split("T")[0],
    },
    mode: "onSubmit",
  });

  const editForm = useForm<z.infer<typeof spendingSchema>>({
    resolver: zodResolver(spendingSchema),
    defaultValues: {
      date: "",
      description: "",
      spending_type_id: "",
    },
    mode: "onSubmit",
  });

  const deleteForm = useForm({
    mode: "onSubmit",
  });

  useEffect(() => {
    editForm.reset({
      date: paymentDetail?.date,
      spending_type_id: paymentDetail?.spending_type_id,
      description: paymentDetail?.description ?? "",
    });
  }, [editForm, paymentDetail]);

  const createPaymentMutation = useMutation({
    mutationFn: (payload: ISpendingPaymentPayload) =>
      createSpendingPayment(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spendingPayment"] });
    },
  });

  const editPaymentMutation = useMutation({
    mutationFn: (editPayload: ISpendingEditPayload) =>
      editSpendingPayment(editPayload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spendingPayment"] });
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: (id: string) => deleteSpendingPayment(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spendingPayment"] });
    },
  });

  const openDialogue = async (
    dialogue: DialogueType,
    spendingPayment: ISpendingPayment,
  ) => {
    setActiveDialogue(dialogue);

    setPaymentDetail({
      ...spendingPayment,
      date: formatDate(spendingPayment.date),
      spending_type_id: spendingPayment.spending_type.id.toString(),
    });
  };

  const handleCreate = (payload: ISpendingPaymentPayload): void => {
    createPaymentMutation.mutate(payload);

    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data tagihan rumah berhasil dibuat");
  };

  const handleEdit = (payload: ISpendingPaymentPayload): void => {
    if (!paymentDetail?.id) {
      throw new Error("Spending ID is missing");
    }

    editPaymentMutation.mutate({ id: paymentDetail.id, payload: payload });
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data tagihan rumah berhasil diubah");
  };

  const handleDelete = (): void => {
    if (!paymentDetail?.id) {
      throw new Error("Spending ID is missing");
    }

    deletePaymentMutation.mutate(paymentDetail.id);
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data tagihan rumah berhasil dihapus");
  };

  return (
    <>
      <h1 className="text-2xl font-semibold">Olah Data Pengeluaran</h1>
      <Button
        size={"lg"}
        className="mt-4 self-end w-fit"
        onClick={() => setActiveDialogue(DIALOGUE_STATE.CREATE)}>
        <PlusCircle className="text-white" />
        Tambah Pengeluaran
      </Button>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Daftar Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Nama Pengeluaran</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Tanggal Pembayaran</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spendings.map((spending: ISpendingPayment, index: number) => (
                <TableRow>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>{spending?.spending_type?.name}</TableCell>
                  <TableCell>
                    {formatRupiah(parseInt(spending.spending_type?.amount))}
                  </TableCell>
                  <TableCell>{spending.date}</TableCell>
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
                              openDialogue(DIALOGUE_STATE.EDIT, spending)
                            }>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              openDialogue(DIALOGUE_STATE.DELETE, spending)
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
        onOpenChange={() => {
          if (activeDialogue === DIALOGUE_STATE.CREATE)
            setActiveDialogue(DIALOGUE_STATE.CLOSE);
        }}
        title="Tambah Data Pengeluaran"
        footer={
          <DialogFooter>
            <Button type="submit">Simpan</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={createForm.handleSubmit(handleCreate)}>
        <div className="flex flex-col gap-y-3">
          <Controller
            control={createForm.control}
            name="spending_type_id"
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <FieldLabel htmlFor={field.name} className="mb-3">
                  Jenis Pengeluaran
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    data-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Jenis Pengeluaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="pilih">
                        Pilih jenis pengeluaran
                      </SelectItem>
                      {spendingType?.map(
                        (type: ISpendingType, index: number) => (
                          <SelectItem
                            value={type.id?.toString() ?? ""}
                            key={index}>
                            {type.name} | {formatRupiah(parseInt(type.amount))}
                          </SelectItem>
                        ),
                      )}
                      <SelectItem value="dark"></SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            )}
          />
          <Controller
            control={createForm.control}
            name="date"
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col"
                data-invalid={fieldState.invalid}>
                <Label htmlFor={field.name}>Tanggal Pembayaran</Label>
                <Input
                  id={field.name}
                  type="date"
                  placeholder="Masukkan tanggal pembayaran"
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
            control={createForm.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col"
                data-invalid={fieldState.invalid}>
                <Label htmlFor="date">Deskripsi</Label>
                <Textarea
                  className="mt-3"
                  placeholder="Masukkan deskripsi..."
                  {...field}
                  value={field.value ?? ""}
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
        title="Edit Data Pengeluaran"
        footer={
          <DialogFooter>
            <Button type="submit">Simpan</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={editForm.handleSubmit(handleEdit)}>
        <div className="flex flex-col gap-y-3">
          <Controller
            control={editForm.control}
            name="spending_type_id"
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <FieldLabel htmlFor={field.name} className="mb-3">
                  Jenis Pengeluaran
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    data-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Jenis Pengeluaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="pilih">
                        Pilih jenis pengeluaran
                      </SelectItem>
                      {spendingType?.map(
                        (type: ISpendingType, index: number) => (
                          <SelectItem
                            value={type.id?.toString() ?? ""}
                            key={index}>
                            {type.name} | {formatRupiah(parseInt(type.amount))}
                          </SelectItem>
                        ),
                      )}
                      <SelectItem value="dark"></SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            )}
          />
          <Controller
            control={editForm.control}
            name="date"
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col"
                data-invalid={fieldState.invalid}>
                <Label htmlFor={field.name}>Tanggal Pembayaran</Label>
                <Input
                  id={field.name}
                  type="date"
                  placeholder="Masukkan tanggal pembayaran"
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
            control={editForm.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col"
                data-invalid={fieldState.invalid}>
                <Label htmlFor="date">Deskripsi</Label>
                <Textarea
                  className="mt-3"
                  placeholder="Masukkan deskripsi..."
                  {...field}
                  value={field.value ?? ""}
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
          if (activeDialogue === DIALOGUE_STATE.EDIT)
            setActiveDialogue(DIALOGUE_STATE.DELETE);
        }}
        title="Hapus Data Pengeluaran?"
        description="Apakah anda yakin ingin menghapus data ini?"
        footer={
          <DialogFooter>
            <Button variant={"destructive"} type="submit">
              Hapus
            </Button>
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
