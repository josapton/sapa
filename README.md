<p align="center">
  <img src="public/images/logo.png" width="150" alt="SAPA Logo">
</p>

# SAPA - Sistem Aduan Aspirasi dan Pelaporan Akademik

SAPA adalah sebuah platform berbasis web yang dirancang khusus untuk mahasiswa agar dapat menyuarakan aspirasi, memberikan aduan, dan melaporkan permasalahan di lingkungan kampus secara aman dan terstruktur.

## Fitur Utama
- **Sistem Pseudonim:** Identitas mahasiswa disamarkan (misalnya "Anonim 231" atau pseudonim unik dari sistem) untuk melindungi privasi pelapor.
- **Manajemen Aduan:** Mahasiswa dapat membuat, mengedit, dan menghapus aduan mereka.
- **Kategori Aduan:** Laporan dapat dikategorikan (Fasilitas, Akademik, Pelayanan, dll.) untuk memudahkan penanganan.
- **Lampiran Bukti:** Dukungan untuk mengunggah foto atau dokumen sebagai bukti laporan.
- **Sistem Dukungan (Upvote):** Mahasiswa lain dapat memberikan dukungan (like) dan komentar pada laporan yang bersifat publik.
- **Keamanan:** Dilengkapi dengan verifikasi pendaftaran melalui OTP (Email) dan perlindungan form menggunakan Captcha Matematika.
- **Tampilan Dinamis (Dark Mode):** Tampilan antarmuka yang modern, responsif, dan mendukung mode gelap (_dark mode_) yang menyesuaikan dengan preferensi perangkat pengguna.

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
   Atur koneksi database (misal MySQL) pada file `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=sapa
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

5. **Jalankan Migrasi Database:**
   ```bash
   php artisan migrate
   ```

6. **Jalankan Server:**
   Buka dua terminal berbeda dan jalankan perintah berikut:
   - Terminal 1 (Backend): `php artisan serve`
   - Terminal 2 (Frontend): `npm run dev`

7. Akses aplikasi melalui `http://localhost:8000`

## Menjalankan Proyek dengan Docker (Laravel Sail)
Jika Anda lebih suka menggunakan Docker, Laravel Sail sudah tersedia di proyek ini.

1. **Pastikan Docker Desktop sudah berjalan di perangkat Anda.**
2. **Install dependensi awal (jika belum):**
   ```bash
   composer install
   npm install
   ```
3. **Konfigurasi Environment:**
   Duplikat file `.env.example` menjadi `.env` lalu sesuaikan untuk Sail:
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
   ./vendor/bin/sail artisan migrate
   ./vendor/bin/sail npm run build
   ```
6. **Akses aplikasi:** Buka `http://localhost` di browser Anda.
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
