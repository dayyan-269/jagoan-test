<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Http\Requests\Finance\DuePayment\StoreDuePaymentRequest;
use App\Http\Requests\Finance\DuePayment\UpdateDuePaymentRequest;
use App\finance\DuePayment;

class DuePaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payment = DuePayment::with('dueType', 'resident')
            ->latest()
            ->paginate(15);

        return response()->json([
            'messsage' => 'request success',
            'data' => $payment,
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
    public function store(StoreDuePaymentRequest $request): JsonResponse
    {
        $data = $request->validated();

        // TODO: implementasi batch insert untuk beberapa bulan sekaligus

        $payment = DuePayment::create($data);

        return response()->json([
            'message' => 'request success',
            'data' => $payment,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $payment = DuePayment::with('resident', 'dueType')->where('id', $id)->first();
        
        return response()->json([
            'message' => 'request success',
            'data' => $payment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DuePayment $duePayment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDuePaymentRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();
        $payment = DuePayment::where('id', $id)->update($data);

        return response()->json([
            'message' => 'request success',
            'data' => $payment,
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $payment = DuePayment::where('id', $id)->delete();

        return response()->json([
            'message' => 'request success',
            'data' => $payment,
        ]);
    }
}
