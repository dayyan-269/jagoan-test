import { createFileRoute, redirect } from "@tanstack/react-router";
import { Filter } from "lucide-react";
import * as z from "zod";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SkeletonDashboard from "@/components/skeleton-dashboard";

import { isAuthenticated } from "@/handlers/authHandler";
import { getMonthlyStats, getFinancialReport } from "@/handlers/finance";
import {
  keepPreviousData,
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { formatRupiah } from "@/utils";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export const Route = createFileRoute("/_authenticated/dashboard")({
  beforeLoad: () => {
    const authenticated = isAuthenticated();
    if (authenticated) {
      throw redirect({ to: "/" });
    }
  },
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["monthlyStats"],
        queryFn: () => getMonthlyStats(),
      }),
    );
    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["financialReport"],
        queryFn: () => getFinancialReport(),
      }),
    );
  },
  component: RouteComponent,
  pendingComponent: SkeletonDashboard,
});

const filterSchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
});

function RouteComponent() {
  const [filter, setFilter] = useState<{
    start_date: string;
    end_date: string;
  }>({
    start_date: "",
    end_date: "",
  });

  const filterForm = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: filter,
    mode: "onSubmit",
  });

  const queryClient = useQueryClient();

  const { data: monthlyStats } = useSuspenseQuery(
    queryOptions({
      queryKey: ["monthlyStats"],
      queryFn: () => getMonthlyStats(),
    }),
  );

  const { data: financialReport } = useSuspenseQuery(
    queryOptions({
      queryKey: ["financialReport", filter],
      queryFn: () => getFinancialReport(filter),
      placeholderData: keepPreviousData,
    }),
  );

  console.log(financialReport);
  

  const chartConfigEarning = {
    total_pendapatan: {
      label: "Pemasukan",
      color: "#b1b45b",
    },
  } satisfies ChartConfig;

  const chartConfigSpending = {
    total_pengeluaran: {
      label: "Pemasukan",
      color: "#009869",
    },
  } satisfies ChartConfig;

  const statsEarning = monthlyStats?.monthly_stats.earning;
  const statsSpending = monthlyStats?.monthly_stats.spending;

  // TODO: FILTER by tanggal
  const handleFilter = (payload: {
    start_date?: string;
    end_date?: string;
  }) => {
    setFilter(payload);
    toast("data telah difilter");
  };

  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card className="bg-blue-300">
            <CardContent>
              <div className="text-sm text-white">Total Saldo</div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {formatRupiah(monthlyStats?.saldo_total) || "Rp 0"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-300">
            <CardContent>
              <div className="text-sm text-white">Pemasukan Bulan Ini</div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {formatRupiah(monthlyStats?.earning_total) || "Rp 0"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-300">
            <CardContent>
              <div className="text-sm text-white">Pengeluaran Bulan Ini</div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {formatRupiah(monthlyStats?.monthly_spending) || "Rp 0"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p text-2xl font-semibold">
          Grafik Pendapatan Tahun Ini
        </div>
        <ChartContainer
          config={chartConfigEarning}
          className="min-h-[200px] w-full p-10">
          <BarChart accessibilityLayer data={statsEarning}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="total_pendapatan"
              fill={chartConfigEarning.total_pendapatan.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>

        <div className="p text-2xl font-semibold">
          Grafik Pengeluaran Tahun Ini
        </div>
        <ChartContainer
          config={chartConfigSpending}
          className="min-h-[200px] w-full p-10">
          <BarChart accessibilityLayer data={statsSpending}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="total_pengeluaran"
              fill={chartConfigSpending.total_pengeluaran.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="flex flex-col mb-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold mb-4">
              Filter Laporan Finansial
            </h1>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={filterForm.handleSubmit(handleFilter)}
              className="grid grid-cols-[2fr_2fr_0.5fr] gap-x-3">
              <Controller
                control={filterForm.control}
                name="start_date"
                render={({ field, fieldState }) => (
                  <Field className="flex flex-col">
                    <FieldLabel
                      className="mb-3"
                      data-invalid={fieldState.invalid}>
                      Tanggal Akhir
                    </FieldLabel>
                    <Input
                      type="date"
                      placeholder="Masukkan tanggal awal"
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
                control={filterForm.control}
                name="end_date"
                render={({ field, fieldState }) => (
                  <Field className="flex flex-col">
                    <FieldLabel
                      className="mb-3"
                      data-invalid={fieldState.invalid}>
                      Tanggal Akhir
                    </FieldLabel>
                    <Input
                      type="date"
                      placeholder="Masukkan tanggal akhir"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button className="mt-auto" type="submit">
                <Filter />
                Filter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pemasukan Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="min-w-170">
              <TableHeader>
                <tr>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jenis Pemasukan</TableHead>
                  <TableHead>Nominal</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {financialReport?.earnings.earning?.map((earning) => (
                  <TableRow key={earning.id}>
                    <TableCell>{earning.date}</TableCell>
                    <TableCell>{earning.resident_name}</TableCell>
                    <TableCell>{earning.payment_type}</TableCell>
                    <TableCell>
                      {formatRupiah(earning.payment_amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} />
                  <TableCell>Total Pemasukan</TableCell>
                  <TableCell>
                    {formatRupiah(financialReport?.earnings.earning_total)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengeluaran Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="min-w-170">
              <TableHeader>
                <tr>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jenis Pengeluaran</TableHead>
                  <TableHead>Nominal</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {financialReport?.spendings.spending?.map((spending) => (
                  <TableRow key={spending.id}>
                    <TableCell>{spending.date}</TableCell>
                    <TableCell>{spending.description}</TableCell>
                    <TableCell>{spending.spending_type.name}</TableCell>
                    <TableCell>
                      {formatRupiah(spending.spending_type.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} />
                  <TableCell>Total Pengeluaran</TableCell>
                  <TableCell>
                    {formatRupiah(financialReport?.spendings.spending_total)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
