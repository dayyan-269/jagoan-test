<?php

namespace App\Http\Controllers;

use App\finance\DuePayment;
use App\housing\HousePayment;
use App\Http\Requests\Housing\Resident\StoreResidentRequest;
use App\Http\Requests\Housing\Resident\UpdateResidentRequest;
use App\housing\Resident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ResidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $residents = Resident::latest()->get();
        return response()->json([
            'message' => 'request success',
            'data' => $residents,
        ]);
    }

    public function getOccupiedResidents(): JsonResponse
    {
        $residents = DB::table('occupant_histories')
            ->join('residents', 'occupant_histories.resident_id', 'residents.id')
            ->whereNull('occupant_histories.end_date')
            ->orderBy('residents.name', 'ASC')
            ->select([
                'residents.*'
            ])
            ->get();

        return response()->json([
            'message' => 'request success',
            'data' => $residents,
        ]);
    }

    public function getResidentHistory(int $id): JsonResponse
    {
        $duePayment = DuePayment::with('dueType')->where('resident_id', $id)->orderBy('date', 'DESC')->get();
        $housePayment = HousePayment::whereHas('occupantHistory', function ($query) use ($id) {
                $query->where('resident_id', $id);
            })
            ->orderBy('payment_date')
            ->get();

        return response()->json([
            'message' => 'request success',
            'data' => [
                'due' => $duePayment,
                'house' => $housePayment
            ],
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
    public function store(StoreResidentRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('residents', 'public');
            $data['photo'] = $path;
        }

        $resident = Resident::create($data);

        return response()->json([
            'message' => 'request success',
            'data' => $resident,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $resident = Resident::findOrFail($id);
        return response()->json([
            'message' => 'request success',
            'data' => $resident,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Resident $resident)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResidentRequest $request, int $id): JsonResponse
    {
        $resident = Resident::findOrFail($id);

        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('residents', 'public');
            $data['photo'] = $path;
        }

        $resident->update($data);

        return response()->json([
            'message' => 'request success',
            'data' => $resident,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $resident = Resident::findOrFail($id);

        $resident->delete();
        return response()->json([
            'message' => 'request success',
            'data' => null,
        ]);
    }
}
