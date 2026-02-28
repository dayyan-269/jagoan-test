import { createFileRoute, redirect } from "@tanstack/react-router";
import { Filter } from "lucide-react";

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
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { sumArray } from "@/utils";

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

function RouteComponent() {
  const queryClient = useQueryClient();

  const { data: monthlyStats } = useSuspenseQuery(
    queryOptions({
      queryKey: ["monthlyStats"],
      queryFn: () => getMonthlyStats(),
    }),
  );

  const { data: financialReport } = useSuspenseQuery(
    queryOptions({
      queryKey: ["financialReport"],
      queryFn: () => getFinancialReport(),
    }),
  );

  const chartConfigEarning = {
    total_pendapatan: {
      label: "Pemasukan",
      color: "#b1b45b"
    },
  } satisfies ChartConfig;

  const chartConfigSpending = {
    total_pengeluaran: {
      label: "Pemasukan",
      color: "#009869"
    },
  } satisfies ChartConfig;

  const statsEarning = monthlyStats?.monthly_stats.earning;
  const statsSpending = monthlyStats?.monthly_stats.spending;

  // TODO: FILTER by tanggal

  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card className="bg-blue-300">
            <CardContent>
              <div className="text-sm text-white">Total Saldo</div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {monthlyStats?.saldo_total || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-300">
            <CardContent>
              <div className="text-sm text-white">Pemasukan Bulan Ini</div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {monthlyStats?.earning_total || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-300">
            <CardContent>
              <div className="text-sm text-white">Pengeluaran Bulan Ini</div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {monthlyStats?.monthly_spending || 0}
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
            <Bar dataKey="total_pendapatan" fill={chartConfigEarning.total_pendapatan.color} radius={4} />
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
            <Bar dataKey="total_pengeluaran" fill={chartConfigSpending.total_pengeluaran.color} radius={4} />
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
          <CardContent className="grid grid-cols-[2fr_2fr_0.5fr] gap-x-3">
            <div className="flex flex-col">
              <Label className="mb-3">Tanggal Awal</Label>
              <Input type="date" placeholder="Masukkan tanggal awal" required />
            </div>
            <div className="flex flex-col">
              <Label className="mb-3">Tanggal Akhir</Label>
              <Input
                type="date"
                placeholder="Masukkan tanggal akhir"
                required
              />
            </div>
            <Button className="mt-auto">
              <Filter />
              Filter
            </Button>
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
                {financialReport?.earnings?.map((earning) => (
                  <TableRow key={earning.id}>
                    <TableCell>{earning.date}</TableCell>
                    <TableCell>{earning.resident_name}</TableCell>
                    <TableCell>{earning.payment_type}</TableCell>
                    <TableCell>{earning.payment_amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} />
                  <TableCell>Total Pemasukan</TableCell>
                  <TableCell>Rp {sumArray(financialReport?.earnings, 'total_pendapatan')}</TableCell>
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
                {financialReport?.spendings?.map((spending) => (
                  <TableRow key={spending.id}>
                    <TableCell>{spending.date}</TableCell>
                    <TableCell>{spending.description}</TableCell>
                    <TableCell>{spending.spending_type.name}</TableCell>
                    <TableCell>{spending.spending_type.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} />
                  <TableCell>Total Pengeluaran</TableCell>
                  <TableCell>Rp 10.000.000</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
