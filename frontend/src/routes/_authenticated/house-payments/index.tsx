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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EllipsisVertical, PlusCircle } from "lucide-react";
import { DIALOGUE_STATE, type DialogueType } from "@/types/dialogue";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import SkeletonTable from "@/components/skeleton-table";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  createHousePayment,
  deleteHousePayment,
  editHousePayment,
  getHousePayment,
  type IHousePayment,
  type IHousePaymentEditPayload,
  type IHousePaymentPayload,
} from "@/handlers/housing/house-payment";
import { getOccupiedResidents } from "@/handlers/housing/resident";
import { formatDate, formatRupiah } from "@/utils";

export const Route = createFileRoute("/_authenticated/house-payments/")({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["housePayment"],
        queryFn: getHousePayment,
      }),
    );
    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["occupiedResidents"],
        queryFn: getOccupiedResidents,
      }),
    );
  },
  component: RouteComponent,
  pendingComponent: SkeletonTable,
});

const housePaymentSchema = z.object({
  resident_id: z.string().nonempty("Penghuni harus dipilih"),
  payment_date: z.string().nonempty("Tanggal harus diisi"),
  payment_amount: z.string().nonempty("Nominal minimal harus diisi"),
  payment_status: z.boolean(),
  description: z.string().optional(),
  month_amount: z.string().nonempty("Jumlah bulan harus diisi"),
});

