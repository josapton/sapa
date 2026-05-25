<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [SubmissionController::class, 'index'])->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [SubmissionController::class, 'dashboard'])->name('dashboard');
    Route::post('/submissions', [SubmissionController::class, 'store'])->name('submissions.store');
    Route::post('/submissions/{submission}', [SubmissionController::class, 'update'])->name('submissions.update');
    Route::patch('/submissions/{submission}/status', [SubmissionController::class, 'updateStatus'])->name('submissions.status');
    Route::delete('/submissions/{submission}', [SubmissionController::class, 'destroy'])->name('submissions.destroy');
    
    // Comments
    Route::post('/submissions/{submission}/comments', [CommentController::class, 'store'])->name('comments.store');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        // Users Management
        Route::get('/users', [App\Http\Controllers\AdminController::class, 'usersIndex'])->name('users.index');
        Route::post('/users', [App\Http\Controllers\AdminController::class, 'storeUser'])->name('users.store');
        Route::patch('/users/{user}/role', [App\Http\Controllers\AdminController::class, 'updateUserRole'])->name('users.role');
        Route::delete('/users/{user}', [App\Http\Controllers\AdminController::class, 'destroyUser'])->name('users.destroy');
        
        // Pseudonyms Management
        Route::get('/pseudonyms', [App\Http\Controllers\AdminController::class, 'pseudonymsIndex'])->name('pseudonyms.index');
        Route::post('/pseudonyms', [App\Http\Controllers\AdminController::class, 'storePseudonym'])->name('pseudonyms.store');
        Route::patch('/pseudonyms/{pseudonym}', [App\Http\Controllers\AdminController::class, 'updatePseudonym'])->name('pseudonyms.update');
        Route::delete('/pseudonyms/{pseudonym}', [App\Http\Controllers\AdminController::class, 'destroyPseudonym'])->name('pseudonyms.destroy');
    });
});

// Anyone can view public submissions and like
Route::get('/submissions/{submission}', [SubmissionController::class, 'show'])->name('submissions.show');
Route::post('/submissions/{submission}/like', [LikeController::class, 'toggle'])->name('likes.toggle');

require __DIR__.'/auth.php';
