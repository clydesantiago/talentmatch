<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\JobsController;
use App\Http\Controllers\OpenAIController;
use App\Http\Controllers\TalentController;
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

Route::get('/apply', function() {
    return Inertia::render('Apply');
});

Route::get('/dashboard/{any?}', function () {
    return Inertia::render('App');
})->where('any', '^(?!api).*$')->middleware(['auth', 'verified'])->name('dashboard');


Route::prefix('/api')->group(function () {
    Route::get('/projects/{project}/jobs', [ProjectController::class, 'jobs']);
    Route::apiResource('/projects', ProjectController::class);
    Route::apiResource('/companies', CompanyController::class);
    Route::post('/job-lists/find-talents', [JobsController::class, 'findTalents']);
    Route::apiResource('/job-lists', JobsController::class);
    Route::post('/talents/extract-from-resume', [TalentController::class, 'extractFromResume']);
    Route::apiResource('/talents', TalentController::class);

    Route::post('/upload', UploadController::class);
    Route::post('/openai', OpenAIController::class);
    Route::post('/run-assistant', RunAssistantController::class);
})->middleware('auth');

require __DIR__.'/auth.php';
