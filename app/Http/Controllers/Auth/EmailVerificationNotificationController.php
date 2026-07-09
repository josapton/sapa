<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        $user = $request->user();
        $otpCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->update([
            'otp_code' => $otpCode,
            'otp_expires_at' => now()->addMinutes(10)
        ]);

        try {
            Mail::to($user)->send(new OtpMail($otpCode));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to resend OTP email: ' . $e->getMessage());
        }

        return back()->with('status', 'verification-link-sent');
    }
}
