<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\SavedSubmissionController;
use App\Http\Controllers\AdminExportController;
use App\Http\Controllers\NotificationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [SubmissionController::class, 'index'])->name('home');

// Static Pages
Route::get('/tentang', function () { return Inertia::render('About'); })->name('about');
Route::get('/setup-symlink', function () {
    try {
        $link = public_path('storage');
        // If symlink exists but is broken or forbidden, delete it.
        if (is_link($link) || file_exists($link)) {
            if (is_dir($link) && !is_link($link)) {
                rmdir($link);
            } else {
                unlink($link);
            }
        }
        return 'Symlink dihapus! Fitur route storage alternatif siap digunakan.';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

// Alternatif untuk menampilkan file storage jika symlink dilarang oleh Shared Hosting
Route::get('berkas/{path}', function ($path) {
    if (str_contains($path, '..')) {
        abort(403);
    }
    $filePath = storage_path('app/public/' . $path);
    if (!file_exists($filePath)) {
        abort(404);
    }
    return response()->file($filePath);
})->where('path', '.*');
Route::get('/syarat', function () { return Inertia::render('Terms'); })->name('terms');
Route::get('/privasi', function () { return Inertia::render('Privacy'); })->name('privacy');

// Public Feed & Tracking
Route::get('/laporan', [SubmissionController::class, 'publicFeed'])->name('submissions.public_feed');
Route::get('/lacak', [SubmissionController::class, 'track'])->name('submissions.track');
Route::post('/lacak', [SubmissionController::class, 'trackLookup'])->name('submissions.track_lookup');
Route::get('/lacak/{tracking_code}', [SubmissionController::class, 'trackResult'])->name('submissions.track_result');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [SubmissionController::class, 'dashboard'])->name('dashboard');
    Route::get('/tersimpan', [SavedSubmissionController::class, 'index'])->name('saved_submissions.index');
    Route::post('/submissions/{submission}/save', [SavedSubmissionController::class, 'toggle'])->name('saved_submissions.toggle');
    Route::post('/submissions', [SubmissionController::class, 'store'])->name('submissions.store');
    Route::post('/submissions/{submission}', [SubmissionController::class, 'update'])->name('submissions.update');
    Route::get('/submissions/{id}/pdf', [SubmissionController::class, 'printPdf'])->name('submissions.print_pdf');
    Route::patch('/submissions/{submission}/status', [SubmissionController::class, 'updateStatus'])->name('submissions.status');
    Route::patch('/submissions/{submission}/visibility', [SubmissionController::class, 'toggleVisibility'])->name('submissions.visibility');
    Route::post('/submissions/{submission}/assign', [SubmissionController::class, 'assign'])->name('submissions.assign');
    Route::post('/submissions/{submission}/resolve', [SubmissionController::class, 'resolve'])->name('submissions.resolve');
    Route::delete('/submissions/{submission}', [SubmissionController::class, 'destroy'])->name('submissions.destroy');
    
    // Comments
    Route::post('/submissions/{submission}/comments', [CommentController::class, 'store'])->name('comments.store');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark_all_read');
    Route::post('/notifications/{id}/mark-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark_read');

    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        // Export Laporan
        Route::get('/submissions/export/excel', [AdminExportController::class, 'exportExcel'])->name('submissions.export_excel');
        Route::get('/submissions/export/pdf', [AdminExportController::class, 'exportPdf'])->name('submissions.export_pdf');

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
Route::post('/submissions/{submission}/public-comments', [CommentController::class, 'storePublic'])->name('public_comments.store');

require __DIR__.'/auth.php';
