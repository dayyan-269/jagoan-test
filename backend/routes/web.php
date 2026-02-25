<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'title' => 'REST API Kontrak Rumah',
        'content' => 'Auth, kelola rumah, kelola penghuni, kelola pembayaran, & laporan.'
    ]);
});
