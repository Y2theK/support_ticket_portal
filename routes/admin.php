<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\TicketCommentController as AdminTicketCommentController;
use App\Http\Controllers\Admin\TicketController as AdminTicketController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware(['auth', 'verified', 'role:agent'])->name('admin.')->group(function () {

    Route::redirect('/', '/admin/dashboard');

    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::prefix('tickets')->name('tickets.')->group(function () {
        Route::get('/', [AdminTicketController::class, 'index'])->name('index');
        Route::get('{ticket}', [AdminTicketController::class, 'show'])->name('show');
        Route::patch('{ticket}', [AdminTicketController::class, 'update'])->name('update');
        Route::post('{ticket}/comments', [AdminTicketCommentController::class, 'store'])->name('comments.store');
    });
});
