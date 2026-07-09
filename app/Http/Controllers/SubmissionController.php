<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\SubmissionStatusUpdated;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Traits\OptimizesImages;

class SubmissionController extends Controller
{
    use OptimizesImages;

    public function index(Request $request)
    {
        // Fetch all categories for filter options
        $categories = Category::all();

        $query = Submission::with(['user', 'category', 'likes', 'attachments', 'savedByUsers' => function ($q) {
            $q->where('user_id', Auth::id());
        }])
            ->withCount(['likes', 'publicComments'])
            ->where('visibility', 'public');

        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('content', 'like', "%{$searchTerm}%")
                  ->orWhere('tracking_code', 'like', "%{$searchTerm}%")
                  ->orWhere('incident_location', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->has('category') && $request->category) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        $submissions = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
            
        $stats = [
            'total_laporan' => Submission::whereIn('type', ['laporan', 'aduan'])->count(),
            'laporan_diproses' => Submission::whereIn('type', ['laporan', 'aduan'])->where('status', 'processing')->count(),
            'laporan_selesai' => Submission::whereIn('type', ['laporan', 'aduan'])->where('status', 'resolved')->count(),
            'total_aspirasi' => Submission::where('type', 'aspirasi')->count(),
        ];

        $chartDataCategory = Category::withCount('submissions')->get()->map(function($category) {
            return [
                'name' => $category->name,
                'value' => $category->submissions_count
            ];
        });

        $chartDataStatus = [
            ['name' => 'Menunggu', 'value' => Submission::where('status', 'pending')->count()],
            ['name' => 'Diproses', 'value' => Submission::where('status', 'processing')->count()],
            ['name' => 'Selesai', 'value' => Submission::where('status', 'resolved')->count()],
        ];

        $stats['chart_category'] = $chartDataCategory;
        $stats['chart_status'] = $chartDataStatus;

        return Inertia::render('Welcome', [
            'submissions' => $submissions,
            'stats' => $stats,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function publicFeed(Request $request)
    {
        $query = Submission::with(['user', 'category', 'likes', 'attachments', 'savedByUsers' => function ($q) {
            $q->where('user_id', Auth::id());
        }])
            ->withCount(['likes', 'publicComments'])
            ->where('visibility', 'public');

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $submissions = $query->orderBy('created_at', 'desc')->paginate(12);
        
        return Inertia::render('Submissions/Index', [
            'submissions' => $submissions,
            'categories' => Category::all(),
            'filters' => $request->only(['category_id', 'status']),
        ]);
    }
    
    public function dashboard(Request $request)
    {
        $user = Auth::user();
        $query = Submission::with(['user', 'category', 'attachments', 'likes', 'savedByUsers' => function ($q) use ($user) {
            $q->where('user_id', $user->id);
        }])->withCount(['likes', 'publicComments']);

        if ($user->role === 'mahasiswa') {
            $query->where('user_id', $user->id);
        }

        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('content', 'like', "%{$searchTerm}%")
                  ->orWhere('tracking_code', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->has('category') && $request->category) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        $submissions = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        
        $chartDataCategory = null;
        $chartDataStatus = null;
        
        if ($user->role !== 'mahasiswa') {
            $chartDataCategory = Category::withCount('submissions')->get()->map(function($category) {
                return [
                    'name' => $category->name,
                    'value' => $category->submissions_count
                ];
            });

            $chartDataStatus = [
                ['name' => 'Menunggu', 'value' => Submission::where('status', 'pending')->count()],
                ['name' => 'Diproses', 'value' => Submission::where('status', 'processing')->count()],
                ['name' => 'Selesai', 'value' => Submission::where('status', 'resolved')->count()],
            ];
        }
        
        return Inertia::render('Dashboard', [
            'submissions' => $submissions,
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category']),
            'chartCategory' => $chartDataCategory,
            'chartStatus' => $chartDataStatus,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:laporan,aduan,aspirasi',
            'category_id' => 'required|exists:categories,id',
            'visibility' => 'required|in:public,private',
            'incident_date' => 'nullable|date',
            'incident_location' => 'nullable|string|max:255',
            'attachments.*' => 'nullable|file|max:10240', // 10MB max per file
            'terms' => 'accepted',
        ], [
            'terms.accepted' => 'Anda harus menyetujui syarat dan ketentuan yang berlaku.',
        ]);

        if ($validated['type'] === 'aspirasi') {
            $validated['visibility'] = 'public'; // Aspirasi is always public
        }

        $trackingCode = 'SAPA-' . strtoupper(Str::random(8));

        $submission = Submission::create([
            'tracking_code' => $trackingCode,
            'user_id' => Auth::id(),
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'type' => $validated['type'],
            'visibility' => $validated['visibility'],
            'incident_date' => $validated['incident_date'] ?? null,
            'incident_location' => $validated['incident_location'] ?? null,
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $optimized = $this->optimizeAndStoreImage($file);
                
                $submission->attachments()->create([
                    'file_path' => $optimized['file_path'],
                    'file_name' => $optimized['file_name'],
                    'mime_type' => $optimized['mime_type'],
                ]);
            }
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
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:laporan,aduan,aspirasi',
            'visibility' => 'required|in:public,private',
            'incident_date' => 'nullable|date',
            'incident_location' => 'nullable|string|max:255',
            'attachments.*' => 'nullable|file|max:10240', // 10MB max per file
        ]);

        if ($validated['type'] === 'aspirasi') {
            $validated['visibility'] = 'public';
        }

        $submission->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category_id' => $validated['category_id'],
            'type' => $validated['type'],
            'visibility' => $validated['visibility'],
            'incident_date' => $validated['incident_date'] ?? null,
            'incident_location' => $validated['incident_location'] ?? null,
        ]);

        if ($request->hasFile('attachments')) {
            // Delete old attachments if new ones are uploaded? For now, we just append or assume the frontend handles it. 
            // In a real scenario, we might want to let users delete specific attachments, but let's stick to appending or replacing.
            foreach ($request->file('attachments') as $file) {
                $optimized = $this->optimizeAndStoreImage($file);
                
                $submission->attachments()->create([
                    'file_path' => $optimized['file_path'],
                    'file_name' => $optimized['file_name'],
                    'mime_type' => $optimized['mime_type'],
                ]);
            }
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

        $submission->load(['user', 'category', 'attachments', 'likes', 'assignedTo', 'savedByUsers' => function ($q) {
            $q->where('user_id', Auth::id());
        }, 'publicComments' => function ($q) {
            $q->whereNull('parent_id')->with(['user', 'replies.user']);
        }]);
        $submission->loadCount('likes');

        // Only load comments if authorized
        if ($submission->type !== 'aspirasi' && $user && ($user->role !== 'mahasiswa' || $user->id === $submission->user_id)) {
            $submission->load(['comments' => function ($query) {
                $query->whereNull('parent_id')->with(['user', 'attachments', 'replies.user', 'replies.attachments']);
            }]);
        }

        $categories = \App\Models\Category::all();

        $can_print = false;
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->role === 'admin' || $user->role === 'dosen') {
                $can_print = true;
            } elseif ($user->id === $submission->user_id) {
                $can_print = true;
            }
        }

