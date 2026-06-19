import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import Footer from '@/Components/Footer';

export default function Terms() {
    const { auth } = usePage().props;
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Head title="Syarat & Ketentuan - SAPA" />

            <nav className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <ApplicationLogo className="h-8 w-auto mr-2" />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                                SAPA
                            </span>
                            <div className="hidden md:flex ml-10 space-x-8">
                                <Link href={route('home')} className="text-gray-500 hover:text-orange-600 px-1 py-5 font-medium transition">Beranda</Link>
                                <Link href={route('submissions.public_feed')} className="text-gray-500 hover:text-orange-600 px-1 py-5 font-medium transition">Semua Laporan</Link>
                                <Link href={route('about')} className="text-gray-500 hover:text-orange-600 px-1 py-5 font-medium transition">Tentang SAPA</Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium hover:bg-orange-100 dark:hover:bg-orange-900/50 transition"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:from-orange-600 hover:to-red-600 shadow-md shadow-orange-500/30 transition"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link href={route('home')} className="inline-flex items-center text-gray-500 hover:text-orange-600 transition">
                        <ArrowLeft size={20} className="mr-2" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden p-8 md:p-12">
                    <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">Syarat & Ketentuan</h1>
                    
                    <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                        <p>
                            Dengan menggunakan platform Sistem Aspirasi dan Pengaduan Akademik (SAPA), Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan berikut.
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Kewajiban Pengguna</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Laporan, aduan, atau aspirasi yang disampaikan harus berdasarkan fakta yang dapat dipertanggungjawabkan.</li>
                            <li>Dilarang menggunakan kata-kata kasar, makian, atau konten yang mengandung unsur Suku, Agama, Ras, dan Antargolongan (SARA).</li>
                            <li>Dilarang menyampaikan laporan palsu (hoax) atau fitnah yang dapat mencemarkan nama baik individu maupun institusi.</li>
                            <li>Menyertakan bukti lampiran (foto/dokumen) sangat disarankan untuk mempercepat proses verifikasi dan tindak lanjut.</li>
                        </ul>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Hak Pengelola (Universitas Boyolali)</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Admin SAPA berhak menolak, menyembunyikan, atau menghapus laporan yang dinilai melanggar ketentuan poin 1 tanpa pemberitahuan sebelumnya.</li>
                            <li>Pihak kampus berhak memproses dan menggunakan data laporan sebagai acuan evaluasi kebijakan akademik dan non-akademik.</li>
                            <li>Jika ditemukan laporan fiktif atau fitnah yang merugikan, pihak kampus berhak membuka identitas pelapor untuk diberikan sanksi sesuai aturan akademik yang berlaku.</li>
                        </ul>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Status Laporan</h2>
                        <p>
                            Pengguna memahami bahwa kecepatan tindak lanjut bergantung pada kompleksitas masalah yang dilaporkan. Sistem ini bukan layanan darurat, untuk kondisi gawat darurat mohon hubungi pihak berwenang di kampus secara langsung.
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Perubahan Kebijakan</h2>
                        <p>
                            Universitas Boyolali berhak memperbarui atau mengubah Syarat & Ketentuan ini sewaktu-waktu. Pengguna disarankan untuk secara berkala memeriksa halaman ini.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
