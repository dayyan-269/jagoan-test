<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\finance\DuePayment;
use App\finance\Spending;
use App\housing\HousePayment;

class StatsController extends Controller
{
    public function getMonthlyStats(Request $request): JsonResponse
    {
        $month = $request->month ?? now()->month;
        $year = $request->year ?? now()->year;

        // Data for the quick stats

        $spendingTotal = DB::table('spendings')
            ->join('spending_types', 'spendings.spending_type_id', '=', 'spending_types.id')
            ->sum('spending_types.amount');

        $spendingThisMonth = DB::table('spendings')
            ->join('spending_types', 'spendings.spending_type_id', '=', 'spending_types.id')
            ->whereMonth('spendings.date', $month)
            ->whereYear('spendings.date', $year)
            ->sum('spending_types.amount');

        $duePaymentTotal = DB::table('due_payments')
            ->join('due_types', 'due_payments.due_type_id', 'due_types.id')
            ->sum('due_types.amount');

        $housePaymentTotal = DB::table('house_payments')
            ->join('occupant_histories', 'house_payments.occupant_history_id', 'occupant_histories.id')
            ->sum('house_payments.payment_amount');

        $earningTotal = $duePaymentTotal + $housePaymentTotal;
        $saldoTotal = abs($earningTotal - (int) $spendingTotal);

        // Data for the graph

        $monthlySpending = DB::table('spendings')
            ->join('spending_types', 'spendings.spending_type_id', 'spending_types.id')
            ->whereYear('spendings.date', $year)
            ->groupBy('month')
            ->select([
                DB::raw('MONTH(spendings.date) as month'),
                DB::raw('CONVERT(SUM(spending_types.amount), UNSIGNED) as spending_total'),
            ])
            ->pluck( 'spending_total', 'month');

        $monthlyDue = DB::table('due_payments')
            ->join('due_types', 'due_payments.due_type_id', 'due_types.id')
            ->whereYear('due_payments.date', $year)
            ->groupBy('month')
            ->select([
                DB::raw('SUM(due_types.amount) as earning_total'),
                DB::raw('MONTH(due_payments.date) as month')
            ])
            ->pluck('earning_total', 'month');

        $monthlyHouse = DB::table('house_payments')
            ->whereYear('payment_date', $year)
            ->groupBy('month')
            ->select([
                DB::raw('SUM(payment_amount) as earning_total'),
                DB::raw('MONTH(payment_date) as month')
            ])
            ->pluck( 'earning_total', 'month');

        
        $monthlySpending = collect(range(1, 12))->map(function ($month) use ($monthlySpending) {
            return [
                'month' => Carbon::create()->month($month)->format('F'),
                'total_pengeluaran' => $monthlySpending->get($month, 0),
            ];
        });

        $monthlyEarning = collect(range(1, 12))->map(function ($month) use ($monthlyDue, $monthlyHouse) {
            return [
                'month' => Carbon::create()->month($month)->format('F'),
                'total_pendapatan' => (int) $monthlyHouse->get($month, 0) + (int) $monthlyDue->get($month, 0),
            ];
        });

        return response()->json([
            'message' => 'request success',
            'data' => [
                'earning_total' => $earningTotal,
                'monthly_spending' => (int) $spendingThisMonth,
                'saldo_total' => $saldoTotal,
                'monthly_stats' => [
                    'earning' => $monthlyEarning,
                    'spending' => $monthlySpending,
                ]
            ],
        ]);
    }

    public function getMonthlySpending(Request $request): JsonResponse
    {
        $month = $request->month ?? now()->month;
        $year = $request->year ?? now()->year;

        $spending = Spending::with('spendingType')
            ->when($month, function (Builder $q) use ($month) {
                return $q->whereMonth('date', $month);
            })
            ->when($year, function (Builder $q) use ($year) {
                return $q->whereYear('date', $year);
            })
            ->get();

        return response()->json([
            'message' => 'request success',
            'data' => $spending,
        ]);
    }

    public function getMonthlyEarning(Request $request): JsonResponse
    {
        $month = $request->month ?? now()->month;
        $year = $request->year ?? now()->year;

        $rawDuePayment = DuePayment::with('dueType', 'resident')
            ->when($month, function (Builder $q) use ($month) {
                return $q->whereMonth('date', $month);
            })
            ->when($year, function (Builder $q) use ($year) {
                return $q->whereYear('date', $year);
            })
            ->get();

        $rawHousePayment = HousePayment::with('occupantHistory', 'occupantHistory.resident')
            ->when($month, function (Builder $q) use ($month) {
                return $q->whereMonth('payment_date', $month);
            })
            ->when($year, function (Builder $q) use ($year) {
                return $q->whereYear('payment_date', $year);
            })
            ->get();

        $housePayment = $rawHousePayment->map(function ($item) {
            return [
                'resident_name' => $item->occupantHistory->resident->name,
                'date' => Carbon::parse($item->payment_date)->format('d F Y'),
                'payment_amount' => $item->payment_amount,
                'description' => $item->description,
                'payment_type' => 'Pembayaran Rumah',
            ];
        });

        $duePayment = $rawDuePayment->map(function ($item) {
            return [
                'resident_name' => $item->resident->name,
                'date' => Carbon::parse($item->date)->format('d F Y'),
                'payment_amount' => $item->dueType->amount,
                'description' => $item->description,
                'payment_type' => 'Pembayaran Iuran',
            ];
        });

        $earning = $housePayment->merge($duePayment)->sortBy('date', descending: true)->values();

        return response()->json([
            'message' => 'request success',
            'data' => $earning,
        ]);
    }
}
