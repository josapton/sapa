<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, Submission $submission)
    {
        $user = Auth::user();

        // Check if user is allowed to comment
        if ($submission->type === 'aspirasi') {
            return back()->with('error', 'Aspirasi tidak dapat dikomentari.');
        }

        if ($user->role === 'mahasiswa' && $user->id !== $submission->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'content' => 'required|string',
            'attachment' => 'nullable|file|max:10240',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = $submission->comments()->create([
            'user_id' => $user->id,
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
            'type' => 'internal',
        ]);

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('attachments', 'public');
            
            $comment->attachments()->create([
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
            ]);
        }
        
        // If an admin/dosen replies, maybe update status?
        if ($user->role !== 'mahasiswa' && $submission->status === 'pending') {
            $submission->update(['status' => 'processing']);
        }

        // Notify the reporter if admin/dosen replies
        if ($user->role !== 'mahasiswa' && $submission->user) {
            $submission->user->notify(new \App\Notifications\NewCommentNotification($comment));
        }

        return back()->with('success', 'Tanggapan berhasil dikirim.');
    }

    public function storePublic(Request $request, Submission $submission)
    {
        // Check if submission is public
        if ($submission->visibility !== 'public') {
            abort(403, 'Akses ditolak. Komentar publik hanya untuk laporan publik.');
        }

        $validated = $request->validate([
            'content' => 'required|string',
            'is_anonymous' => 'boolean',
            'author_name' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $user = Auth::user();
        $isAnonymous = $request->input('is_anonymous', false);
        $authorName = $isAnonymous ? 'Anonim' : $request->input('author_name', ($user ? $user->pseudonym : 'Guest'));

        $submission->publicComments()->create([
            'user_id' => $user ? $user->id : null,
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
            'type' => 'public',
            'author_name' => $authorName,
            'is_anonymous' => $isAnonymous,
        ]);

        return back()->with('success', 'Komentar publik berhasil dikirim.');
    }
}
