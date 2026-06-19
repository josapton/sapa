import { Head, Link } from '@inertiajs/react';
import { FileText, CheckCircle, Clock, ArrowLeft, Download, File } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';

const CATEGORY_COLORS = {
    'Akademik': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Fasilitas': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Pelayanan': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'Keamanan': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'Lainnya': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    'Umum': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function TrackResult({ submission, can_print = false }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Head title={`Lacak: ${submission.tracking_code} - SAPA`} />

            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <ApplicationLogo className="h-8 w-auto mr-2" />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                                SAPA
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <Link href={route('home')} className="text-gray-500 hover:text-orange-600 font-medium">Beranda</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <Link href={route('home')} className="flex items-center text-gray-500 hover:text-orange-600 transition">
                        <ArrowLeft size={20} className="mr-2" />
                        Kembali ke Beranda
                    </Link>
                    
                    {can_print && (
                        <a 
                            href={route('submissions.print_pdf', submission.id)} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm border border-gray-200 dark:border-gray-700 transition"
                        >
                            <File size={18} />
                            <span>Cetak PDF</span>
                        </a>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-800 p-8 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{submission.title}</h1>
                                <div className="text-sm font-mono bg-white dark:bg-gray-700 px-3 py-1 rounded inline-block text-orange-600 dark:text-orange-400 font-bold border border-orange-200 dark:border-orange-900/50">
                                    {submission.tracking_code}
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 text-sm font-bold rounded-full border ${
                                submission.status === 'resolved' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
                                submission.status === 'processing' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' :
                                'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                            }`}>
                                {submission.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mt-4">
                            <div className="flex items-center">
                                <Clock size={16} className="mr-1.5" />
                                {format(new Date(submission.created_at), 'd MMMM yyyy HH:mm', { locale: id })}
                            </div>
                            <div className={`flex items-center px-2.5 py-1 text-xs font-semibold rounded-md ${
                                CATEGORY_COLORS[submission?.category?.name] || CATEGORY_COLORS['Umum']
                            }`}>
                                <FileText size={14} className="mr-1.5" />
                                {submission.category ? submission.category.name : 'Umum'}
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Timeline */}
                        <div className="mb-10">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Status Pelacakan</h3>
                            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 md:ml-4 space-y-8">
                                
                                <div className="relative pl-8">
                                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-orange-500 border-4 border-white dark:border-gray-800"></div>
                                    <div className="font-bold text-gray-900 dark:text-white">Laporan Diterima</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{format(new Date(submission.created_at), 'd MMM yyyy HH:mm', { locale: id })}</div>
                                </div>

                                <div className="relative pl-8">
                                    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 ${submission.status === 'processing' || submission.status === 'resolved' ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                    <div className={`font-bold ${submission.status === 'processing' || submission.status === 'resolved' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Laporan Diproses</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sedang ditindaklanjuti oleh unit terkait.</div>
                                </div>

                                <div className="relative pl-8">
                                    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 ${submission.status === 'resolved' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                    <div className={`font-bold ${submission.status === 'resolved' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Laporan Selesai</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tindak lanjut telah selesai dilakukan.</div>
                                </div>

                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Isi Laporan</h3>
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                {submission.content}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
