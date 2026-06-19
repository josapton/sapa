import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Flame, MessageCircle, FileText, CheckCircle, Clock, Search, ArrowRight, Bookmark, Share2, Menu, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

import Footer from '@/Components/Footer';
import SubmissionCard from '@/Components/SubmissionCard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import ShareDropdown from '@/Components/ShareDropdown';
import Pagination from '@/Components/Pagination';

export default function Welcome({ auth, submissions, stats, categories, filters }) {
    const { data, setData, post, processing, errors } = useForm({
        tracking_code: '',
    });

    const [search, setSearch] = useState(filters?.search || '');
    const [showingMobileMenu, setShowingMobileMenu] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('home'), { search, category: filters?.category }, { preserveState: true, preserveScroll: true });
    };

    const handleCategoryFilter = (categoryName) => {
        const newCategory = filters?.category === categoryName ? null : categoryName;
        router.get(route('home'), { search: filters?.search, category: newCategory }, { preserveState: true, preserveScroll: true });
    };

    const handleLike = (submissionId) => {
        router.post(route('likes.toggle', submissionId), {}, { preserveScroll: true });
    };

    const handleTrack = (e) => {
        e.preventDefault();
        post(route('submissions.track_lookup'));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 selection:bg-orange-500 selection:text-white transition-colors duration-200">
            <Head title="SAPA - Sistem Aspirasi dan Pengaduan Akademik" />

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
                                <Link href={route('home')} className="text-orange-600 font-semibold border-b-2 border-orange-600 px-1 py-5">Beranda</Link>
                                <Link href={route('submissions.public_feed')} className="text-gray-500 hover:text-orange-600 px-1 py-5 font-medium transition">Semua Laporan</Link>
                                <Link href={route('about')} className="text-gray-500 hover:text-orange-600 px-1 py-5 font-medium transition">Tentang SAPA</Link>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center space-x-4">
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
                        
                        {/* Hamburger */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <ThemeToggle />
                            <button
                                onClick={() => setShowingMobileMenu(!showingMobileMenu)}
                                className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                {showingMobileMenu ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={(showingMobileMenu ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <Link href={route('home')} className="block pl-3 pr-4 py-2 border-l-4 border-orange-500 text-base font-medium text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 focus:outline-none focus:text-orange-800 focus:bg-orange-100 focus:border-orange-700 transition duration-150 ease-in-out">Beranda</Link>
                        <Link href={route('submissions.public_feed')} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">Semua Laporan</Link>
                        <Link href={route('about')} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">Tentang SAPA</Link>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-700">
                        <div className="mt-3 space-y-1">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">Dashboard</Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">Log in</Link>
                                    <Link href={route('register')} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white dark:from-gray-800 dark:to-gray-900 py-16">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-orange-500 opacity-5 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-red-500 opacity-5 blur-3xl"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-16">
                        <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                                Sistem <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Aspirasi</span> dan <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Pengaduan</span> Akademik
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
                                Sampaikan laporan, aduan, atau aspirasi Anda langsung kepada pihak berwenang kampus. Kami menjamin privasi dan kemudahan pelacakan laporan Anda.
                            </p>
                        </div>
                        <div className="flex-1 w-full max-w-lg mx-auto lg:max-w-none px-4 sm:px-8 lg:px-0">
                            <img src="/images/hero.png" alt="Ilustrasi mahasiswa dengan megafon" className="w-full h-auto drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500 ease-out object-cover rounded-3xl" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
                        {/* Buat Laporan Card */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1 transition duration-300">
                            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-6">
                                <FileText size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Sampaikan Laporan</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">Punya keluhan terkait fasilitas, pelayanan, atau hal lain? Buat laporan sekarang agar segera ditindaklanjuti.</p>
                            <Link href={route('dashboard')} className="flex items-center justify-center w-full px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:from-orange-600 hover:to-red-600 shadow-md transition group">
                                Buat Laporan
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
                            </Link>
                        </div>

                        {/* Lacak Laporan Card */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1 transition duration-300">
                            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6">
                                <Search size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Lacak Laporan</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Ketahui status terkini dari laporan yang telah Anda sampaikan melalui kode pelacakan.</p>
                            
                            <form onSubmit={handleTrack} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="SAPA-XXXXXX"
                                        value={data.tracking_code}
                                        onChange={e => setData('tracking_code', e.target.value)}
                                        className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-gray-900 dark:text-white uppercase"
                                        required
                                    />
                                    {errors.tracking_code && <div className="text-red-500 text-sm mt-1">{errors.tracking_code}</div>}
                                </div>
                                <button type="submit" disabled={processing} className="flex items-center justify-center w-full px-6 py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-gray-800 dark:hover:bg-gray-100 shadow-md transition group">
                                    Cari Laporan
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-800 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Statistik Laporan</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Transparansi data pengaduan dan aspirasi kampus</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-16">
                        <div>
                            <div className="text-4xl font-extrabold text-gray-900 dark:text-white">{stats.total_laporan}</div>
                            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-2">Total Laporan</div>
                        </div>
                        <div>
                            <div className="text-4xl font-extrabold text-orange-500">{stats.laporan_diproses}</div>
                            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-2">Sedang Diproses</div>
                        </div>
                        <div>
                            <div className="text-4xl font-extrabold text-green-500">{stats.laporan_selesai}</div>
                            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-2">Selesai</div>
                        </div>
                        <div>
                            <div className="text-4xl font-extrabold text-purple-500">{stats.total_aspirasi}</div>
                            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-2">Total Aspirasi</div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Status Chart */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">Distribusi Status Laporan</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                    <PieChart>
                                        <Pie
                                            data={stats.chart_status}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell fill="#f59e0b" /> {/* Menunggu - Yellow */}
                                            <Cell fill="#3b82f6" /> {/* Diproses - Blue */}
                                            <Cell fill="#10b981" /> {/* Selesai - Green */}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
                                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>Menunggu</div>
                                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>Diproses</div>
                                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>Selesai</div>
                            </div>
                        </div>

                        {/* Category Chart */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">Laporan Berdasarkan Kategori</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                    <BarChart data={stats.chart_category} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" opacity={0.2} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} width={100} />
                                        <Tooltip 
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                            {stats.chart_category.map((entry, index) => {
                                                const CATEGORY_CHART_COLORS = {
                                                    'Akademik': '#3b82f6',
                                                    'Fasilitas': '#22c55e',
                                                    'Pelayanan': '#6366f1',
                                                    'Keamanan': '#f43f5e',
                                                };
                                                return <Cell key={`cell-${index}`} fill={CATEGORY_CHART_COLORS[entry.name] || '#6b7280'} />;
                                            })}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Public Submissions */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Laporan Terbaru</h2>
                    <Link href={route('submissions.public_feed')} className="text-sm sm:text-base text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 flex items-center self-start sm:self-auto whitespace-nowrap">
                        Semua Feed Publik <ArrowRight size={16} className="ml-1 shrink-0" />
                    </Link>
                </div>

                {/* Search & Filter */}
                <div className="mb-8 space-y-4">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search size={20} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari laporan, nomor lacak, atau lokasi..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-24 sm:pr-32 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-gray-900 dark:text-white shadow-sm text-ellipsis"
                        />
                        <button type="submit" className="absolute inset-y-2 right-2 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition">
                            Cari
                        </button>
                    </form>

                    <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide space-x-2">
                        <button
                            onClick={() => handleCategoryFilter(null)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                                !filters?.category
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:text-orange-500'
                            }`}
                        >
                            Semua Kategori
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryFilter(cat.name)}
                                className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                                    filters?.category === cat.name
                                        ? 'bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:text-orange-500'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {submissions.data.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                            Belum ada laporan publik atau aspirasi.
                        </div>
                    ) : (
                        submissions.data.map((submission) => {
                            return (
                                <SubmissionCard 
                                    key={submission.id} 
                                    submission={submission} 
                                    auth={auth} 
                                    onLike={handleLike} 
                                />
                            );
                        })
                    )}
                </div>

                <div className="mt-8 flex justify-center">
                    <Pagination links={submissions.links} />
                </div>
            </main>

            <Footer />
        </div>
    );
}