const editHousePaymentSchema = z.object({
  payment_date: z.string().nonempty("Tanggal harus diisi"),
  payment_amount: z.string().nonempty("Nominal minimal harus diisi"),
  payment_status: z.boolean(),
  description: z.string().optional(),
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const { data: housePayments } = useSuspenseQuery(
    queryOptions({
      queryKey: ["housesPayment"],
      queryFn: () => getHousePayment(),
    }),
  );

  const { data: residents } = useSuspenseQuery(
    queryOptions({
      queryKey: ["residentsOccupied"],
      queryFn: () => getOccupiedResidents(),
    }),
  );

  const [activeDialogue, setActiveDialogue] = useState<DialogueType>(
    DIALOGUE_STATE.CLOSE,
  );
  const [paymentDetail, setPaymentDetail] = useState<
    (Omit<IHousePaymentPayload, "month_amount"> & { id: number }) | null
  >(null);

  const createForm = useForm<z.infer<typeof housePaymentSchema>>({
    resolver: zodResolver(housePaymentSchema),
    defaultValues: {
      resident_id: "",
      payment_status: true,
      payment_date: new Date().toISOString().split("T")[0],
      payment_amount: "0",
      month_amount: "1",
      description: "",
    },
    mode: "onSubmit",
  });

  const editForm = useForm<z.infer<typeof editHousePaymentSchema>>({
    resolver: zodResolver(editHousePaymentSchema),
    defaultValues: {
      payment_status: true,
      payment_date: "",
      payment_amount: "",
      description: "",
    },
    mode: "onSubmit",
  });

  const deleteForm = useForm({
    mode: "onSubmit",
  });

  useEffect(() => {
    editForm.reset({
      payment_status: paymentDetail?.payment_status === "Lunas" ? true : false,
      payment_date: paymentDetail?.payment_date || "",
      payment_amount: paymentDetail?.payment_amount,
      description: paymentDetail?.description || "",
    });
  }, [paymentDetail, editForm]);

  const createPaymentMutation = useMutation({
    mutationFn: (payload: IHousePaymentPayload) => createHousePayment(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["housesPayment"] });
    },
  });

  const editPaymentMutation = useMutation({
    mutationFn: (
      editPayload: Omit<
        IHousePaymentEditPayload,
        "month_amount" | "resident_id"
      >,
    ) => editHousePayment(editPayload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["housesPayment"] });
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: (id: number) => deleteHousePayment(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["housesPayment"] });
    },
  });

  const openDialogue = async (
    dialogue: DialogueType,
    housePayment: IHousePayment,
  ) => {
    setActiveDialogue(dialogue);
    setPaymentDetail({
      id: housePayment.id,
      resident_id: housePayment.occupant_history?.resident.id.toString(),
      payment_amount: housePayment.payment_amount.toString(),
      payment_date: formatDate(housePayment.payment_date),
      payment_status: housePayment.payment_status === "Lunas" ? true : false,
      description: housePayment.description,
    });
  };

  const handleCreate = (payload: IHousePaymentPayload): void => {
    createPaymentMutation.mutate(payload);

    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data tagihan rumah berhasil dibuat");
  };

  const handleEdit = (
    payload: Omit<IHousePaymentPayload, "resident_id" | "month_amount">,
  ): void => {
    if (!paymentDetail?.id) {
      throw new Error("House ID is missing");
    }

    editPaymentMutation.mutate({ id: paymentDetail.id, payload: payload });
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data tagihan rumah berhasil diubah");
  };

  const handleDelete = (): void => {
    if (!paymentDetail?.id) {
      throw new Error("House ID is missing");
    }

    deletePaymentMutation.mutate(paymentDetail.id);
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data tagihan rumah berhasil dihapus");
  };

  return (
    <>
      <h1 className="text-2xl font-semibold">Olah Data Pembayaran Kontrak</h1>
      <Button
        size={"lg"}
        className="mt-4 self-end w-fit"
        onClick={() => setActiveDialogue(DIALOGUE_STATE.CREATE)}>
        <PlusCircle className="text-white" />
        Tambah Pembayaran Kontrak
      </Button>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Daftar Pembayaran Kontrak</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Penghuni</TableHead>
                <TableHead>No. Rumah</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Pembayaran</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {housePayments.map((payment: IHousePayment, index: number) => (
                <TableRow key={payment.id}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>
                    {payment.occupant_history?.resident.name}
                  </TableCell>
                  <TableCell>
                    #{payment.occupant_history?.house?.number}
                  </TableCell>
                  <TableCell>{formatRupiah(payment.payment_amount)}</TableCell>
                  <TableCell>
                    {payment.payment_status === "Lunas" ? (
                      <Badge>Lunas</Badge>
                    ) : (
                      <Badge variant={"destructive"}>Belum Lunas</Badge>
                    )}
                  </TableCell>
                  <TableCell>{payment.payment_date}</TableCell>
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
        title="Tambah Data Pembayaran Kontrak"
        className="max-w-3/5!"
        footer={
          <DialogFooter>
            <Button type="submit">Simpan</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={createForm.handleSubmit(handleCreate, (errors) =>
          console.log(errors),
        )}>
        <>
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="resident_id"
              control={createForm.control}
              render={({ field, fieldState }) => (
                <Field
                  className="flex flex-col"
                  data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="penghuni" className="mb-3">
                    Penghuni
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={String(field.value)}
                    onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Nama Penghuni" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="pilih">Pilih Penghuni</SelectItem>
                        {residents.map((resident, index) => (
                          <SelectItem value={String(resident.id)} key={index}>
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
              name="payment_amount"
              render={({ field, fieldState }) => (
                <Field
                  className="flex flex-col"
                  data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="total">Nominal Pembayaran</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    placeholder="Masukkan nominal pembayaran"
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
              name="payment_date"
              render={({ field, fieldState }) => (
                <Field
                  className="flex flex-col"
                  data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Tanggal Pembayaran
                  </FieldLabel>
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
                <Field
                  className="flex flex-col"
                  data-invalid={fieldState.invalid}>
                  <Label htmlFor={field.name}>Jumlah Pembayaran</Label>
                  <div className="flex flex-row mt-3">
                    <Input
                      id={field.name}
                      type="number"
                      placeholder="Masukkan jumlah pembayaran"
                      className="rounded-br-none rounded-tr-none"
                      {...field}
                      aria-invalid={fieldState.invalid}
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
            <Controller
              control={createForm.control}
              name="payment_status"
              render={({ field, fieldState }) => (
                <Field
                  className="flex flex-col"
                  data-invalid={fieldState.invalid}>
                  <Label htmlFor="date">Apakah lunas?</Label>
                  <Switch
                    className="mt-3"
                    value={field.value.toString()}
                    name={field.name}
                    onCheckedChange={field.onChange}
                    defaultChecked={true}
                  />
                </Field>
              )}
            />
          </div>
          <Controller
            control={createForm.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col mt-3"
                data-invalid={fieldState.invalid}>
                <Label htmlFor={field.name}>Deskripsi</Label>
                <Textarea
                  id={field.name}
                  className="mt-3"
                  placeholder="Masukkan deskripsi..."
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </>
      </BaseDialog>

      <BaseDialog
        open={activeDialogue === DIALOGUE_STATE.EDIT}
        onOpenChange={() => {
          if (activeDialogue === DIALOGUE_STATE.EDIT)
            setActiveDialogue(DIALOGUE_STATE.CLOSE);
        }}
        title="Edit Data Pembayaran Kontrak"
        className="max-w-3/5!"
        footer={
          <DialogFooter>
            <Button type="submit">Update</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={editForm.handleSubmit(handleEdit)}>
        <>
          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={editForm.control}
              name="payment_amount"
              render={({ field, fieldState }) => (
                <Field
                  className="flex flex-col"
                  data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="total">Nominal Pembayaran</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    placeholder="Masukkan nominal pembayaran"
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
              name="payment_date"
              render={({ field, fieldState }) => (
                <Field
                  className="flex flex-col"
                  data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Tanggal Pembayaran
                  </FieldLabel>
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
              name="payment_status"
              render={({ field, fieldState }) => (
                <Field
                  className="flex flex-col"
                  data-invalid={fieldState.invalid}>
                  <Label htmlFor="date">Apakah lunas?</Label>
                  <Switch
                    className="mt-3"
                    value={field.value.toString()}
                    name={field.name}
                    onCheckedChange={field.onChange}
                    defaultChecked={true}
                  />
                </Field>
              )}
            />
          </div>
          <Controller
            control={editForm.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col mt-3"
                data-invalid={fieldState.invalid}>
                <Label htmlFor={field.name}>Deskripsi</Label>
                <Textarea
                  id={field.name}
                  className="mt-3"
                  placeholder="Masukkan deskripsi..."
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </>
      </BaseDialog>

      <BaseDialog
        open={activeDialogue === DIALOGUE_STATE.DELETE}
        onOpenChange={() => {
          if (activeDialogue === DIALOGUE_STATE.DELETE)
            setActiveDialogue(DIALOGUE_STATE.CLOSE);
        }}
        title="Hapus Data Pembayaran Kontrak?"
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
