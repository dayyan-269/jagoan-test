import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/spending/")({
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
      <h1 className="text-2xl font-semibold">Olah Data Pengeluaran</h1>
      <Button
        size={"lg"}
        className="mt-4 self-end w-fit"
        onClick={handleCreate}>
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
              <TableRow>
                <TableCell>1.</TableCell>
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
        title="Tambah Data Pengeluaran"
        footer={
          <DialogFooter>
            <Button>Simpan</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }>
        <>
          <div className="flex flex-col">
            <Label htmlFor="type" className="mb-3">
              Jenis Pengeluaran
            </Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Jenis Pengeluaran" />
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
            <Label htmlFor="date">Deskripsi</Label>
            <Textarea className="mt-3" placeholder="Masukkan deskripsi..." />
          </div>
        </>
      </BaseDialog>

      <BaseDialog
        open={isEditOpen}
        onOpenChange={handleEdit}
        title="Edit Data Pengeluaran"
        footer={
          <DialogFooter>
            <Button>Update</Button>
            <DialogClose asChild>
              <Button variant="outline">Kembali</Button>
            </DialogClose>
          </DialogFooter>
        }>
        <>
          <div className="flex flex-col">
            <Label htmlFor="type" className="mb-3">
              Jenis Pengeluaran
            </Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Jenis Pengeluaran" />
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
            <Label htmlFor="date">Deskripsi</Label>
            <Textarea className="mt-3" placeholder="Masukkan deskripsi..." />
          </div>
        </>
      </BaseDialog>

      <BaseDialog
        open={isDeleteOpen}
        onOpenChange={handleDelete}
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
      />
    </>
  );
}