        $staffUsers = \App\Models\User::whereIn('role', ['admin', 'dosen'])->get(['id', 'name', 'role']);

        return Inertia::render('SubmissionDetail', [
            'submission' => $submission,
            'categories' => $categories,
            'can_print' => $can_print,
            'staffUsers' => $staffUsers
        ]);
    }

    public function track()
    {
        return Inertia::render('Track');
    }

    public function trackLookup(Request $request)
    {
        $request->validate([
            'tracking_code' => 'required|string'
        ]);

        $submission = Submission::with(['category', 'user'])->where('tracking_code', $request->tracking_code)->first();

        if (!$submission) {
            return back()->withErrors(['tracking_code' => 'Kode Lacak tidak ditemukan.']);
        }

        // Redirect to show page, wait, show page requires Auth/Privacy check.
        // If it's private, show page will abort(403) unless auth user matches. 
        // Aduan.id tracking is usually public or shows limited timeline without sensitive info if private.
        // Let's redirect to a dedicated Track detail view or SubmissionDetail with limited view.
        // For simplicity, redirect to show, but we may need to adjust show() to allow tracking code bypass for timeline.
        // Actually, if they know the tracking code, they have the right to view it.
        return redirect()->route('submissions.track_result', $submission->tracking_code);
    }

    public function trackResult($tracking_code)
    {
        $submission = Submission::with(['user', 'category', 'attachments'])->where('tracking_code', $tracking_code)->firstOrFail();
        
        $can_print = false;
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->role === 'admin' || $user->role === 'dosen') {
                $can_print = true;
            } elseif ($user->id === $submission->user_id) {
                $can_print = true;
            }
        }

        return Inertia::render('TrackResult', [
            'submission' => $submission,
            'can_print' => $can_print
        ]);
    }

    public function printPdf($id)
    {
        $submission = Submission::with(['user', 'category', 'attachments', 'comments.user'])->findOrFail($id);
        
        $user = Auth::user();
        
        if (!$user) {
            abort(403, 'Akses ditolak. Anda harus login untuk mencetak PDF.');
        }

        if ($user->role === 'mahasiswa' && $user->id !== $submission->user_id) {
            abort(403, 'Akses ditolak. Anda tidak memiliki izin untuk mencetak laporan ini.');
        }

        $pdf = Pdf::loadView('pdf.submission', compact('submission'));
        return $pdf->stream('Laporan-SAPA-' . $submission->tracking_code . '.pdf');
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

        // Dispatch Database Notification
        if ($submission->user) {
            $submission->user->notify(new \App\Notifications\SubmissionStatusUpdated($submission));
        }

        // Send email notification to user
        if ($submission->user && $submission->user->email) {
            try {
                Mail::to($submission->user->email)->send(new SubmissionStatusUpdated($submission));
            } catch (\Exception $e) {
                // Log or ignore if email fails
                \Illuminate\Support\Facades\Log::error('Failed to send status update email: ' . $e->getMessage());
            }
        }

        return back()->with('success', 'Status berhasil diperbarui.');
    }

    public function toggleVisibility(Request $request, Submission $submission)
    {
        $user = Auth::user();
        
        if (!$user || !in_array($user->role, ['admin', 'dosen'])) {
            abort(403, 'Unauthorized action.');
        }

        $newVisibility = $submission->visibility === 'public' ? 'private' : 'public';
        $submission->update(['visibility' => $newVisibility]);

        return back()->with('success', 'Visibilitas laporan berhasil diubah menjadi ' . strtoupper($newVisibility) . '.');
    }

    public function assign(Request $request, Submission $submission)
    {
        $user = Auth::user();
        
        // Only admin can assign
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $submission->update(['assigned_to' => $validated['assigned_to']]);

        return back()->with('success', 'Laporan berhasil ditugaskan.');
    }

    public function resolve(Submission $submission)
    {
        $user = Auth::user();
        
        // Only the creator can resolve it themselves via this route
        if (!$user || $user->id !== $submission->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $submission->update(['status' => 'resolved']);

        return back()->with('success', 'Laporan berhasil ditandai sebagai selesai.');
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
