@extends('emails.layout')

@section('title', 'Verifikasi OTP SAPA')

@section('content')
<h2 style="color: #111827; margin-top: 0; font-size: 22px; margin-bottom: 20px;">Halo!</h2>
<p style="margin-bottom: 25px; color: #4b5563;">Terima kasih telah mendaftar di SAPA Universitas Boyolali. Berikut adalah kode OTP Anda untuk memverifikasi alamat email Anda:</p>

<div style="background-color: #fff7ed; border: 2px dashed #f97316; border-radius: 8px; padding: 25px; text-align: center; margin: 35px 0;" class="otp-box">
    <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #ea580c; font-family: monospace;">{{ $otp }}</span>
</div>

<p style="color: #ef4444; font-size: 15px; text-align: center; margin-bottom: 35px; background-color: #fef2f2; padding: 15px; border-radius: 8px; border: 1px solid #fecaca;">
    <strong>⚠️ PENTING:</strong> Kode ini akan kedaluwarsa dalam <strong>10 menit</strong>. Jangan bagikan kode ini kepada siapa pun!
</p>

<p style="font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 25px; margin-bottom: 0;">
    Jika Anda tidak merasa mendaftar di SAPA, Anda dapat mengabaikan email ini dengan aman.
</p>
@endsection
