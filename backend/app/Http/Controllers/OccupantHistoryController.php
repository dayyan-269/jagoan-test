<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\housing\HousePayment;
use App\Http\Requests\Housing\OccupantHistory\StoreOccupantHistoryRequest;
use App\Http\Requests\Housing\OccupantHistory\UpdateOccupantHistoryRequest;
use App\housing\OccupantHistory;

class OccupantHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $houseId = $request->houseId;

        $history = OccupantHistory::with('house', 'resident', 'housePayment')
            ->where('house_id', $houseId)
            ->latest()
            ->get();

        return response()->json([
            'message' => 'request success',
            'data' => $history,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOccupantHistoryRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(int $occupantHistoryId)
    {
        $history = OccupantHistory::with('house', 'resident', 'housePayment')
            ->where('id', $occupantHistoryId)
            ->latest()
            ->first();

        return response()->json([
            'message' => 'request success',
            'data' => $history,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OccupantHistory $occupantHistory)
    {
        //
    }

    public function assignHouse(Request $request, int $houseId): JsonResponse
    {
        try {
            $data = $request->only(['resident_id', 'house_id', 'amount', 'description']);
            $data = $request->validate([
                'resident_id' => ['required', 'exists:residents,id'],
                'date' => ['required'],
                'amount' => ['required', 'numeric'],
                'description' => ['nullable', 'string']
            ]);

            $currentDate = $data['date'] ?? now()->toDateString();

            OccupantHistory::where('resident_id', $data['resident_id'])
                ->where('house_id', $houseId)
                ->whereNull('end_date')
                ->update([
                    'end_date' => $currentDate,
                ]);

            DB::beginTransaction();

            $occupant = OccupantHistory::create([
                'resident_id' => $data['resident_id'],
                'house_id' => $houseId,
                'start_id' => $currentDate,
            ]);

            HousePayment::create([
                'occupant_history_id' => $occupant['id'],
                'payment_date' => $currentDate,
                'payment_status' => 'Lunas',
                'payment_amount' => $data['amount']
            ]);

            DB::commit();

            return response()->json([
                'message' => 'request success',
                'data' => 'success',
            ], 201);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'message' => 'request failed',
                'data' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOccupantHistoryRequest $request, int $occupantHistoryId)
    {
        $data = $request->only(['start_date', 'end_date']);

        $data = $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        OccupantHistory::where('id', $occupantHistoryId)->update([
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'] ?? null,
        ]);

        return response()->json([
            'message' => 'request success',
            'data' => null,
        ], 201);
    }

    public function updateEndDate(Request $request, int $houseId): JsonResponse
    {
        $data = $request->validate([
            'end_date' => ['required', 'date'],
        ]);

        OccupantHistory::where('house_id', $houseId)
            ->whereNull('end_date')
            ->latest()
            ->limit(1)
            ->update([
                'end_date' => $data['end_date'],
            ]);

        return response()->json([
            'message' => 'request success',
            'data' => null,
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $occupantHistoryId): JsonResponse
    {
        try {
            DB::beginTransaction();

            HousePayment::where('occupant_history_id', $occupantHistoryId)->delete();
            OccupantHistory::where('id', $occupantHistoryId)->delete();

            DB::commit();

            return response()->json([
                'message' => 'request success',
                'data' => null
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'request failed',
                'data' => $th->getMessage(),
            ]);
        }
    }
}
