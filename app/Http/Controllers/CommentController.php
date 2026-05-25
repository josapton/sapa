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
        ]);

        $comment = $submission->comments()->create([
            'user_id' => $user->id,
            'content' => $validated['content'],
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

        return back()->with('success', 'Tanggapan berhasil dikirim.');
    }
}
