<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>@yield('title')</title>
    <style>
        @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 0 !important; }
            .email-container { border-radius: 0 !important; border: none !important; width: 100% !important; max-width: 100% !important; }
            .header-cell { padding: 25px 15px !important; }
            .header-logo { height: 45px !important; }
            .header-title { font-size: 20px !important; margin-top: 15px !important; }
            .content-cell { padding: 30px 20px !important; }
            .otp-box { font-size: 32px !important; letter-spacing: 8px !important; padding: 15px !important; }
        }
    </style>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; color: #374151;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;" class="email-wrapper">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e5e7eb; margin: 0 auto;" class="email-container">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 30px 20px; background-color: #ffffff; border-bottom: 3px solid #ea580c;" class="header-cell">
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                <tr>
                                    @if(file_exists(public_path('images/logo.png')))
                                    <td style="padding-right: 15px;">
                                        <img src="{{ $message->embed(public_path('images/logo.png')) }}" alt="SAPA Logo" style="height: 55px; display: block;" class="header-logo">
                                    </td>
                                    @endif
                                    @if(file_exists(public_path('images/logo-uby.png')))
                                    <td style="padding-left: 15px; border-left: 2px solid #f3f4f6;">
                                        <img src="{{ $message->embed(public_path('images/logo-uby.png')) }}" alt="UBY Logo" style="height: 55px; display: block;" class="header-logo">
                                    </td>
                                    @endif
                                </tr>
                            </table>
                            <h1 style="color: #ea580c; font-size: 24px; margin: 20px 0 0 0; font-weight: 800; letter-spacing: 0.5px;" class="header-title">SAPA Universitas Boyolali</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 45px 40px; font-size: 16px; line-height: 1.6; color: #374151;" class="content-cell">
                            @yield('content')
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #4b5563; font-weight: bold;">
                                Sistem Layanan Pengaduan Aspirasi<br>Universitas Boyolali
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                                &copy; {{ date('Y') }} SAPA Universitas Boyolali. Seluruh hak cipta dilindungi.<br>
                                Jl. Pandanaran No.405, Boyolali, Jawa Tengah.
                            </p>
                        </td>
                    </tr>
                </table>
                <p style="margin-top: 20px; font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.5;">
                    Email ini dikirim secara otomatis oleh sistem.<br>Mohon tidak membalas email ini.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
