<?php

// Script untuk menguji konfigurasi SMTP Email
// Cara menjalankan: wsl ./vendor/bin/sail php test_email.php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Mail;

// Ganti alamat email di bawah ini dengan alamat email tujuan pengetesan Anda
$targetEmail = 'email_tujuan_anda@gmail.com'; 

try {
    echo "Mencoba mengirim email ke {$targetEmail}...\n";
    
    Mail::raw('Halo! Ini adalah pesan uji coba dari sistem SAPA Universitas Boyolali untuk memastikan bahwa konfigurasi SMTP Anda telah berhasil.', function($msg) use ($targetEmail) { 
        $msg->to($targetEmail)->subject('Testing Email SAPA - Berhasil'); 
    });
    
    echo "SUKSES: Email berhasil dikirim ke {$targetEmail}!\n";
} catch (\Exception $e) {
    echo "GAGAL: Terjadi kesalahan saat mengirim email:\n";
    echo $e->getMessage() . "\n";
}
