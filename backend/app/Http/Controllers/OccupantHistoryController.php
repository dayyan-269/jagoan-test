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
        ]);
    }

    public function updateEndDate(Request $request, int $occupantHistoryId): JsonResponse
    {
        $data = $request->validate([
            'end_date' => ['required', 'date'],
        ]);

        OccupantHistory::where('id', $occupantHistoryId)->update([
            'end_date' => $data['end_date']
        ]);

        return response()->json([
            'message' => 'request success',
            'data' => null,
        ]);
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
