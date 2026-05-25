<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PseudonymDictionary;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * Ensure only admin can access these methods.
     */
    private function authorizeAdmin()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
    }

    // ==========================================
    // USER MANAGEMENT
    // ==========================================

    public function usersIndex()
    {
        $this->authorizeAdmin();

        $users = User::withCount(['submissions', 'comments'])->paginate(10);

        return Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }

    public function updateUserRole(Request $request, User $user)
    {
        $this->authorizeAdmin();

        if ($user->role === 'mahasiswa') {
            return back()->withErrors(['role' => 'Role mahasiswa paten dan tidak dapat diubah.']);
        }

        $validated = $request->validate([
            'role' => 'required|in:admin,dosen',
        ]);
        
        $user->update(['role' => $validated['role']]);

        return back()->with('success', 'Role user berhasil diperbarui.');
    }

    public function storeUser(Request $request)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,dosen',
        ]);

        $dictionaryEntry = \App\Models\PseudonymDictionary::inRandomOrder()->first();
        $pseudonym = $dictionaryEntry ? $dictionaryEntry->name . ' ' . rand(100, 999) : 'Anonim ' . rand(1000, 9999);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'role' => $validated['role'],
            'pseudonym' => $pseudonym,
        ]);

        return back()->with('success', 'User ' . $validated['role'] . ' berhasil ditambahkan.');
    }

    public function destroyUser(User $user)
    {
        $this->authorizeAdmin();

        if (Auth::id() === $user->id) {
            return back()->withErrors(['error' => 'Anda tidak dapat menghapus akun Anda sendiri.']);
        }

        // Submissions and comments will be deleted via cascading foreign keys,
        // but attachments in storage need to be deleted manually.
        foreach ($user->submissions as $submission) {
            foreach ($submission->attachments as $attachment) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($attachment->file_path);
            }
        }
        
        foreach ($user->comments as $comment) {
            foreach ($comment->attachments as $attachment) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($attachment->file_path);
            }
        }

        $user->delete();

        return back()->with('success', 'User dan datanya berhasil dihapus.');
    }

    // ==========================================
    // PSEUDONYM MANAGEMENT
    // ==========================================

    public function pseudonymsIndex()
    {
        $this->authorizeAdmin();

        $pseudonyms = PseudonymDictionary::orderBy('category')->orderBy('name')->paginate(10);

        return Inertia::render('Admin/Pseudonyms', [
            'pseudonyms' => $pseudonyms
        ]);
    }

    public function storePseudonym(Request $request)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:pseudonym_dictionaries',
            'category' => 'required|string|max:255',
        ]);

        PseudonymDictionary::create($validated);

        return back()->with('success', 'Nama samaran berhasil ditambahkan.');
    }

    public function updatePseudonym(Request $request, PseudonymDictionary $pseudonym)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:pseudonym_dictionaries,name,' . $pseudonym->id,
            'category' => 'required|string|max:255',
        ]);

        $pseudonym->update($validated);

        return back()->with('success', 'Nama samaran berhasil diperbarui.');
    }

    public function destroyPseudonym(PseudonymDictionary $pseudonym)
    {
        $this->authorizeAdmin();

        $pseudonym->delete();

        return back()->with('success', 'Nama samaran berhasil dihapus.');
    }
}
