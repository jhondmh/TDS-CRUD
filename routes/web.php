<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EstudiantesController;
use App\Http\Controllers\UsersController;

use App\Http\Controllers\GoogleController;
use App\Http\Controllers\FacebookController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::resource('estudiantes', EstudiantesController::class);
    Route::resource('user', UsersController::class);

    // Route::delete('/estudiantes/multiple-delete', [EstudiantesController::class, 'multipleDestroy']);
    // Route::delete('/estudiantes/{estudiante}', [EstudiantesController::class, 'destroy'])->name('estudiantes.destroy');
    Route::post('/estudiantes/multiple-destroy', [EstudiantesController::class, 'multipleDestroy'])->name('estudiantes.multipleDestroy');
    Route::post('/users/multiple-destroy', [UsersController::class, 'multipleDestroy'])->name('users.multipleDestroy');
    // Route::post('/estudiantes/multiple-destroy', [EstudiantesController::class, 'multipleDestroy'])->middleware(['auth:sanctum', 'verified'])->name('estudiantes.multipleDestroy');


    // Route::delete('/user', function () {
    //     request()->user()->delete();
    //     // Redirigir al usuario a la página de inicio de sesión o a una página de confirmación
    //     return Inertia::location(url('/'));
    // })->middleware(['auth:sanctum', 'verified'])->name('current-user.multipleDestroy');


    // Route::delete('/user', function () {
    //     request()->user()->delete();
    //     return response()->json(['status' => 'success']);
    // })->middleware(['auth:sanctum', 'verified'])->name('current-user.destroy');
    Route::delete('/user', function () {
        request()->user()->delete();
        // Redirigir al usuario a la página de inicio de sesión o a una página de confirmación
        return Inertia::location(url('/'));
    })->middleware(['auth:sanctum', 'verified'])->name('current-user.destroy');
});

route::get('auth/google', [GoogleController::class, 'googlepage']);
route::get('auth/google/callback', [GoogleController::class, 'googlecallback']);


route::get('auth/facebook', [FacebookController::class, 'facebookpage']);
route::get('auth/facebook/callback', [FacebookController::class, 'facebookredirect']);
