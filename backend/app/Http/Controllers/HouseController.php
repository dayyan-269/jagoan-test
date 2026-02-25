<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\housing\House;
use App\housing\OccupantHistory;
use App\Http\Requests\Housing\House\StoreHouseRequest;
use App\Http\Requests\Housing\House\UpdateHouseRequest;

class HouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $houses = House::addSelect(['recent_occupant' => OccupantHistory::select([
                    'residents.name',
                ])
                ->join('residents', 'occupant_histories.resident_id', 'residents.id')
                ->whereColumn('occupant_histories.house_id', 'houses.id')
                ->whereNull('occupant_histories.end_date')
                ->orderBy('occupant_histories.created_at', 'DESC')
                ->limit(1)
            ])
            ->orderBy('number', 'ASC')
            ->get();

        return response()->json([
            'message' => 'request success',
            'data' => $houses,
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
    public function store(StoreHouseRequest $request)
    {
        $data = $request->validated();

        $house = House::create($data);

        return response()->json([
            'message' => 'request success',
            'data' => $house,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $house = House::where('id', $id)->first();

        return response()->json([
            'message' => 'request success',
            'data' => $house,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(House $house)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHouseRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $house = House::where('id', $id)->update($data);

            return response()->json([
                'message' => 'request success',
                'data' => $house,
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
        $house = House::where('id', $id)->delete();

        return response()->json([
            'message' => 'request success',
            'data' => null,
        ], 201);
    }
}
