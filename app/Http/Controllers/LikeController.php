<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    public function toggle(Request $request, Submission $submission)
    {
        $ip_address = $request->ip();
        $user_id = Auth::id();

        $query = Like::where('submission_id', $submission->id);

        if ($user_id) {
            $query->where('user_id', $user_id);
        } else {
            // For guests, we rely on IP
            $query->where('ip_address', $ip_address)->whereNull('user_id');
        }

        $existingLike = $query->first();

        if ($existingLike) {
            $existingLike->delete();
            return back()->with('success', 'Like dihapus.');
        } else {
            Like::create([
                'submission_id' => $submission->id,
                'user_id' => $user_id,
                'ip_address' => $ip_address,
            ]);
            return back()->with('success', 'Like ditambahkan.');
        }
    }
}
