<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\JobsController;
use App\Http\Controllers\OpenAIController;
use App\Http\Controllers\RunAssistantController;
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

Route::get('/landing', function() {
    return Inertia::render('Landing');
});

Route::get('/dashboard/{any?}', function () {
    return Inertia::render('Dashboard');
})->where('any', '^(?!api).*$')->middleware(['auth', 'verified'])->name('dashboard');


Route::prefix('/api')->group(function () {
    Route::apiResource('/projects', ProjectController::class);
    Route::apiResource('/companies', CompanyController::class);
    Route::apiResource('/jobs', JobsController::class);

    Route::post('/upload', UploadController::class);
    Route::post('/openai', OpenAIController::class);
    Route::post('/run-assistant', RunAssistantController::class);
})->middleware('auth');

require __DIR__.'/auth.php';
