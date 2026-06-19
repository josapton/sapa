<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>SAPA - Detail Laporan</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #000; line-height: 1.5; }
        .header-table { width: 100%; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header-table td { vertical-align: middle; }
        .logo-cell { width: 15%; text-align: center; }
        .logo { width: 90px; height: auto; }
        .text-cell { width: 85%; text-align: center; line-height: 1.3; }
        .univ-name { margin: 0; font-size: 20px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; }
        .univ-address { margin: 5px 0 0 0; font-size: 12px; }
        .doc-title { text-align: center; font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 20px; text-decoration: underline; }
        .section { margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .table th, .table td { padding: 6px 8px; border: 1px solid #000; text-align: left; vertical-align: top; }
        .table th { width: 30%; font-weight: bold; }
        .content-box { border: 1px solid #000; padding: 10px; min-height: 100px; }
        .footer { margin-top: 40px; }
        .signature-table { width: 100%; margin-top: 30px; }
        .signature-table td { width: 50%; text-align: left; vertical-align: top; }
    </style>
</head>
<body>
    <table class="header-table">
        <tr>
            <td class="logo-cell">
                <img src="{{ public_path('images/logo-uby.png') }}" class="logo" alt="Logo UBY">
            </td>
            <td class="text-cell">
                <h1 class="univ-name">UNIVERSITAS BOYOLALI</h1>
                <p class="univ-address">Jl. Pandanaran No.405, Dusun 1, Winong, Kab. Boyolali, 57315<br>Website : https://www.uby.ac.id<br>&#9742; Telp. 0276321328</p>
            </td>
        </tr>
    </table>

    <div class="doc-title">
        LAPORAN / ADUAN / ASPIRASI
    </div>

    <div class="section">
        <div class="section-title">Informasi Laporan</div>
        <table class="table">
            <tr>
                <th>Kode Lacak</th>
                <td><strong>{{ $submission->tracking_code }}</strong></td>
            </tr>
            <tr>
                <th>Judul</th>
                <td>{{ $submission->title }}</td>
            </tr>
            <tr>
                <th>Tanggal Masuk</th>
                <td>{{ $submission->created_at->format('d M Y H:i') }}</td>
            </tr>
            <tr>
                <th>Tanggal Kejadian</th>
                <td>{{ $submission->incident_date ? \Carbon\Carbon::parse($submission->incident_date)->translatedFormat('d F Y') : '-' }}</td>
            </tr>
            <tr>
                <th>Lokasi Kejadian</th>
                <td>{{ $submission->incident_location ?: '-' }}</td>
            </tr>
            <tr>
                <th>Kategori</th>
                <td>{{ $submission->category ? $submission->category->name : '-' }}</td>
            </tr>
            <tr>
                <th>Tipe Dokumen</th>
                <td style="text-transform: capitalize;">{{ $submission->type }}</td>
            </tr>
            <tr>
                <th>Status Penanganan</th>
                <td>{{ strtoupper($submission->status) }}</td>
            </tr>
            <tr>
                <th>Identitas Pelapor</th>
                <td>{{ $submission->user->pseudonym }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <strong>Isi Laporan/Aduan/Aspirasi:</strong>
        <div class="content-box" style="margin-top: 5px;">
            {!! nl2br(e($submission->content)) !!}
        </div>
    </div>

    @if($submission->attachments && $submission->attachments->count() > 0)
    <div class="section">
        <strong>Lampiran:</strong>
        <div style="margin-top: 5px;">
            @foreach($submission->attachments as $attachment)
                @php
                    $extension = pathinfo($attachment->file_path, PATHINFO_EXTENSION);
                    $isImage = in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'gif']);
                @endphp
                <div style="margin-bottom: 10px; border: 1px solid #ccc; padding: 5px; text-align: center;">
                    @if($isImage)
                        <img src="{{ public_path('storage/' . $attachment->file_path) }}" style="max-width: 100%; max-height: 300px; display: block; margin: 0 auto;" alt="Lampiran">
                    @else
                        <p style="margin: 0; padding: 10px; background-color: #f9f9f9;">
                            &#128196; <strong>File Terlampir:</strong> {{ basename($attachment->file_path) }}
                        </p>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
    @endif

    @if($submission->comments && $submission->comments->count() > 0)
    <div class="section">
        <strong>Tanggapan / Tindak Lanjut:</strong>
        <table class="table" style="margin-top: 5px;">
            <tr>
                <th style="width: 25%;">Pemberi Tanggapan</th>
                <th style="width: 25%;">Tanggal</th>
                <th style="width: 50%;">Catatan</th>
            </tr>
            @foreach($submission->comments as $comment)
            <tr>
                <td>{{ $comment->user->pseudonym }} ({{ ucfirst($comment->user->role) }})</td>
                <td>{{ $comment->created_at->format('d M Y H:i') }}</td>
                <td>{!! nl2br(e($comment->content)) !!}</td>
            </tr>
            @endforeach
        </table>
    </div>
    @endif

    <div class="footer">
        <table class="signature-table">
            <tr>
                <td></td>
                <td>
                    Boyolali, {{ now()->translatedFormat('d F Y') }}<br>
                    Mengetahui,<br>
                    Petugas / Admin<br><br><br><br><br>
                    (......................................)
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
