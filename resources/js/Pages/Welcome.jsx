import { Head, Link, usePage, router } from '@inertiajs/react';
import { Flame, MessageCircle, FileText, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import Pagination from '@/Components/Pagination';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth, submissions, stats }) {
    const handleLike = (submissionId) => {
        router.post(route('likes.toggle', submissionId), {}, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-orange-500 selection:text-white">
            <Head title="SAPA - Layanan Pengaduan Mahasiswa" />

            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <ApplicationLogo className="h-8 w-auto mr-2" />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                                SAPA
                            </span>
                            <span className="ml-2 text-sm font-medium text-gray-500 hidden sm:block">
                                Layanan Pengaduan Mahasiswa
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 font-medium hover:bg-orange-100 transition"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-600 hover:text-orange-600 font-medium transition"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 shadow-md shadow-orange-500/30 transition"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
                        Suarakan <span className="text-orange-500">Aspirasimu</span>, <br />
                        Kawal <span className="text-red-500">Perubahan</span>.
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        SAPA adalah platform anonim bagi mahasiswa untuk menyampaikan laporan, aduan, dan aspirasi kepada pihak kampus dengan aman, transparan, dan terukur.
                    </p>
                    <div className="mt-8 flex justify-center space-x-4">
                        <Link href={route('dashboard')} className="px-8 py-3 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/40 transition">
                            Buat Laporan / Aspirasi
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
                            <FileText size={24} />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.total_laporan}</div>
                        <div className="text-sm text-gray-500 font-medium mt-1">Total Laporan & Aduan</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full mb-3">
                            <Clock size={24} />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.laporan_diproses}</div>
                        <div className="text-sm text-gray-500 font-medium mt-1">Sedang Diproses</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                        <div className="p-3 bg-green-50 text-green-600 rounded-full mb-3">
                            <CheckCircle size={24} />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.laporan_selesai}</div>
                        <div className="text-sm text-gray-500 font-medium mt-1">Selesai Ditangani</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-full mb-3">
                            <MessageCircle size={24} />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.total_aspirasi}</div>
                        <div className="text-sm text-gray-500 font-medium mt-1">Total Aspirasi</div>
                    </div>
                </div>

                {/* Public Submissions Feed */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Suara Publik</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {submissions.data.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                                Belum ada laporan publik atau aspirasi.
                            </div>
                        ) : (
                            submissions.data.map((submission) => {
                                const hasLiked = submission.likes.some(like => 
                                    (auth.user && like.user_id === auth.user.id) || 
                                    (!auth.user && like.ip_address === usePage().props.client_ip)
                                );

                                return (
                                    <div key={submission.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col">
                                        <div className="p-6 flex-grow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-sm">
                                                        {submission.user.pseudonym.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{submission.user.pseudonym}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true, locale: id })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                    submission.type === 'laporan' ? 'bg-red-50 text-red-600' :
                                                    submission.type === 'aduan' ? 'bg-orange-50 text-orange-600' :
                                                    'bg-purple-50 text-purple-600'
                                                }`}>
                                                    {submission.type.charAt(0).toUpperCase() + submission.type.slice(1)}
                                                </span>
                                            </div>
                                            
                                            <Link href={route('submissions.show', submission.id)} className="block group">
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition line-clamp-2 mb-2">
                                                    {submission.title}
                                                </h3>
                                                <p className="text-gray-600 line-clamp-3 text-sm">
                                                    {submission.content}
                                                </p>
                                                
                                                {submission.attachments && submission.attachments.length > 0 && submission.attachments[0].mime_type.startsWith('image/') && (
                                                    <div className="mt-4 rounded-xl overflow-hidden h-40 border border-gray-100">
                                                        <img 
                                                            src={`/storage/${submission.attachments[0].file_path}`} 
                                                            alt="Attachment Preview" 
                                                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                                        />
                                                    </div>
                                                )}
                                            </Link>
                                        </div>
                                        
                                        <div className={`px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center ${submission.type !== 'aspirasi' ? 'justify-between' : 'justify-end'}`}>
                                            {submission.type !== 'aspirasi' && (
                                                <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                                                    submission.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                                    submission.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {submission.status.toUpperCase()}
                                                </span>
                                            )}

                                            <button 
                                                onClick={() => handleLike(submission.id)}
                                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all ${
                                                    hasLiked ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-500 hover:bg-orange-50 hover:text-orange-500'
                                                }`}
                                            >
                                                <Flame size={18} className={hasLiked ? 'fill-orange-500 text-orange-500' : ''} />
                                                <span className="font-semibold">{submission.likes_count}</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    
                    {submissions.links && (
                        <div className="mt-8">
                            <Pagination links={submissions.links} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
