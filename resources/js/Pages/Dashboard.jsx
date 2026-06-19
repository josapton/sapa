import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FileText, MessageCircle, AlertTriangle, Plus, X, Search, Filter, ChartPie, CheckCircle, Clock, Flame } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import Pagination from '@/Components/Pagination';
import SubmissionCard from '@/Components/SubmissionCard';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Dashboard({ auth, submissions, categories, filters, chartCategory, chartStatus }) {
    const [showModal, setShowModal] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        type: 'laporan',
        visibility: 'private',
        incident_date: '',
        incident_location: '',
        attachments: [],
        terms: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('submissions.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {auth.user.role !== 'mahasiswa' && chartCategory && chartStatus && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">Distribusi Status Laporan</h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                        <PieChart>
                                            <Pie data={chartStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                <Cell fill="#f59e0b" />
                                                <Cell fill="#3b82f6" />
                                                <Cell fill="#10b981" />
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#1f2937', fontWeight: 'bold' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
                                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>Menunggu</div>
                                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>Diproses</div>
                                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>Selesai</div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">Laporan Berdasarkan Kategori</h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                        <BarChart data={chartCategory} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" opacity={0.2} />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} width={100} />
                                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                                {chartCategory.map((entry, index) => {
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
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {auth.user.role === 'mahasiswa' ? 'Riwayat Submisi Anda' : 'Daftar Submisi Masuk'}
                        </h3>
                        {auth.user.role === 'mahasiswa' && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition w-full sm:w-auto mt-4 sm:mt-0"
                            >
                                <Plus size={20} />
                                <span>Buat Baru</span>
                            </button>
                        )}
                        {auth.user.role === 'admin' && (
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                <a
                                    href={route('admin.submissions.export_excel')}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition w-full sm:w-auto"
                                >
                                    <FileText size={18} />
                                    <span>Export Excel</span>
                                </a>
                                <a
                                    href={route('admin.submissions.export_pdf')}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition w-full sm:w-auto"
                                >
                                    <FileText size={18} />
                                    <span>Export PDF</span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Search & Filter */}
                    <div className="mb-6 space-y-4">
                        <form onSubmit={(e) => { e.preventDefault(); router.get(route('dashboard'), { search: filters?.search, category: filters?.category }, { preserveState: true, preserveScroll: true }); }} className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search size={20} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari laporan, nomor lacak, atau judul..."
                                defaultValue={filters?.search || ''}
                                onChange={e => {
                                    if(filters) filters.search = e.target.value;
                                }}
                                onBlur={(e) => {
                                    router.get(route('dashboard'), { search: e.target.value, category: filters?.category }, { preserveState: true, preserveScroll: true });
                                }}
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-gray-900 dark:text-white shadow-sm"
                            />
                        </form>
                        
                        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide space-x-2">
                            <button
                                onClick={() => router.get(route('dashboard'), { search: filters?.search, category: null }, { preserveState: true, preserveScroll: true })}
                                className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                                    !filters?.category
                                        ? 'bg-orange-500 text-white border-orange-500'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:text-orange-500'
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => router.get(route('dashboard'), { search: filters?.search, category: cat.name }, { preserveState: true, preserveScroll: true })}
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
                            <div className="col-span-full p-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                Belum ada data submisi.
                            </div>
                        ) : (
                            submissions.data.map((submission) => (
                                <SubmissionCard 
                                    key={submission.id} 
                                    submission={submission} 
                                    auth={auth} 
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

            {/* Modal Create */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Buat Submisi Baru</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-6 overflow-y-auto">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jenis Submisi</label>
                                    <select
                                        value={data.type}
                                        onChange={e => {
                                            setData('type', e.target.value);
                                            if (e.target.value === 'aspirasi') setData('visibility', 'public');
                                        }}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                    >
                                        <option value="laporan">Laporan</option>
                                        <option value="aduan">Aduan</option>
                                        <option value="aspirasi">Aspirasi</option>
                                    </select>
                                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                                    <select
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                                </div>

                                {data.type !== 'aspirasi' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Privasi</label>
                                        <select
                                            value={data.visibility}
                                            onChange={e => setData('visibility', e.target.value)}
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                        >
                                            <option value="private">Privat (Hanya Dosen/Admin)</option>
                                            <option value="public">Publik (Semua Orang)</option>
                                        </select>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Laporan publik dapat dilihat oleh semua pengguna di halaman utama.</p>
                                    </div>
                                )}

                                {data.type !== 'aspirasi' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Kejadian (Opsional)</label>
                                            <input
                                                type="date"
                                                value={data.incident_date}
                                                onChange={e => setData('incident_date', e.target.value)}
                                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                            />
                                            {errors.incident_date && <p className="text-red-500 text-xs mt-1">{errors.incident_date}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lokasi Kejadian (Opsional)</label>
                                            <input
                                                type="text"
                                                value={data.incident_location}
                                                onChange={e => setData('incident_location', e.target.value)}
                                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                                placeholder="Contoh: Gedung A, Ruang 204"
                                            />
                                            {errors.incident_location && <p className="text-red-500 text-xs mt-1">{errors.incident_location}</p>}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                        placeholder="Tuliskan judul singkat..."
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Isi</label>
                                    <div className="relative">
                                        <textarea
                                            value={data.content}
                                            onChange={e => setData('content', e.target.value)}
                                            rows="5"
                                            maxLength="2000"
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm pb-6"
                                            placeholder="Ceritakan secara detail..."
                                        ></textarea>
                                        <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                                            {data.content.length} / 2000 karakter
                                        </div>
                                    </div>
                                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lampiran (Opsional, Maks 10MB/file)</label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={e => setData('attachments', Array.from(e.target.files))}
                                        className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 dark:file:bg-orange-900/30 file:text-orange-700 dark:file:text-orange-400 hover:file:bg-orange-100 dark:hover:file:bg-orange-900/50"
                                    />
                                    {errors.attachments && <p className="text-red-500 text-xs mt-1">{errors.attachments}</p>}
                                    {/* Handle validation errors for individual files like attachments.0, attachments.1 */}
                                    {Object.keys(errors).filter(key => key.startsWith('attachments.')).map(key => (
                                        <p key={key} className="text-red-500 text-xs mt-1">{errors[key]}</p>
                                    ))}
                                </div>
                                
                                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-900/30">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="terms"
                                                type="checkbox"
                                                checked={data.terms}
                                                onChange={(e) => setData('terms', e.target.checked)}
                                                className="w-4 h-4 text-orange-600 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-orange-500 focus:ring-2"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="terms" className="font-medium text-gray-900 dark:text-gray-200">
                                                Syarat dan Ketentuan
                                            </label>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                Saya menjamin bahwa laporan/aduan/aspirasi ini disusun dengan itikad baik, berdasarkan fakta, menggunakan bahasa yang sopan, tidak mengandung unsur SARA atau pencemaran nama baik, serta bersedia mempertanggungjawabkan isinya sesuai dengan peraturan akademik yang berlaku.
                                            </p>
                                        </div>
                                    </div>
                                    {errors.terms && <p className="text-red-500 text-xs mt-2 ml-7">{errors.terms}</p>}
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition">
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow-md shadow-orange-500/30 transition disabled:opacity-50"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
