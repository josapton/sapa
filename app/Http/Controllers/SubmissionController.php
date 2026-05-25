<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SubmissionController extends Controller
{
    public function index()
    {
        // Public submissions only for homepage
        $submissions = Submission::with(['user', 'likes', 'attachments'])
            ->withCount('likes')
            ->where('visibility', 'public')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        $stats = [
            'total_laporan' => Submission::whereIn('type', ['laporan', 'aduan'])->count(),
            'laporan_diproses' => Submission::whereIn('type', ['laporan', 'aduan'])->where('status', 'processing')->count(),
            'laporan_selesai' => Submission::whereIn('type', ['laporan', 'aduan'])->where('status', 'resolved')->count(),
            'total_aspirasi' => Submission::where('type', 'aspirasi')->count(),
        ];

        return Inertia::render('Welcome', [
            'submissions' => $submissions,
            'stats' => $stats,
        ]);
    }
    
    public function dashboard()
    {
        $user = Auth::user();
        if ($user->role === 'mahasiswa') {
            $submissions = Submission::where('user_id', $user->id)->orderBy('created_at', 'desc')->paginate(10);
        } else {
            $submissions = Submission::orderBy('created_at', 'desc')->paginate(10);
        }
        
        return Inertia::render('Dashboard', [
            'submissions' => $submissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:laporan,aduan,aspirasi',
            'visibility' => 'required|in:public,private',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        if ($validated['type'] === 'aspirasi') {
            $validated['visibility'] = 'public'; // Aspirasi is always public
        }

        $submission = Submission::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'content' => $validated['content'],
            'type' => $validated['type'],
            'visibility' => $validated['visibility'],
        ]);

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('attachments', 'public');
            
            $submission->attachments()->create([
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
            ]);
        }

        return redirect()->route('dashboard')->with('success', 'Berhasil dikirim.');
    }

    public function update(Request $request, Submission $submission)
    {
        $user = Auth::user();
        if ($user->role === 'mahasiswa' && $user->id !== $submission->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:laporan,aduan,aspirasi',
            'visibility' => 'required|in:public,private',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        if ($validated['type'] === 'aspirasi') {
            $validated['visibility'] = 'public';
        }

        $submission->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'type' => $validated['type'],
            'visibility' => $validated['visibility'],
        ]);

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('attachments', 'public');
            
            $submission->attachments()->create([
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
            ]);
        }

        return redirect()->back()->with('success', 'Berhasil diupdate.');
    }

    public function show(Submission $submission)
    {
        $user = Auth::user();
        
        // Privacy check
        if ($submission->visibility === 'private' && 
            (!$user || ($user->role === 'mahasiswa' && $user->id !== $submission->user_id))) {
            abort(403);
        }

        $submission->load(['user', 'attachments', 'likes']);
        $submission->loadCount('likes');

        // Only load comments if authorized
        if ($submission->type !== 'aspirasi' && $user && ($user->role !== 'mahasiswa' || $user->id === $submission->user_id)) {
            $submission->load(['comments.user', 'comments.attachments']);
        }

        return Inertia::render('SubmissionDetail', [
            'submission' => $submission
        ]);
    }

    public function updateStatus(Request $request, Submission $submission)
    {
        $user = Auth::user();
        
        if (!$user || !in_array($user->role, ['admin', 'dosen'])) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,resolved',
        ]);

        $submission->update(['status' => $validated['status']]);

        return back()->with('success', 'Status berhasil diperbarui.');
    }

    public function destroy(Submission $submission)
    {
        $user = Auth::user();
        
        if (!$user) {
            abort(403, 'Unauthorized action.');
        }

        if ($user->role !== 'admin' && $user->id !== $submission->user_id) {
            abort(403, 'Unauthorized action.');
        }

        // Delete attachments from storage
        foreach ($submission->attachments as $attachment) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($attachment->file_path);
        }
        
        // Also delete comment attachments
        foreach ($submission->comments as $comment) {
            foreach ($comment->attachments as $attachment) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($attachment->file_path);
            }
        }

        $submission->delete();

        return redirect()->route('dashboard')->with('success', 'Submisi berhasil dihapus.');
    }
}
