<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DuePaymentController;
use App\Http\Controllers\DueTypeController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\HousePaymentController;
use App\Http\Controllers\OccupantHistoryController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\SpendingController;
use App\Http\Controllers\SpendingTypeController;
use App\Http\Controllers\StatsController;

Route::middleware('auth:api')->group(function () {
    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login'])->withoutMiddleware('auth:api');
        Route::post('register', [AuthController::class, 'register'])->withoutMiddleware('auth:api');
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
    });

    Route::get('stats/monthly', [StatsController::class, 'getMonthlyStats']);
    Route::get('stats/monthly/spending', [StatsController::class, 'getMonthlySpending']);
    Route::get('stats/monthly/earning', [StatsController::class, 'getMonthlyEarning']);

    // Housing Routes
    Route::apiResource('houses', HouseController::class);
    Route::apiResource('houses/{id}/payment', HousePaymentController::class);

    Route::apiResource('occupant-history', OccupantHistoryController::class)->except('insert');
    Route::put('occupant-history/{occupantHistoryId}/end', [OccupantHistoryController::class, 'updateEndDate']);

    Route::apiResource('residents', ResidentController::class);

    // Finances Routes
    Route::apiResource('due-types', DueTypeController::class);
    Route::apiResource('due-payment', DuePaymentController::class);

    Route::apiResource('spending-types', SpendingTypeController::class);
    Route::apiResource('spending', SpendingController::class);
});
