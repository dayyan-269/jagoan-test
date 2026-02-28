import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import * as z from "zod";
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { DIALOGUE_STATE, type DialogueType } from "@/types/dialogue";
import { Badge } from "@/components/ui/badge";
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
import BaseSheet from "@/components/base-sheet";
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
import { SheetClose } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkeletonTable from "@/components/skeleton-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  createResident,
  deleteResident,
  editResident,
  getResidents,
  type IEditResidentPayload,
  type IResident,
} from "@/handlers/housing/resident";

const residentSchema = z.object({
  name: z.string().nonempty("Nama penghuni harus diisi"),
  photo: z.string().optional(),
  marital_status: z.boolean().nonoptional("Status pernikahan harus diisi"),
  occupant_status: z.string().nonempty("Status penghuni harus diisi"),
  mobile_number: z.string().nonempty("Nomor telepon harus diisi"),
});

export const Route = createFileRoute("/_authenticated/residents/")({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["residents"],
        queryFn: () => getResidents(),
      }),
    );
  },
  component: RouteComponent,
  pendingComponent: SkeletonTable,
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const { data: residents } = useSuspenseQuery(
    queryOptions({
      queryKey: ["residents"],
      queryFn: () => getResidents(),
    }),
  );

  const [activeDialogue, setActiveDialogue] = useState<DialogueType>(
    DIALOGUE_STATE.CLOSE,
  );
  const [residentDetail, setResidentDetail] = useState<IResident | null>(null);

  const createForm = useForm<z.infer<typeof residentSchema>>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      name: "",
      photo: undefined,
      marital_status: false,
      occupant_status: "",
      mobile_number: "",
    },
    mode: "onSubmit",
  });

  const editForm = useForm<z.infer<typeof residentSchema>>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      name: "",
      photo: undefined,
      marital_status: false,
      occupant_status: "",
      mobile_number: "",
    },
    mode: "onSubmit",
  });

  const deleteForm = useForm({
    mode: "onSubmit",
  });

  useEffect(() => {
    editForm.reset({
      name: residentDetail?.name || "",
      photo: residentDetail?.photo || "",
      marital_status: residentDetail?.marital_status || false,
      occupant_status: residentDetail?.occupant_status || "",
      mobile_number: residentDetail?.mobile_number || "",
    });
  }, [residentDetail, editForm]);

  const createResidentMutation = useMutation({
    mutationFn: (payload) => {
      console.log('mut: ', payload);
      
     return createResident(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });

  const editResidentMutation = useMutation({
    mutationFn: (editPayload: IEditResidentPayload) =>
      editResident(editPayload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });

  const deleteResidentMutation = useMutation({
    mutationFn: (id: number) => deleteResident(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });

  const openDialogue = async (
    dialogue: DialogueType,
    resident: IResident = {},
  ) => {
    setActiveDialogue(dialogue);
    setResidentDetail(resident);
  };

  const handleCreate = (payload): void => {
    createResidentMutation.mutate(payload);
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data penghuni berhasil dibuat");
  };

  const handleEdit = (payload: Omit<IResident, "id">): void => {
    if (!residentDetail?.id) {
      throw new Error("Due type ID is missing");
    }
    editResidentMutation.mutate({ id: residentDetail.id, payload: payload });
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data penghuni berhasil diubah");
  };

  const handleDelete = (): void => {
    if (!residentDetail?.id) {
      throw new Error("Due type ID is missing");
    }
    deleteResidentMutation.mutate(residentDetail.id);
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data penghuni berhasil dihapus");
  };

  return (
    <>
      <h1 className="text-2xl font-semibold">Olah Data Penghuni</h1>
      <Button
        size={"lg"}
        className="mt-4 self-end w-fit"
        onClick={() => openDialogue(DIALOGUE_STATE.CREATE)}>
        <PlusCircle className="text-white" />
        Tambah Penghuni
      </Button>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Daftar Penghuni</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Foto KTP</TableHead>
                <TableHead>Status Penghuni</TableHead>
                <TableHead>No. Telp</TableHead>
                <TableHead>Status Menikah</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {residents.map((resident: IResident, index: number) => (
                <TableRow>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>
                    <p
                      className="text-purple-900 cursor-pointer font-bold"
                      onClick={() => openDialogue(DIALOGUE_STATE.DETAIL)}>
                      {resident.name}
                    </p>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge>Tetap</Badge>
                  </TableCell>
                  <TableCell>0818228373</TableCell>
                  <TableCell>Menikah</TableCell>
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
                              openDialogue(DIALOGUE_STATE.EDIT, resident)
                            }>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              openDialogue(DIALOGUE_STATE.DELETE, resident)
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

      <BaseSheet
        open={activeDialogue === DIALOGUE_STATE.CREATE}
        onOpenChange={() => setActiveDialogue(DIALOGUE_STATE.CLOSE)}
        title="Tambah Penghuni"
        footer={
          <>
            <Button>Simpan</Button>
            <SheetClose asChild>
              <Button variant={"ghost"}>Tutup</Button>
            </SheetClose>
          </>
        }
        onSubmit={createForm.handleSubmit(handleCreate)}>
        <div className="grid grid-cols-1 gap-x-3">
          <Controller
            name="name"
            control={createForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col mb-3"
                data-invalid={fieldState.invalid}>
                <FieldLabel className="mb-3">Nama</FieldLabel>
                <Input
                  placeholder="Nama Penghuni"
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
            name="photo"
            control={createForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col mb-3"
                data-invalid={fieldState.invalid}>
                <FieldLabel className="mb-3">Foto KTP</FieldLabel>
                <Input
                  placeholder="Foto KTP"
                  type="file"
                  accept=".jpg,.png,bmp,jpeg"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="mobile_number"
            control={createForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col mb-3"
                data-invalid={fieldState.invalid}>
                <FieldLabel className="mb-3">No. HP</FieldLabel>
                <Input
                  placeholder="Masukkan NO. HP"
                  type="text"
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
            name="occupant_status"
            control={createForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col mb-3"
                data-invalid={fieldState.invalid}>
                <FieldLabel className="mb-3">Status Penghuni</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Status Penghuni" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Tetap">Tetap</SelectItem>
                      <SelectItem value="Kontrak">Kontrak</SelectItem>
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
            name="marital_status"
            control={createForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col mb-3"
                data-invalid={fieldState.invalid}>
                <Label className="mb-3">Sudah Menikah?</Label>
                <Switch
                  name={field.name}
                  value={field.value}
                  onCheckedChange={field.onChange}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </BaseSheet>

      <BaseSheet
        open={activeDialogue === DIALOGUE_STATE.EDIT}
        onOpenChange={() => setActiveDialogue(DIALOGUE_STATE.CLOSE)}
        title="Edit Data Penghuni"
        footer={
          <>
            <Button>Simpan</Button>
            <SheetClose asChild>
              <Button variant={"ghost"}>Tutup</Button>
            </SheetClose>
          </>
        }
        onSubmit={editForm.handleSubmit(handleEdit)}>
        <div className="grid grid-cols-1 gap-x-3">
          <Controller
            name="name"
            control={editForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col mb-3"
                data-invalid={fieldState.invalid}>
                <Label className="mb-3">Nama</Label>
                <Input
                  placeholder="Nama Penghuni"
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
            name="photo"
            control={createForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col mb-3"
                data-invalid={fieldState.invalid}>
                <FieldLabel className="mb-3">Foto KTP</FieldLabel>
                <Input
                  placeholder="Foto KTP"
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
            name="phone_number"
            control={createForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col mb-3"
                data-invalid={fieldState.invalid}>
                <FieldLabel className="mb-3">No. HP</FieldLabel>
                <Input
                  placeholder="Masukkan NO. HP"
                  type="text"
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
            name="status"
            control={createForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col mb-3"
                data-invalid={fieldState.invalid}>
                <FieldLabel className="mb-3">Status Penghuni</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Status Penghuni" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="piliih">
                        Pilih Status Penghuni
                      </SelectItem>
                      <SelectItem value="Tetap">Tetap</SelectItem>
                      <SelectItem value="Kontrak">Kontrak</SelectItem>
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
            name="marital_status"
            control={createForm.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col mb-3"
                data-invalid={fieldState.invalid}>
                <Label className="mb-3">Sudah Menikah?</Label>
                <Switch
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </BaseSheet>

      <BaseSheet
        open={activeDialogue === DIALOGUE_STATE.DETAIL}
        onOpenChange={() => setActiveDialogue(DIALOGUE_STATE.CLOSE)}
        title="History Pembayaran">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="housing">Kontrak Rumah</TabsTrigger>
            <TabsTrigger value="due">Iuran</TabsTrigger>
          </TabsList>
          <TabsContent value="housing">
            <Card>
              <CardContent className="flex flex-col">
                <p className="font-bold">Pembayaran Kontrak Bulan September</p>
                <div className="flex flex-row mt-3 justify-between">
                  <p className="text-primary">Rp 400.000</p>
                  <p className="text-xs font-semibold">12 September 2025</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="due">
            <Card>
              <CardContent className="flex flex-col">
                <p className="font-bold">Pembayaran Iuran Bulan September</p>
                <div className="flex flex-row mt-3 justify-between">
                  <p className="text-primary">Rp 400.000</p>
                  <p className="text-xs font-semibold">12 September 2025</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </BaseSheet>

      <BaseDialog
        open={activeDialogue === DIALOGUE_STATE.DELETE}
        onOpenChange={() => setActiveDialogue(DIALOGUE_STATE.CLOSE)}
        title="Hapus Data Penghuni?"
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
