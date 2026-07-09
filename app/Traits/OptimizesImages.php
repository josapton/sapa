<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

trait OptimizesImages
{
    /**
     * Optimize and store an uploaded image file, or fallback to standard store for non-images.
     *
     * @param UploadedFile $file
     * @param string $disk
     * @param string $directory
     * @return array Contains 'file_path', 'file_name', and 'mime_type'
     */
    public function optimizeAndStoreImage(UploadedFile $file, string $disk = 'public', string $directory = 'attachments'): array
    {
        $mimeType = $file->getClientMimeType();
        
        // Cek apakah file adalah gambar (dan bukan animasi/vector yang bisa rusak dikompresi)
        if (str_starts_with($mimeType, 'image/') && !in_array($mimeType, ['image/svg+xml', 'image/gif'])) {
            try {
                $manager = new ImageManager(new Driver());
                
                // Baca gambar dari memori (tmp file)
                $image = $manager->read($file->getPathname());
                
                // Jika lebar lebih dari 1200px, perkecil proporsional
                if ($image->width() > 1200) {
                    $image->scaleDown(width: 1200);
                }
                
                // Encode menjadi webp dengan quality 80%
                $encoded = $image->toWebp(80);
                
                $filename = Str::random(40) . '.webp';
                $path = $directory . '/' . $filename;
                
                // Simpan ke storage
                Storage::disk($disk)->put($path, (string) $encoded);
                
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '.webp';
                
                return [
                    'file_path' => $path,
                    'file_name' => $originalName,
                    'mime_type' => 'image/webp',
                ];
            } catch (\Exception $e) {
                // Fallback ke normal upload jika library GD / Intervention Image error (misal format tidak disupport)
                \Illuminate\Support\Facades\Log::error('Image optimization failed: ' . $e->getMessage());
            }
        }

        // Standard fallback untuk non-gambar atau jika kompresi gagal
        $path = $file->store($directory, $disk);
        return [
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $mimeType,
        ];
    }
}
