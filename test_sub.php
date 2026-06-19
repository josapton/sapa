<?php

// Script untuk menguji interaksi langsung ke Laravel App
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Contoh: Mengambil Laporan Pertama
$sub = \App\Models\Submission::first();
if ($sub) {
    echo "Ditemukan Laporan: " . $sub->title . " (Status: " . $sub->status . ")\n";
} else {
    echo "Belum ada laporan di database.\n";
}
