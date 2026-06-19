@extends('emails.layout')

@section('title', 'Pembaruan Status Laporan')

@section('content')
<h2 style="color: #111827; margin-top: 0; font-size: 22px; margin-bottom: 25px;">Halo, {{ $submission->user->name }}</h2>
<p style="margin-bottom: 25px; color: #4b5563; font-size: 16px;">Status laporan Anda dengan kode pelacakan <strong>{{ $submission->tracking_code }}</strong> telah diperbarui.</p>

<div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin: 30px 0; border: 1px solid #e5e7eb; border-left: 5px solid #ea580c; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td style="padding-bottom: 15px;">
                <span style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px; font-weight: bold;">Judul Laporan</span>
                <span style="font-size: 18px; color: #111827; font-weight: bold;">{{ $submission->title }}</span>
            </td>
        </tr>
        <tr>
            <td style="padding-top: 15px; border-top: 1px solid #f3f4f6;">
                <span style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px; font-weight: bold;">Status Saat Ini</span>
                @php
                    $statusColors = [
                        'pending' => ['bg' => '#fef3c7', 'text' => '#92400e', 'border' => '#fde68a'],
                        'processing' => ['bg' => '#dbeafe', 'text' => '#1e40af', 'border' => '#bfdbfe'],
                        'resolved' => ['bg' => '#d1fae5', 'text' => '#065f46', 'border' => '#a7f3d0'],
                        'rejected' => ['bg' => '#fee2e2', 'text' => '#991b1b', 'border' => '#fecaca'],
                    ];
                    $color = $statusColors[$submission->status] ?? ['bg' => '#f3f4f6', 'text' => '#374151', 'border' => '#e5e7eb'];
                @endphp
                <span style="display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; background-color: {{ $color['bg'] }}; color: {{ $color['text'] }}; border: 1px solid {{ $color['border'] }};">
                    {{ ucfirst($submission->status) }}
                </span>
            </td>
        </tr>
    </table>
</div>

<p style="margin-bottom: 30px; color: #4b5563; font-size: 16px;">Anda dapat melihat detail lengkap dan tanggapan terkait laporan ini dengan mengklik tombol di bawah ini:</p>

<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <a href="{{ route('submissions.show', $submission->id) }}" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.3); transition: all 0.2s;">
                Lihat Detail Laporan
            </a>
        </td>
    </tr>
</table>

<p style="margin-top: 40px; font-size: 15px; color: #6b7280; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 25px;">
    Terima kasih telah berpartisipasi aktif dalam menciptakan lingkungan kampus Universitas Boyolali yang lebih baik dan transparan.
</p>
@endsection
