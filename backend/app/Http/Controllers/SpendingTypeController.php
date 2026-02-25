<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Http\Requests\Finance\SpendingType\StoreSpendingTypeRequest;
use App\Http\Requests\Finance\SpendingType\UpdateSpendingTypeRequest;
use App\finance\SpendingType;

class SpendingTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = SpendingType::orderBy('name', 'ASC')->get();

        return response()->json([
            'message' => 'request success',
            'data' => $items,
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
    public function store(StoreSpendingTypeRequest $request)
    {
        $data = $request->validated();

        $spendingType = SpendingType::create($data);

        return response()->json([
            'message' => 'request success',
            'data' => $spendingType,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $spendingType = SpendingType::where('id', $id)->first();

        return response()->json([
            'message' => 'request success',
            'data' => $spendingType,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SpendingType $spendingType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSpendingTypeRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();

            $spendingType = SpendingType::where('id', $id)->update($data);

            return response()->json([
                'message' => 'request success',
                'data' => $spendingType,
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'data' => $th->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        SpendingType::where('id', $id)->delete();

        return response()->json([
            'message' => 'request success',
            'data' => null,
        ], 201);
    }
}
