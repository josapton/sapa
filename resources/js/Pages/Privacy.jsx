import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import Footer from '@/Components/Footer';

export default function Privacy() {
    const { auth } = usePage().props;
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Head title="Kebijakan Privasi - SAPA" />

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
                    <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">Kebijakan Privasi</h1>
                    
                    <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                        <p>
                            Kebijakan Privasi ini menjelaskan bagaimana Sistem Aspirasi dan Pengaduan Akademik (SAPA) Universitas Boyolali mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Informasi yang Kami Kumpulkan</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Informasi Pendaftaran:</strong> NIM, alamat email universitas.</li>
                            <li><strong>Informasi Laporan:</strong> Isi laporan, aduan, aspirasi, serta lampiran media pendukung.</li>
                            <li><strong>Data Anonimitas:</strong> Pseudonim yang dibuat secara acak oleh sistem.</li>
                        </ul>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Penggunaan Informasi</h2>
                        <p>Informasi yang dikumpulkan digunakan semata-mata untuk:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Memverifikasi status kepemilikan akun (mahasiswa terdaftar).</li>
                            <li>Menindaklanjuti dan menyelesaikan masalah yang dilaporkan.</li>
                            <li>Keperluan analitik statistik demi peningkatan kualitas pelayanan kampus.</li>
                        </ul>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Perlindungan Identitas (Pseudonimisasi)</h2>
                        <p>
                            Sistem dirancang untuk menjaga kerahasiaan identitas asli pelapor dari publik dan pihak tidak berwenang. Publik hanya akan melihat nama samaran (pseudonim). Identitas asli hanya dapat diakses oleh admin sistem dan pihak yang secara langsung menangani laporan jika diperlukan untuk penyelesaian masalah yang krusial.
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Berbagi Informasi</h2>
                        <p>
                            Kami tidak akan pernah menjual, menyewakan, atau menukar informasi pribadi Anda kepada pihak ketiga. Data laporan hanya diteruskan secara internal kepada unit kerja atau pejabat Universitas Boyolali yang berwenang menindaklanjutinya.
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Keamanan Data</h2>
                        <p>
                            SAPA berkomitmen menggunakan standar keamanan yang memadai untuk melindungi data dari akses, perubahan, pengungkapan, atau perusakan yang tidak sah.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
