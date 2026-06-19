<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SavedSubmissionController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Load the saved submissions through the relationship
        // We include similar eager loading as in the dashboard or public feed
        $savedSubmissions = $user->savedSubmissions()
            ->with(['user', 'category', 'likes', 'attachments', 'savedByUsers' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }])
            ->withCount(['likes', 'publicComments'])
            ->orderBy('saved_submissions.created_at', 'desc')
            ->paginate(12);

        return Inertia::render('Submissions/Saved', [
            'submissions' => $savedSubmissions,
            'categories' => \App\Models\Category::all(),
        ]);
    }

    public function toggle(Submission $submission)
    {
        $user = Auth::user();

        // Check if already saved
        if ($user->savedSubmissions()->where('submission_id', $submission->id)->exists()) {
            $user->savedSubmissions()->detach($submission->id);
            return back()->with('success', 'Laporan dihapus dari daftar tersimpan.');
        } else {
            $user->savedSubmissions()->attach($submission->id);
            return back()->with('success', 'Laporan berhasil disimpan.');
        }
    }
}
