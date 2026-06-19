<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Submission;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SubmissionsExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class AdminExportController extends Controller
{
    public function exportExcel()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Akses ditolak.');
        }

        return Excel::download(new SubmissionsExport, 'rekap-laporan-sapa.xlsx');
    }

    public function exportPdf()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Akses ditolak.');
        }

        $submissions = Submission::with(['user', 'category'])->get();

        $pdf = Pdf::loadView('pdf.all_submissions', compact('submissions'))->setPaper('a4', 'landscape');
        return $pdf->stream('Rekap-Laporan-SAPA.pdf');
    }
}
