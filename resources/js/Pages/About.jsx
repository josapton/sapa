import { Head, Link, usePage } from '@inertiajs/react';
import { Shield, Users, Heart, ArrowLeft } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import Footer from '@/Components/Footer';

export default function About() {
    const { auth } = usePage().props;
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Head title="Tentang SAPA" />

            {/* Navbar */}
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
                                <Link href={route('about')} className="text-orange-600 font-semibold border-b-2 border-orange-600 px-1 py-5">Tentang SAPA</Link>
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

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-12 text-white text-center">
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Tentang SAPA</h1>
                        <p className="text-lg text-orange-100 max-w-2xl mx-auto">
                            Sistem Aspirasi dan Pengaduan Akademik (SAPA) didedikasikan untuk menciptakan lingkungan kampus yang lebih baik.
                        </p>
                    </div>

                    <div className="p-8 md:p-12 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Latar Belakang</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                SAPA hadir sebagai wujud nyata komitmen Universitas Boyolali dalam mendengarkan, merespons, dan menindaklanjuti setiap suara dari civitas akademika. Kami percaya bahwa komunikasi yang terbuka dan transparan adalah kunci utama kemajuan institusi pendidikan. Platform ini dibangun khusus untuk memberikan wadah pelaporan yang aman, terstruktur, dan akuntabel.
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                                    <Shield size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Aman & Terlindungi</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Privasi pelapor dijamin menggunakan sistem pseudonim. Identitas asli dilindungi.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center mb-4">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Transparan</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Laporan dapat dilacak status penanganannya secara real-time oleh pelapor.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                                    <Heart size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Responsif</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Unit terkait diwajibkan memberikan respon yang cepat dan solutif.</p>
                            </div>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Alur Penanganan</h2>
                            <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2">
                                <li><strong>Pelaporan:</strong> Mahasiswa membuat laporan/aduan melalui dashboard.</li>
                                <li><strong>Verifikasi:</strong> Laporan akan diverifikasi kelengkapannya oleh admin.</li>
                                <li><strong>Proses Tindak Lanjut:</strong> Unit kerja terkait menindaklanjuti permasalahan.</li>
                                <li><strong>Penyelesaian:</strong> Laporan dinyatakan selesai dengan keterangan resmi dari petugas.</li>
                            </ol>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
