import { useEffect, useState } from "react";
import * as z from "zod";
import { createFileRoute } from "@tanstack/react-router";
import { EllipsisVertical, PlusCircle } from "lucide-react";
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
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createDuePayment,
  deleteDuePayment,
  editDuePayment,
  getDuePayments,
  type IDueEditPayload,
  type IDuePayment,
  type IDuePaymentPayload,
} from "@/handlers/finance/due/due-payment";
import { getDueTypes } from "@/handlers/finance/due/due-type";
import { toast } from "sonner";
import { DIALOGUE_STATE, type DialogueType } from "@/types/dialogue";
import { formatDate, formatRupiah } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { getOccupiedResidents } from "@/handlers/housing/resident";

export const Route = createFileRoute("/_authenticated/due-payment/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["duePayment"],
        queryFn: getDuePayments,
      }),
    );
    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["dueType"],
        queryFn: getDueTypes,
      }),
    );
    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["residentOccupied"],
        queryFn: getOccupiedResidents,
      }),
    );
  },
  component: RouteComponent,
  pendingComponent: SkeletonTable,
});

const dueSchema = z.object({
  due_type_id: z.string().nonempty("Tipe iuran harus dipilih"),
  resident_id: z.string().nonempty("Penghuni harus dipilih"),
  date: z.string().nonempty("Tanggal pembayaran harus diisi"),
  description: z.string().nullish(),
  month_amount: z.string().min(1, "Jumlah bulan terbayar minimal 1"),
});

const dueEditSchema = z.object({
  due_type_id: z.string().nonempty("Tipe iuran harus dipilih"),
  resident_id: z.string().nonempty("Penghuni harus dipilih"),
  date: z.string().nonempty("Tanggal pembayaran harus diisi"),
  description: z.string().nullish(),
});

