import { Head, Link, router, usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Flame, ArrowLeft, Filter, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import ShareDropdown from '@/Components/ShareDropdown';
import SubmissionCard from '@/Components/SubmissionCard';
import Footer from '@/Components/Footer';

export default function Index({ submissions, filters, categories }) {
    const { auth } = usePage().props;

    const handleFilterChange = (key, value) => {
        router.get(route('submissions.public_feed'), {
            ...filters,
            [key]: value
        }, { preserveState: true, replace: true });
    };

    const handleLike = (submissionId) => {
        router.post(route('likes.toggle', submissionId), {}, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Head title="Semua Laporan & Aspirasi - SAPA" />

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
                                <Link href={route('submissions.public_feed')} className="text-orange-600 font-semibold border-b-2 border-orange-600 px-1 py-5">Semua Laporan</Link>
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Semua Laporan & Aspirasi</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Telusuri semua laporan, aduan, dan aspirasi publik dari civitas akademika.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full md:w-64 shrink-0">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                            <h3 className="font-bold text-lg mb-4 flex items-center">
                                <Filter size={18} className="mr-2" /> Filter
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Jenis</label>
                                    <div className="space-y-2">
                                        {['semua', 'laporan', 'aduan', 'aspirasi'].map(type => (
                                            <label key={type} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value={type}
                                                    checked={(filters.type || 'semua') === type}
                                                    onChange={e => handleFilterChange('type', e.target.value)}
                                                    className="text-orange-500 focus:ring-orange-500 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                                />
                                                <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
                                    <select
                                        value={filters.category || ''}
                                        onChange={e => handleFilterChange('category', e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg shadow-sm text-sm"
                                    >
                                        <option value="">Semua Kategori</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Urutkan</label>
                                    <select
                                        value={filters.sort || 'terbaru'}
                                        onChange={e => handleFilterChange('sort', e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg shadow-sm text-sm"
                                    >
                                        <option value="terbaru">Terbaru</option>
                                        <option value="terlama">Terlama</option>
                                        <option value="populer">Terpopuler</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {submissions.data.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                    Tidak ada laporan yang ditemukan dengan filter tersebut.
                                </div>
                            ) : (
                                submissions.data.map((submission) => (
                                    <SubmissionCard 
                                        key={submission.id} 
                                        submission={submission} 
                                        auth={auth} 
                                        onLike={handleLike} 
                                    />
                                ))
                            )}
                        </div>

                        {submissions.links && (
                            <div className="mt-8">
                                <Pagination links={submissions.links} />
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
