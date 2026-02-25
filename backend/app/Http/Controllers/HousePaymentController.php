<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Housing\HousePayment\StoreHousePaymentRequest;
use App\Http\Requests\Housing\HousePayment\UpdateHousePaymentRequest;
use App\housing\HousePayment;
use App\housing\OccupantHistory;

class HousePaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $housePayments = HousePayment::with(['occupantHistory', 'occupantHistory.resident', 'occupantHistory.house'])
            ->orderBy('payment_date', 'DESC')
            ->get();

        return response()->json([
            'message' => 'request success',
            'data' => $housePayments,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): void
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHousePaymentRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();

            $checkIfAnyHouseIsOccupied = OccupantHistory::where('house_id', $data['house_id'])
                ->where('resident_id', $data['resident_id'])
                ->where('house_id', $data['house_id'])
                ->whereNull('end_date')
                ->orderBy('created_at', 'DESC')
                ->first();

            if (!$checkIfAnyHouseIsOccupied) {
                $checkIfAnyHouseIsOccupied = OccupantHistory::create([
                    'house_id' => $data['house_id'],
                    'resident_id' => $data['resident_id'],
                    'start_date' => $data['payment_date'],
                ]);
            }

            $housePayment = HousePayment::create([
                ...$data,
                'occupant_history_id' => $checkIfAnyHouseIsOccupied->id
            ]);

            DB::commit();

            return response()->json([
                'message' => 'request success',
                'data' => $housePayment,
            ]);
        } catch (\Throwable $th) {
            DB::rollback();

            return response()->json([
                'message' => 'request failed',
                'data' => $th->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id, int $housePaymentId): JsonResponse
    {
        $housePayment = HousePayment::with(['occupantHistory', 'occupantHistory.resident', 'occupantHistory.house'])
            ->where('id', $housePaymentId)
            ->first();

        return response()->json([
            'message' => 'request success',
            'data' => $housePayment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(HousePayment $housePayment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHousePaymentRequest $request, int $housePaymentId): JsonResponse
    {
        $data = $request->validated();

        HousePayment::where('id', $housePaymentId)->update($data);

        return response()->json([
            'message' => 'request success',
            'data' => null,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $housePaymentId): JsonResponse
    {
        HousePayment::where('id', $housePaymentId)->delete();

        return response()->json([
            'message' => 'request success',
            'data' => null,
        ]);
    }
}
