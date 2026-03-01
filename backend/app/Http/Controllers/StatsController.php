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
            ->where('payment_status', 'Lunas')
            ->sum('house_payments.payment_amount');

        $duePaymentMonthly = DB::table('due_payments')
            ->join('due_types', 'due_payments.due_type_id', 'due_types.id')
            ->whereMonth('due_payments.date', $month)
            ->whereYear('due_payments.date', $year)
            ->sum('due_types.amount');

        $housePaymentMonthly = DB::table('house_payments')
            ->join('occupant_histories', 'house_payments.occupant_history_id', 'occupant_histories.id')
            ->where('payment_status', 'Lunas')
            ->whereMonth('house_payments.payment_date', $month)
            ->whereYear('house_payments.payment_date', $year)
            ->sum('house_payments.payment_amount');

        $earningTotal = $duePaymentTotal + $housePaymentTotal;
        $earningMonthly = $housePaymentMonthly + $duePaymentMonthly;
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
            ->pluck('spending_total', 'month');

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
            ->where('payment_status', 'Lunas')
            ->groupBy('month')
            ->select([
                DB::raw('SUM(payment_amount) as earning_total'),
                DB::raw('MONTH(payment_date) as month')
            ])
            ->pluck('earning_total', 'month');


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
                'earning_total' => $earningMonthly,
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
        $startDate = $request->start_date ?? now()->toDateString();
        $endDate = $request->end_date ?? now()->addMonthNoOverflow(1)->toDateString();

        $spending = Spending::with('spendingType')
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $spendingTotal = $spending->sum('spending_type.amount');

        return response()->json([
            'message' => 'request success',
            'data' => ['spending' => $spending, 'spending_total' => $spendingTotal],
        ]);
    }

    public function getMonthlyEarning(Request $request): JsonResponse
    {
        $startDate = $request->start_date ?? now()->toDateString();
        $endDate = $request->end_date ?? now()->addMonthNoOverflow(1)->toDateString();

        $rawDuePayment = DuePayment::with('dueType', 'resident')
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $rawHousePayment = HousePayment::with('occupantHistory', 'occupantHistory.resident')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->where('payment_status', 'Lunas')
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
        $earningTotal = collect($earning)->sum('payment_amount');

        return response()->json([
            'message' => 'request success',
            'data' => ['earning' => $earning, 'earning_total' => $earningTotal],
        ]);
    }
}
