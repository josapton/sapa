<!DOCTYPE html>
<html>
<head>
    <title>Verifikasi OTP SAPA</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="max-w-xl mx-auto p-4">
        <h2 style="color: #ea580c;">Halo!</h2>
        <p>Terima kasih telah mendaftar di SAPA. Berikut adalah kode OTP Anda untuk memverifikasi alamat email Anda:</p>
        
        <div style="margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111;">
            {{ $otp }}
        </div>
        
        <p>Kode ini akan kedaluwarsa dalam 10 menit. Jangan bagikan kode ini kepada siapa pun.</p>
        <p>Jika Anda tidak merasa mendaftar di SAPA, abaikan email ini.</p>
        
        <br>
        <p>Salam,<br>Tim SAPA</p>
    </div>
</body>
</html>
