<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekapitulasi Laporan SAPA</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 10px; color: #000; line-height: 1.5; }
        .header-table { width: 100%; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header-table td { vertical-align: middle; }
        .logo-cell { width: 15%; text-align: center; }
        .logo { width: 70px; height: auto; }
        .text-cell { width: 85%; text-align: center; line-height: 1.3; }
        .univ-name { margin: 0; font-size: 18px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; }
        .univ-address { margin: 5px 0 0 0; font-size: 10px; }
        .doc-title { text-align: center; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; text-decoration: underline; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .table th, .table td { padding: 4px; border: 1px solid #000; text-align: left; vertical-align: top; }
        .table th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
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
        REKAPITULASI LAPORAN / ADUAN / ASPIRASI SAPA
    </div>

    <table class="table">
        <thead>
            <tr>
                <th style="width: 3%;">No</th>
                <th style="width: 8%;">Kode Lacak</th>
                <th style="width: 10%;">Tgl Lapor</th>
                <th style="width: 10%;">Pelapor</th>
                <th style="width: 10%;">Kategori</th>
                <th style="width: 20%;">Judul</th>
                <th style="width: 10%;">Tgl Kejadian</th>
                <th style="width: 15%;">Lokasi</th>
                <th style="width: 7%;">Status</th>
                <th style="width: 7%;">Privasi</th>
            </tr>
        </thead>
        <tbody>
            @foreach($submissions as $index => $sub)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td>{{ $sub->tracking_code }}</td>
                <td>{{ $sub->created_at->format('d/m/Y') }}</td>
                <td>{{ $sub->user ? $sub->user->pseudonym : '-' }}</td>
                <td>{{ $sub->category ? $sub->category->name : '-' }}</td>
                <td>{{ $sub->title }}</td>
                <td>{{ $sub->incident_date ? \Carbon\Carbon::parse($sub->incident_date)->format('d/m/Y') : '-' }}</td>
                <td>{{ $sub->incident_location ?: '-' }}</td>
                <td style="text-align: center;">{{ ucfirst($sub->status) }}</td>
                <td style="text-align: center;">{{ ucfirst($sub->visibility) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
