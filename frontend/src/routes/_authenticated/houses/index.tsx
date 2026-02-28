import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import {
  queryOptions,
  useMutation,
  useQuery,
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
import { EllipsisVertical, PlusCircle, Timer, UserKey } from "lucide-react";

import BaseDialog from "@/components/base-dialog";
import BaseSheet from "@/components/base-sheet";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SkeletonTable from "@/components/skeleton-table";
import {
  assignHouse,
  createHouse,
  deleteHouse,
  editHouse,
  endContract,
  getHouseHistory,
  getHouses,
  type IAssignPayload,
  type IEditHousePayload,
  type IEndContractPayload,
  type IHouse,
} from "@/handlers/housing/house";
import { getResidents } from "@/handlers/housing/resident";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const houseSchema = z.object({
  number: z.string().nonempty("No. rumah harus diisi"),
});

const assignSchema = z.object({
  resident_id: z.string().nonempty("Penghuni harus diisi"),
  amount: z.string().nonempty("Nominal harus diisi"),
  date: z.string().nonempty("Tanggal harus diisi"),
  description: z.string().optional(),
});

const endContractSchema = z.object({
  end_date: z.string().nonempty("Tanggal berakhir harus diisi"),
});

export const Route = createFileRoute("/_authenticated/houses/")({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["houses"],
        queryFn: () => getHouses(),
      }),
    );
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

  const { data: houses } = useSuspenseQuery(
    queryOptions({
      queryKey: ["houses"],
      queryFn: () => getHouses(),
    }),
  );

  const { data: residents } = useSuspenseQuery(
    queryOptions({
      queryKey: ["residents"],
      queryFn: () => getResidents(),
    }),
  );

  const [activeDialogue, setActiveDialogue] = useState<DialogueType>(
    DIALOGUE_STATE.CLOSE,
  );
  const [houseDetail, setHouseDetail] = useState<IHouse | null>(null);

  const { data: houseHistory, isLoading } = useQuery({
    queryKey: ["houseHistory", houseDetail?.id],
    queryFn: () => getHouseHistory(houseDetail?.id),
    enabled: !!houseDetail?.id,
  });

  useEffect(() => {
    console.log(houseHistory);
  }, [houseHistory]);

  const createForm = useForm<z.infer<typeof houseSchema>>({
    resolver: zodResolver(houseSchema),
    defaultValues: {
      number: "",
    },
    mode: "onSubmit",
  });

  const editForm = useForm<z.infer<typeof houseSchema>>({
    resolver: zodResolver(houseSchema),
    defaultValues: {
      number: "",
    },
    mode: "onSubmit",
  });

  const assignForm = useForm<z.infer<typeof assignSchema>>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      resident_id: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      description: "",
    },
    mode: "onSubmit",
  });

  const endContractForm = useForm<z.infer<typeof endContractSchema>>({
    resolver: zodResolver(endContractSchema),
    defaultValues: {
      end_date: new Date().toISOString().split("T")[0],
    },
    mode: "onSubmit",
  });

  const deleteForm = useForm({
    mode: "onSubmit",
  });

  useEffect(() => {
    editForm.reset({
      number: houseDetail?.number || "",
    });
  }, [houseDetail, editForm]);

  const createHouseMutation = useMutation({
    mutationFn: (payload: Omit<IHouse, "id" | "recent_occupant">) =>
      createHouse(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["houses"] });
    },
  });

  const editHouseMutation = useMutation({
    mutationFn: (editPayload: IEditHousePayload) => editHouse(editPayload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["houses"] });
    },
  });

  const deleteHouseMutation = useMutation({
    mutationFn: (id: number) => deleteHouse(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["houses"] });
    },
  });

  const assignHouseMutation = useMutation({
    mutationFn: (assignPayload: IAssignPayload) => assignHouse(assignPayload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["houses"] });
    },
  });

  const endContractMutation = useMutation({
    mutationFn: (endContractPayload: IEndContractPayload) =>
      endContract(endContractPayload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["houses"] });
    },
  });

  const openDialogue = async (dialogue: DialogueType, house: IHouse = {}) => {
    setActiveDialogue(dialogue);
    setHouseDetail({ ...house, id: house.id });
  };

  const handleCreate = (
    payload: Omit<IHouse, "id" | "recent_occupant">,
  ): void => {
    createHouseMutation.mutate(payload);
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data jenis iuran berhasil dibuat");
  };

  const handleEdit = (
    payload: Omit<IHouse, "id" | "recent_occupant">,
  ): void => {
    if (!houseDetail?.id) {
      throw new Error("House ID is missing");
    }

    editHouseMutation.mutate({ id: houseDetail.id, payload: payload });
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data jenis iuran berhasil diubah");
  };

  const handleDelete = (): void => {
    if (!houseDetail?.id) {
      throw new Error("House ID is missing");
    }

    deleteHouseMutation.mutate(houseDetail.id);
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Data jenis iuran berhasil dihapus");
  };

  const handleAssignHouse = (payload): void => {
    if (!houseDetail?.id) {
      throw new Error("House ID is missing");
    }

    assignHouseMutation.mutate({
      id: houseDetail.id,
      payload: payload,
    });
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Penghuni telah dipindahkan");
  };

  const handleStopContract = (payload): void => {
    if (!houseDetail?.id) {
      throw new Error("House ID is missing");
    }
    console.log(payload);

    endContractMutation.mutate({
      id: houseDetail.id,
      payload: payload,
    });
    setActiveDialogue(DIALOGUE_STATE.CLOSE);
    toast("Kontrak penghuni telah dihentikan");
  };

  return (
    <>
      <h1 className="text-2xl font-semibold">Olah Data Rumah</h1>
      <Button
        size={"lg"}
        className="mt-4 self-end w-fit"
        onClick={() => setActiveDialogue(DIALOGUE_STATE.CREATE)}>
        <PlusCircle className="text-white" />
        Tambah Rumah
      </Button>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Daftar Rumah</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>No. Rumah</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {houses.map((house: IHouse, index: number) => (
                <TableRow key={house.id}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>#{house.number}</TableCell>
                  <TableCell>
                    {house.recent_occupant ? (
                      <Badge>Dihuni oleh {house.recent_occupant}</Badge>
                    ) : (
                      <Badge variant={"destructive"}>Tidak Dihuni</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        openDialogue(DIALOGUE_STATE.DETAIL_1, house)
                      }>
                      <UserKey className="text-yellow-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        openDialogue(DIALOGUE_STATE.DETAIL_2, house)
                      }>
                      <Timer className="text-green-600" />
                    </Button>
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
                              openDialogue(DIALOGUE_STATE.DETAIL, house)
                            }>
                            History
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              openDialogue(DIALOGUE_STATE.EDIT, house)
                            }>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              openDialogue(DIALOGUE_STATE.DELETE, house)
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
        open={activeDialogue === DIALOGUE_STATE.DETAIL}
        onOpenChange={() => {
          if (activeDialogue === DIALOGUE_STATE.DETAIL)
            setActiveDialogue(DIALOGUE_STATE.CLOSE);
        }}
        title="History Penghuni Rumah">
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-y-3">
              <Skeleton className="w-full h-30" />
              <Skeleton className="w-full h-30" />
              <Skeleton className="w-full h-30" />
              <Skeleton className="w-full h-30" />
              <Skeleton className="w-full h-30" />
            </div>
          ) : (
            <Accordion type="multiple">
              {houseHistory !== null ? (
                houseHistory?.map((occupant) => (
                  <AccordionItem value={`oc-${occupant.id}`}>
                    <AccordionTrigger className="font-semibold">
                      {occupant.resident.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableHead>Tanggal Pembayaran</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Nominal</TableHead>
                        </TableHeader>
                        <TableBody>
                          {occupant?.house_payment.map((payment) => (
                            <TableRow key={`py-${payment.id}`}>
                              <TableCell>{payment.payment_date}</TableCell>
                              <TableCell>
                                <Badge>{payment.payment_status}</Badge>
                              </TableCell>
                              <TableCell>Rp {payment.payment_amount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="flex flex-col w-full h-full align-middle self-center">
                  Tidak ada data...
                </div>
              )}
            </Accordion>
          )}
        </>
      </BaseSheet>

      <BaseDialog
        open={activeDialogue === DIALOGUE_STATE.DETAIL_2}
        onOpenChange={() => {
          if (activeDialogue === DIALOGUE_STATE.DETAIL_2)
            setActiveDialogue(DIALOGUE_STATE.CLOSE);
        }}
        title="Akhiri Kontrak Rumah"
        footer={
          <DialogFooter>
            <Button type="submit">Simpan</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={endContractForm.handleSubmit(handleStopContract)}>
        <Controller
          name="end_date"
          control={endContractForm.control}
          render={({ field, fieldState }) => (
            <Field className="flex flex-col" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="mb-3">
                Tanggal Kontrak Berakhir
              </FieldLabel>
              <Input
                id={field.name}
                type="date"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </BaseDialog>

      <BaseDialog
        open={activeDialogue === DIALOGUE_STATE.DETAIL_1}
        onOpenChange={() => {
          if (activeDialogue === DIALOGUE_STATE.DETAIL_1)
            setActiveDialogue(DIALOGUE_STATE.CLOSE);
        }}
        title="Pindah Penghuni Rumah"
        className="max-w-3/5!"
        footer={
          <DialogFooter>
            <Button type="submit">Simpan</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={assignForm.handleSubmit(handleAssignHouse)}>
        <>
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="resident_id"
              control={assignForm.control}
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
              name="amount"
              control={assignForm.control}
              render={({ field, fieldState }) => (
                <Field className="flex flex-col" data-aria={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Nominal Pembayaran
                  </FieldLabel>
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
              name="date"
              control={assignForm.control}
              render={({ field, fieldState }) => (
                <Field className="flex flex-col" data-aria={fieldState.invalid}>
                  <FieldLabel htmlFor="date">Tanggal Pembayaran</FieldLabel>
                  <Input
                    id="date"
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
            name="description"
            control={assignForm.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col mt-3" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="date">Deskripsi</FieldLabel>
                <Textarea placeholder="Masukkan deskripsi..." {...field} aria-invalid={fieldState.invalid} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </>
      </BaseDialog>

      <BaseDialog
        open={activeDialogue === DIALOGUE_STATE.CREATE}
        onOpenChange={() => {
          if (activeDialogue === DIALOGUE_STATE.CREATE)
            setActiveDialogue(DIALOGUE_STATE.CLOSE);
        }}
        title="Tambah Data Rumah"
        footer={
          <DialogFooter>
            <Button type="submit">Simpan</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={createForm.handleSubmit(handleCreate)}>
        <Controller
          name="number"
          control={createForm.control}
          render={({ field, fieldState }) => (
            <Field className="flex flex-col">
              <FieldLabel htmlFor="no">No. Rumah</FieldLabel>
              <Input
                id="no"
                placeholder="Masukkan no. rumah"
                className="mt-3"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </BaseDialog>

      <BaseDialog
        open={activeDialogue === DIALOGUE_STATE.EDIT}
        onOpenChange={() => {
          if (activeDialogue === DIALOGUE_STATE.EDIT)
            setActiveDialogue(DIALOGUE_STATE.CLOSE);
        }}
        title="Edit Data Rumah"
        footer={
          <DialogFooter>
            <Button type="submit">Update</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
        onSubmit={editForm.handleSubmit(handleEdit)}>
        <Controller
          name="number"
          control={editForm.control}
          render={({ field, fieldState }) => (
            <Field className="flex flex-col" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="no">No. Rumah</FieldLabel>
              <Input
                id="no"
                placeholder="Masukkan no. rumah"
                className="mt-3"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </BaseDialog>

      <BaseDialog
        open={activeDialogue === DIALOGUE_STATE.DELETE}
        onOpenChange={() => {
          if (activeDialogue === DIALOGUE_STATE.DETAIL_1)
            setActiveDialogue(DIALOGUE_STATE.CLOSE);
        }}
        title="Hapus Data Rumah?"
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
