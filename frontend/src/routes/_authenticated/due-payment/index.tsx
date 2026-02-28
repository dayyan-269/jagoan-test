import { useState } from "react";
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

export const Route = createFileRoute("/_authenticated/due-payment/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);

  const handleDelete = (): void => setDeleteOpen(!isDeleteOpen);
  const handleEdit = (): void => setEditOpen(!isEditOpen);
  const handleCreate = (): void => setCreateOpen(!isCreateOpen);
  return (
    <>
      <h1 className="text-2xl font-semibold">Olah Data Pembayaran Iuran</h1>
      <Button
        size={"lg"}
        className="mt-4 self-end w-fit"
        onClick={handleCreate}>
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
              <TableRow>
                <TableCell>1.</TableCell>
                <TableCell>Joko Anwar</TableCell>
                <TableCell>Pembayaran Perbaikan Jalan</TableCell>
                <TableCell>Rp 10.000</TableCell>
                <TableCell>12 Desember 2025</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleEdit}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={handleDelete}>
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BaseDialog
        open={isCreateOpen}
        onOpenChange={handleCreate}
        title="Tambah Data Pembayaran Iuran"
        className="max-w-3/5!"
        footer={
          <DialogFooter>
            <Button>Simpan</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }>
        <>
          <div className="grid grid-col-1 gap-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <Label htmlFor="type" className="mb-3">
                  Penghuni
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Penghuni Rumah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="light">Joko Anwar</SelectItem>
                      <SelectItem value="dark">Wali Dodo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="type" className="mb-3">
                  Jenis Iuran
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Jenis Pembayaran Iuran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="light">
                        Iuran Satpam | Rp 20.000
                      </SelectItem>
                      <SelectItem value="dark">
                        Iuran Kebersihan | Rp. 10.000
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="date">Tanggal Pembayaran</Label>
                <Input
                  id="date"
                  type="date"
                  placeholder="Masukkan tanggal pembayaran"
                  required
                  className="mt-3"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="date">Jumlah Pembayaran</Label>
                <div className="flex flex-row mt-3">
                  <Input
                    id="month"
                    type="number"
                    placeholder="Masukkan jumlah pembayaran"
                    required
                    className="rounded-br-none rounded-tr-none"
                    defaultValue={1}
                  />
                  <div className="flex py-1 px-2 bg-white h-fit rounded-br-md rounded-tr-md border-2 border-primary">
                    Bulan
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col">
                <Label htmlFor="date">Deskripsi</Label>
                <Textarea
                  className="mt-3"
                  placeholder="Masukkan deskripsi..."
                />
              </div>
            </div>
          </div>
        </>
      </BaseDialog>

      <BaseDialog
        open={isEditOpen}
        onOpenChange={handleEdit}
        title="Edit Data Pembayaran Iuran"
        className="max-w-3/5!"
        footer={
          <DialogFooter>
            <Button>Update</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }>
        <>
          <div className="grid grid-col-1 gap-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <Label htmlFor="type" className="mb-3">
                  Penghuni
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Penghuni Rumah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="light">Joko Anwar</SelectItem>
                      <SelectItem value="dark">Wali Dodo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="type" className="mb-3">
                  Jenis Iuran
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Jenis Pembayaran Iuran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="light">
                        Iuran Satpam | Rp 20.000
                      </SelectItem>
                      <SelectItem value="dark">
                        Iuran Kebersihan | Rp. 10.000
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="date">Tanggal Pembayaran</Label>
                <Input
                  id="date"
                  type="date"
                  placeholder="Masukkan tanggal pembayaran"
                  required
                  className="mt-3"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="date">Jumlah Pembayaran</Label>
                <div className="flex flex-row mt-3">
                  <Input
                    id="month"
                    type="number"
                    placeholder="Masukkan jumlah pembayaran"
                    required
                    className="rounded-br-none rounded-tr-none"
                    defaultValue={1}
                  />
                  <div className="flex py-1 px-2 bg-white h-fit rounded-br-md rounded-tr-md border-2 border-primary">
                    Bulan
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col">
                <Label htmlFor="date">Deskripsi</Label>
                <Textarea
                  className="mt-3"
                  placeholder="Masukkan deskripsi..."
                />
              </div>
            </div>
          </div>
        </>
      </BaseDialog>

      <BaseDialog
        open={isDeleteOpen}
        onOpenChange={handleDelete}
        title="Hapus Data Pembayaran Iuran?"
        description="Apakah anda yakin ingin menghapus data ini?"
        footer={
          <DialogFooter>
            <Button variant={"destructive"}>Hapus</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }
      />
    </>
  );
}
