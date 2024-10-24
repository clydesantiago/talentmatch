<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::get('/dashboard/{any?}', function () {
    return Inertia::render('Dashboard');
})->where('any', '^(?!api).*$')->middleware(['auth', 'verified'])->name('dashboard');


Route::prefix('/api')->group(function () {
    Route::apiResource('/projects', ProjectController::class);
})->middleware('auth');

require __DIR__.'/auth.php';
