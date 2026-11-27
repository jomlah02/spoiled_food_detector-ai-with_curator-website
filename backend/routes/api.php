<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::match(['get', 'post'], '/chat',     [AiController::class, 'chat']);
Route::match(['get', 'post'], '/ringkas',  [AiController::class, 'ringkas']);
Route::match(['get', 'post'], '/terjemah', [AiController::class, 'terjemah']);