function RouteComponent() {
  const [activeDialogue, setActiveDialogue] = useState<DialogueType>(
    DIALOGUE_STATE.CLOSE,
  );
  const [paymentDetail, setPaymentDetail] = useState<
    | (Omit<IDuePayment, "due_type" | "resident"> & { resident_id: string })
    | null
  >(null);

  const queryClient = useQueryClient();

  const { data: duePayments } = useSuspenseQuery(
    queryOptions({
      queryKey: ["duePayment"],
      queryFn: () => getDuePayments(),
    }),
  );

  const { data: dueTypes } = useSuspenseQuery(
    queryOptions({
      queryKey: ["dueType"],
      queryFn: () => getDueTypes(),
    }),
  );

  const { data: residents } = useSuspenseQuery(
    queryOptions({
      queryKey: ["residentOccupied"],
      queryFn: () => getOccupiedResidents(),
    }),
  );

  const createForm = useForm<z.infer<typeof dueSchema>>({
    resolver: zodResolver(dueSchema),
    defaultValues: {
      description: "",
      due_type_id: "",
      resident_id: "",
      date: new Date().toISOString().split("T")[0],
      month_amount: "0",
    },
    mode: "onSubmit",
  });

  const editForm = useForm<z.infer<typeof dueEditSchema>>({
    resolver: zodResolver(dueEditSchema),
    defaultValues: {
      date: "",
      description: "",
      due_type_id: "",
      resident_id: "",
    },
    mode: "onSubmit",
  });

  const deleteForm = useForm({
    mode: "onSubmit",
  });

  useEffect(() => {
    editForm.reset({
      resident_id: paymentDetail?.resident_id,
      date: paymentDetail?.date,
      due_type_id: paymentDetail?.due_type_id,
      description: paymentDetail?.description ?? "",
    });
  }, [editForm, paymentDetail]);

  const createPaymentMutation = useMutation({
    mutationFn: (payload: IDuePaymentPayload) => createDuePayment(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["duePayment"] });
    },
  });

  const editPaymentMutation = useMutation({
    mutationFn: (editPayload: IDueEditPayload) => editDuePayment(editPayload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["duePayment"] });
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: (id: string) => deleteDuePayment(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["duePayment"] });
    },
  });

  const openDialogue = async (
    dialogue: DialogueType,
    duePayment: IDuePayment,
  ) => {
    setActiveDialogue(dialogue);

    setPaymentDetail({
      ...duePayment,
      date: formatDate(duePayment.date),
      due_type_id: duePayment.due_type.id.toString(),
      resident_id: duePayment.resident.id.toString(),
    });
  };

  const handleCreate = (payload: IDuePaymentPayload): void => {
    createPaymentMutation.mutate(payload);

    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data tagihan rumah berhasil dibuat");
  };

  const handleEdit = (
    payload: Omit<
      IDuePaymentPayload,
      "month_amount" | "resident" | "due_type" | "id"
    >,
  ): void => {
    if (!paymentDetail?.id) {
      throw new Error("Due ID is missing");
    }

    editPaymentMutation.mutate({ id: paymentDetail.id, payload: payload });
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data tagihan rumah berhasil diubah");
  };

  const handleDelete = (): void => {
    if (!paymentDetail?.id) {
      throw new Error("Due ID is missing");
    }

    deletePaymentMutation.mutate(paymentDetail.id);
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data tagihan rumah berhasil dihapus");
  };
  return (
    <>
      <h1 className="text-2xl font-semibold">Olah Data Pembayaran Iuran</h1>
      <Button
        size={"lg"}
        className="mt-4 self-end w-fit"
        onClick={() => setActiveDialogue(DIALOGUE_STATE.CREATE)}>
        <PlusCircle className="text-white" />
        Tambah Pembayaran Iuran
      </Button>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Daftar Pembayaran Iuran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Penghuni</TableHead>
                <TableHead>Pembayaran Iuran</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Tanggal Pembayaran</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {duePayments.map((payment: IDuePayment, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>{payment.resident.name}</TableCell>
                  <TableCell>{payment.due_type.name}</TableCell>
                  <TableCell>
                    {formatRupiah(parseInt(payment.due_type.amount))}
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
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
                              openDialogue(DIALOGUE_STATE.EDIT, payment)
                            }>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              openDialogue(DIALOGUE_STATE.DELETE, payment)
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
        title="Tambah Data Pembayaran Iuran"
        className="max-w-3/5!"
        footer={
          <DialogFooter>
            <Button type="submit">Simpan</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={createForm.handleSubmit(handleCreate)}>
        <div className="grid grid-col-1 gap-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={createForm.control}
              name="resident_id"
              render={({ field, fieldState }) => (
                <Field className="flex flex-col">
                  <FieldLabel htmlFor="type" className="mb-3">
                    Penghuni
                  </FieldLabel>
                  <Select
                    value={field.value}
                    name={field.name}
                    onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      data-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Penghuni Rumah" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="pilih">Pilih penghuni</SelectItem>
                        {residents.map((resident, index: number) => (
                          <SelectItem value={resident.id.toString()} key={index}>
                            {resident.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={createForm.control}
              name="due_type_id"
              render={({ field, fieldState }) => (
                <Field className="flex flex-col">
                  <FieldLabel htmlFor="type" className="mb-3">
                    Jenis Iuran
                  </FieldLabel>
                  <Select
                    value={field.value}
                    name={field.name}
                    onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      data-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Jenis Iuran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="pilih">Pilih jenis iuran</SelectItem>
                        {dueTypes?.map((type, index: number) => (
                          <SelectItem value={type.id.toString()} key={index}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
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
              name="month_amount"
              render={({ field, fieldState }) => (
                <Field className="flex flex-col">
                  <FieldLabel
                    htmlFor={field.name}
                    data-invalid={fieldState.invalid}>
                    Jumlah Pembayaran
                  </FieldLabel>
                  <div className="flex flex-row mt-3">
                    <Input
                      id={field.name}
                      type="number"
                      placeholder="Masukkan jumlah pembayaran"
                      className="rounded-br-none rounded-tr-none"
                      defaultValue={1}
                      {...field}
                    />
                    <div className="flex py-1 px-2 bg-white h-fit rounded-br-md rounded-tr-md border-2 border-primary">
                      Bulan
                    </div>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            control={createForm.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field className="flex flex-col">
                <div className="flex flex-col">
                  <FieldLabel htmlFor="date" data-invalid={fieldState.invalid}>
                    Deskripsi
                  </FieldLabel>
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
                </div>
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
        title="Edit Data Pembayaran Iuran"
        className="max-w-3/5!"
        footer={
          <DialogFooter>
            <Button type="submit">Simpan</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={editForm.handleSubmit(handleEdit)}>
        <div className="grid grid-col-1 gap-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={editForm.control}
              name="resident_id"
              render={({ field, fieldState }) => (
                <Field className="flex flex-col">
                  <FieldLabel htmlFor="type" className="mb-3">
                    Penghuni
                  </FieldLabel>
                  <Select
                    value={field.value}
                    name={field.name}
                    onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      data-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Penghuni Rumah" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="pilih">Pilih penghuni</SelectItem>
                        {residents.map((resident, index: number) => (
                          <SelectItem value={resident.id.toString()} key={index}>
                            {resident.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={editForm.control}
              name="due_type_id"
              render={({ field, fieldState }) => (
                <Field className="flex flex-col">
                  <FieldLabel htmlFor="type" className="mb-3">
                    Jenis Iuran
                  </FieldLabel>
                  <Select
                    value={field.value}
                    name={field.name}
                    onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      data-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Jenis Iuran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="pilih">Pilih jenis iuran</SelectItem>
                        {dueTypes?.map((type, index: number) => (
                          <SelectItem value={type.id.toString()} key={index}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
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
          </div>
          <Controller
            control={editForm.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field className="flex flex-col">
                <FieldLabel htmlFor="date" data-invalid={fieldState.invalid}>
                  Deskripsi
                </FieldLabel>
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
          if (activeDialogue === DIALOGUE_STATE.DELETE)
            setActiveDialogue(DIALOGUE_STATE.CLOSE);
        }}
        title="Hapus Data Pembayaran Iuran?"
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
