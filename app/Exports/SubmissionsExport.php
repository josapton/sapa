<?php

namespace App\Exports;

use App\Models\Submission;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SubmissionsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Submission::with(['user', 'category'])->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Kode Lacak',
            'Judul',
            'Isi',
            'Kategori',
            'Tipe',
            'Status',
            'Privasi',
            'Tanggal Kejadian',
            'Lokasi Kejadian',
            'Tanggal Masuk',
            'Pelapor',
        ];
    }

    public function map($submission): array
    {
        static $rowNumber = 0;
        $rowNumber++;

        return [
            $rowNumber,
            $submission->tracking_code,
            $submission->title,
            $submission->content,
            $submission->category ? $submission->category->name : '-',
            ucfirst($submission->type),
            ucfirst($submission->status),
            ucfirst($submission->visibility),
            $submission->incident_date ? \Carbon\Carbon::parse($submission->incident_date)->format('Y-m-d') : '-',
            $submission->incident_location ?: '-',
            $submission->created_at->format('Y-m-d H:i:s'),
            $submission->user ? $submission->user->pseudonym : 'Unknown',
        ];
    }
}
