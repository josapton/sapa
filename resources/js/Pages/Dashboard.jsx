import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FileText, MessageCircle, AlertTriangle, Plus, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import Pagination from '@/Components/Pagination';

export default function Dashboard({ auth, submissions }) {
    const [showModal, setShowModal] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        type: 'laporan',
        visibility: 'private',
        attachment: null,
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">
                            {auth.user.role === 'mahasiswa' ? 'Riwayat Submisi Anda' : 'Daftar Submisi Masuk'}
                        </h3>
                        {auth.user.role === 'mahasiswa' && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition"
                            >
                                <Plus size={20} />
                                <span>Buat Baru</span>
                            </button>
                        )}
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        {submissions.data.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                Belum ada data submisi.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {submissions.data.map((submission) => (
                                    <Link key={submission.id} href={route('submissions.show', submission.id)} className="block hover:bg-gray-50 transition p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                        submission.type === 'laporan' ? 'bg-red-50 text-red-600' :
                                                        submission.type === 'aduan' ? 'bg-orange-50 text-orange-600' :
                                                        'bg-purple-50 text-purple-600'
                                                    }`}>
                                                        {submission.type.charAt(0).toUpperCase() + submission.type.slice(1)}
                                                    </span>
                                                    {submission.type !== 'aspirasi' && (
                                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                            submission.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                                            submission.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {submission.status.toUpperCase()}
                                                        </span>
                                                    )}
                                                    <span className="text-sm text-gray-500">
                                                        {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true, locale: localeId })}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-1">{submission.title}</h4>
                                                <p className="text-gray-600 line-clamp-2 text-sm">{submission.content}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
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
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Buat Submisi Baru</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Submisi</label>
                                    <select
                                        value={data.type}
                                        onChange={e => {
                                            setData('type', e.target.value);
                                            if (e.target.value === 'aspirasi') setData('visibility', 'public');
                                        }}
                                        className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                    >
                                        <option value="laporan">Laporan</option>
                                        <option value="aduan">Aduan</option>
                                        <option value="aspirasi">Aspirasi</option>
                                    </select>
                                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                                </div>

                                {data.type !== 'aspirasi' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Privasi</label>
                                        <select
                                            value={data.visibility}
                                            onChange={e => setData('visibility', e.target.value)}
                                            className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                        >
                                            <option value="private">Privat (Hanya Dosen/Admin)</option>
                                            <option value="public">Publik (Semua Orang)</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">Laporan publik dapat dilihat oleh semua pengguna di halaman utama.</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                        placeholder="Tuliskan judul singkat..."
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Isi</label>
                                    <textarea
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        rows="5"
                                        className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                        placeholder="Ceritakan secara detail..."
                                    ></textarea>
                                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lampiran (Opsional)</label>
                                    <input
                                        type="file"
                                        onChange={e => setData('attachment', e.target.files[0])}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                    {errors.attachment && <p className="text-red-500 text-xs mt-1">{errors.attachment}</p>}
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">
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
