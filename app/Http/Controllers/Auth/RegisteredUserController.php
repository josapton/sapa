<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $num1 = rand(1, 9);
        $num2 = rand(1, 9);
        session(['captcha_answer' => $num1 + $num2]);

        return Inertia::render('Auth/Register', [
            'captcha_question' => "Berapa hasil dari $num1 + $num2?",
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'captcha' => 'required|numeric',
        ]);

        if ($request->captcha != session('captcha_answer')) {
            throw ValidationException::withMessages([
                'captcha' => 'Jawaban Captcha salah.',
            ]);
        }

        $dictionaryEntry = \App\Models\PseudonymDictionary::inRandomOrder()->first();
        $pseudonym = $dictionaryEntry ? $dictionaryEntry->name . ' ' . rand(100, 999) : 'Anonim ' . rand(1000, 9999);

        $otpCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'mahasiswa',
            'pseudonym' => $pseudonym,
            'otp_code' => $otpCode,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($user)->send(new OtpMail($otpCode));

        Auth::login($user);

        return redirect(route('verification.notice', absolute: false));
    }
}
