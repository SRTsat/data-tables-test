<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Route untuk menampilkan halaman (yang sedang kamu buka)
Route::get('/users-list', [UserController::class, 'index'])->name('users.index');

// Route untuk hapus SATUAN (PENTING: harus sama dengan URL di React)
Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');

Route::post('/users/bulk-delete', [UserController::class, 'bulkDelete']);

require __DIR__.'/settings.php';
