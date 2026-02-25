<?php

namespace App\Http\Controllers;

use App\finance\DueType;
use App\Http\Requests\Finance\DueType\StoreDueTypeRequest;
use App\Http\Requests\Finance\DueType\UpdateDueTypeRequest;
use Illuminate\Http\JsonResponse;

class DueTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $dueTypes = DueType::orderBy('name', 'ASC')->get();

        return response()->json([
            'message' => 'request success',
            'data' => $dueTypes,
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
    public function store(StoreDueTypeRequest $request): JsonResponse
    {
        $data = $request->validated();
        $dueType = DueType::create($data);

        return response()->json([
            'message' => 'request success',
            'data' => $dueType,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $dueType = DueType::where('id', $id)->first();

        return response()->json([
            'message' => 'request success',
            'data' => $dueType,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DueType $dueType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDueTypeRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $dueType = DueType::where('id', $id)->update($data);

            return response()->json([
                'message' => 'request success',
                'data' => $dueType,
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
        $deleted = DueType::where('id', $id)->delete();

        return response()->json([
            'message' => 'request success',
            'data' => null,
        ], 201);
    }
}
