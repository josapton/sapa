<p align="center">
  <img src="public/images/logo.png" width="150" alt="SAPA Logo">
</p>

# SAPA - Sistem Aspirasi dan Pengaduan Akademik

SAPA adalah sebuah platform berbasis web yang dirancang khusus untuk mahasiswa agar dapat menyuarakan aspirasi, memberikan aduan, dan melaporkan permasalahan di lingkungan kampus secara aman dan terstruktur.

## Fitur Utama
- **Sistem Pseudonim:** Identitas mahasiswa disamarkan (misalnya "Anonim 231" atau pseudonim unik dari sistem) untuk melindungi privasi pelapor.
- **Manajemen Aduan:** Mahasiswa dapat membuat, mengedit, dan menghapus aduan/laporan mereka.
- **Kategori Aduan:** Laporan dikategorikan (Fasilitas, Akademik, Pelayanan, dll.) untuk memudahkan penanganan.
- **Lampiran Bukti:** Dukungan untuk mengunggah foto atau dokumen sebagai bukti laporan.
- **Sistem Dukungan & Interaksi:** Mahasiswa lain dapat memberikan dukungan (_upvote_) dan memberikan komentar pada laporan yang bersifat publik.
- **Manajemen Role & Hak Akses:** Sistem role-based access control (RBAC) memisahkan akses untuk Mahasiswa, Dosen, Admin, dan Super Admin dengan manajemen _user_ yang terpusat.
- **Syarat dan Ketentuan Pelaporan:** Dilengkapi dengan persetujuan syarat & ketentuan (_Terms & Conditions_) sebelum membuat laporan untuk menjaga etika dan ketertiban.
- **Halaman Legal & Informasi:** Dilengkapi dengan halaman Tentang Kami, Syarat & Ketentuan, dan Kebijakan Privasi yang dapat diakses secara dinamis melalui Footer interaktif.
- **Keamanan:** Dilengkapi dengan verifikasi pendaftaran melalui sistem OTP (melalui Email) dan perlindungan formulir otentikasi menggunakan _Captcha_ Matematika.
- **Tampilan Dinamis (Dark Mode):** Tampilan antarmuka (UI) yang modern, bersih (_clean_), responsif untuk perangkat mobile (dengan _floating dropdown menu_), dan mendukung mode gelap (_dark mode_) yang menyesuaikan dengan preferensi perangkat atau sistem operasi pengguna.
- **Template Email Modern:** Semua notifikasi email (kode OTP dan pembaruan status laporan) menggunakan _layout_ yang terstruktur, menarik, dan sepenuhnya responsif di semua perangkat.

## Teknologi yang Digunakan
- **Backend:** [Laravel 11](https://laravel.com)
- **Frontend:** [React](https://reactjs.org) (dengan [Inertia.js](https://inertiajs.com/))
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Database:** MySQL / MariaDB

## Prasyarat Instalasi
- PHP >= 8.2
- Composer
- Node.js & NPM
- Database MySQL / MariaDB

## Instalasi dan Menjalankan Proyek secara Lokal

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/universitas-boyolali/sapa.git
   cd sapa
   ```

2. **Install dependensi PHP & Node.js:**
   ```bash
   composer install
   npm install
   ```

3. **Konfigurasi Environment:**
   Duplikat file `.env.example` menjadi `.env`.
   ```bash
   cp .env.example .env
   ```
   Lalu konfigurasikan database dan pengaturan SMTP Mailer di file `.env`. Untuk environment lokal yang menggunakan Docker/Sail, Mailpit sudah disediakan secara bawaan untuk pengujian email (OTP/Notifikasi):
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=sapa
   DB_USERNAME=root
   DB_PASSWORD=

   MAIL_MAILER=smtp
   MAIL_HOST=mailpit
   MAIL_PORT=1025
   MAIL_USERNAME=null
   MAIL_PASSWORD=null
   MAIL_ENCRYPTION=null
   MAIL_FROM_ADDRESS="hello@example.com"
   MAIL_FROM_NAME="${APP_NAME}"
   ```

4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

5. **Jalankan Migrasi & Seeder Database:**
   (Untuk mengisi data awal seperti kamus pseudonim dan akun admin)
   ```bash
   php artisan migrate --seed
   ```

6. **Jalankan Server:**
   Buka dua terminal berbeda dan jalankan perintah berikut:
   - Terminal 1 (Backend): `php artisan serve`
   - Terminal 2 (Frontend): `npm run dev`

7. Akses aplikasi melalui `http://localhost:8000`

## Menjalankan Proyek dengan Docker (Laravel Sail)
Jika Anda lebih suka menggunakan Docker, Laravel Sail sudah disiapkan dan dikonfigurasi di dalam proyek ini.

1. **Pastikan Docker Desktop sudah berjalan di perangkat Anda.**
2. **Install dependensi awal (jika belum):**
   ```bash
   composer install
   npm install
   ```
3. **Konfigurasi Environment:**
   Duplikat file `.env.example` menjadi `.env` lalu sesuaikan untuk Sail (gunakan host `mysql`):
   ```env
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_DATABASE=sapa
   DB_USERNAME=sail
   DB_PASSWORD=password
   ```
4. **Jalankan Sail (Docker Containers):**
   ```bash
   ./vendor/bin/sail up -d
   ```
5. **Migrasi Database & Build Aset Frontend:**
   ```bash
   ./vendor/bin/sail artisan migrate --seed
   ./vendor/bin/sail npm run build
   ```
6. **Akses aplikasi:** Buka `http://localhost` di browser Anda.
7. **Testing Email (Mailpit):** Anda dapat melihat semua email (OTP/Reset Password) yang keluar secara lokal dengan membuka _dashboard_ Mailpit di `http://localhost:8025`.
*(Untuk menghentikan Sail, jalankan `./vendor/bin/sail down`)*

## Berkontribusi (Dev Branch)
Jika Anda ingin berkontribusi pada proyek ini, harap lakukan di branch `dev`.
1. Checkout ke branch dev: `git checkout dev`
2. Buat branch fitur baru: `git checkout -b fitur-saya`
3. Commit perubahan: `git commit -m "Menambahkan fitur X"`
4. Push ke GitHub: `git push origin fitur-saya`
5. Buat Pull Request (PR) ke branch `dev`.

## Lisensi
SAPA bersifat open-sourced dan dilisensikan di bawah [MIT license](https://opensource.org/licenses/MIT).
