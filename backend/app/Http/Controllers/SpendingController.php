<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Http\Requests\Finance\Spending\StoreSpendingRequest;
use App\Http\Requests\Finance\Spending\UpdateSpendingRequest;
use App\finance\Spending;

class SpendingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Spending::with("spendingType")->orderBy("date", "desc")->get();

        return response()->json([
            "message" => "request success",
            "data" => $items,
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
    public function store(StoreSpendingRequest $request)
    {
        $data = $request->validated();

        $spending = Spending::create($data);

        return response()->json(
            [
                "message" => "request success",
                "data" => $spending,
            ],
            201,
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $spending = Spending::with("spendingType")->where("id", $id)->first();

        return response()->json([
            "message" => "request success",
            "data" => $spending,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateSpendingRequest $request,
        int $id,
    ): JsonResponse {
        try {
            $data = $request->validated();

            $updated = Spending::where("id", $id)->update($data);

            return response()->json(
                [
                    "message" => "request success",
                    "data" => $updated,
                ],
                201,
            );
        } catch (\Throwable $th) {
            return response()->json([
                "data" => $th->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        Spending::where("id", $id)->delete();

        return response()->json(
            [
                "message" => "request success",
                "data" => null,
            ],
            201,
        );
    }
}
