import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Flame, Send, File, Image as ImageIcon, ArrowLeft, MessageCircle, Trash2, Edit, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useState } from 'react';

export default function SubmissionDetail({ auth, submission }) {
    const { props } = usePage();
    const isPublic = submission?.visibility === 'public';
    const isOwner = auth?.user && auth.user.id === submission?.user_id;
    const isStaff = auth?.user && auth.user.role !== 'mahasiswa';
    const canViewComments = (isOwner || isStaff) && submission?.type !== 'aspirasi';
    const canDelete = isOwner || (auth?.user?.role === 'admin');

    const { data, setData, post, processing, reset } = useForm({
        content: '',
        attachment: null,
    });

    const [showEditModal, setShowEditModal] = useState(false);
    const { data: editData, setData: setEditData, post: postEdit, processing: editProcessing, errors: editErrors } = useForm({
        title: submission?.title || '',
        content: submission?.content || '',
        type: submission?.type || 'laporan',
        visibility: submission?.visibility || 'private',
        attachment: null,
    });

    const handleEditSubmit = (e) => {
        e.preventDefault();
        postEdit(route('submissions.update', submission?.id), {
            onSuccess: () => setShowEditModal(false),
            preserveScroll: true
        });
    };

    const handleComment = (e) => {
        e.preventDefault();
        post(route('comments.store', submission?.id), {
            onSuccess: () => reset(),
            preserveScroll: true
        });
    };

    const handleStatusChange = (e) => {
        router.patch(route('submissions.status', submission?.id), { status: e.target.value }, { preserveScroll: true });
    };

    const hasLiked = submission?.likes?.some(like => 
        (auth?.user && like.user_id === auth.user.id) || 
        (!auth?.user && like.ip_address === props.client_ip)
    );

    const handleLike = () => {
        post(route('likes.toggle', submission?.id), {}, { preserveScroll: true });
    };

    const renderAttachment = (attachment) => {
        const isImage = attachment.mime_type?.startsWith('image/');
        const url = `/storage/${attachment.file_path}`;
        
        if (isImage) {
            return (
                <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 max-w-md">
                    <img src={url} alt="Attachment" className="w-full h-auto object-cover" />
                </div>
            );
        }
        
        return (
            <a href={url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                <File size={20} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{attachment.file_name}</span>
            </a>
        );
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus submisi ini?')) {
            router.delete(route('submissions.destroy', submission.id));
        }
    };

    if (!submission) return null;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Head title={submission?.title || 'Detail Submisi'} />

            {/* Navbar */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <Link href={auth?.user ? route('dashboard') : route('home')} className="inline-flex items-center space-x-2 text-gray-500 hover:text-orange-600 transition">
                        <ArrowLeft size={20} />
                        <span>Kembali</span>
                    </Link>

                    <div className="flex space-x-2">
                        {isOwner && (
                            <button 
                                onClick={() => setShowEditModal(true)}
                                className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition"
                            >
                                <Edit size={18} />
                                <span>Edit</span>
                            </button>
                        )}
                        {canDelete && (
                            <button 
                                onClick={handleDelete}
                                className="inline-flex items-center space-x-2 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition"
                            >
                                <Trash2 size={18} />
                                <span>Hapus</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                    {submission?.user?.pseudonym ? submission.user.pseudonym.charAt(0) : 'U'}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-lg">{submission?.user?.pseudonym || 'Anonim'}</div>
                                    <div className="text-sm text-gray-500">
                                        {submission?.created_at && formatDistanceToNow(new Date(submission.created_at), { addSuffix: true, locale: localeId })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                    submission?.type === 'laporan' ? 'bg-red-50 text-red-600' :
                                    submission?.type === 'aduan' ? 'bg-orange-50 text-orange-600' :
                                    'bg-purple-50 text-purple-600'
                                }`}>
                                    {submission?.type ? submission.type.charAt(0).toUpperCase() + submission.type.slice(1) : ''}
                                </span>
                                {submission?.type !== 'aspirasi' && (
                                    isStaff ? (
                                        <select 
                                            value={submission?.status} 
                                            onChange={handleStatusChange}
                                            className={`px-3 py-1 pr-8 text-sm font-semibold rounded-full border-0 focus:ring-2 focus:ring-orange-500 cursor-pointer ${
                                                submission?.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                                submission?.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            <option value="pending">PENDING</option>
                                            <option value="processing">PROCESSING</option>
                                            <option value="resolved">RESOLVED</option>
                                        </select>
                                    ) : (
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                            submission?.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                            submission?.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {submission?.status?.toUpperCase()}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">{submission?.title}</h1>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-6">{submission?.content}</p>

                        {submission?.attachments?.map(attachment => (
                            <div key={attachment.id}>{renderAttachment(attachment)}</div>
                        ))}
                    </div>

                    <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center">
                        <button 
                            onClick={handleLike}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all shadow-sm border ${
                                hasLiked ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Flame size={20} className={hasLiked ? 'fill-orange-500 text-orange-500' : ''} />
                            <span className="font-bold">{submission?.likes_count || 0}</span>
                            <span className="font-medium ml-1">Dukungan</span>
                        </button>
                    </div>
                </div>

                {/* Conversation Section */}
                {canViewComments && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                <MessageCircle className="mr-2 text-orange-500" />
                                Percakapan Tertutup
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Hanya Anda dan pihak kampus yang dapat melihat percakapan ini.</p>
                        </div>
                        
                        <div className="p-8 bg-gray-50/30 space-y-6 max-h-[500px] overflow-y-auto">
                            {!submission?.comments || submission.comments.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    Belum ada tanggapan.
                                </div>
                            ) : (
                                submission.comments.map(comment => {
                                    const isMe = auth?.user && comment.user_id === auth.user.id;
                                    const isStaffComment = comment?.user?.role !== 'mahasiswa';
                                    
                                    return (
                                        <div key={comment.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-2xl p-4 ${
                                                isMe ? 'bg-orange-500 text-white rounded-tr-sm' : 
                                                isStaffComment ? 'bg-gray-800 text-white rounded-tl-sm' :
                                                'bg-white border border-gray-200 text-gray-900 rounded-tl-sm'
                                            }`}>
                                                <div className={`text-xs mb-1 font-semibold ${isMe ? 'text-orange-100' : isStaffComment ? 'text-gray-300' : 'text-gray-500'}`}>
                                                    {comment?.user?.pseudonym} • {comment?.created_at && formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: localeId })}
                                                </div>
                                                <p className="whitespace-pre-wrap">{comment.content}</p>
                                                {comment?.attachments?.map(att => (
                                                    <div key={att.id} className="mt-2">
                                                        <a href={`/storage/${att.file_path}`} target="_blank" rel="noreferrer" className="text-xs underline flex items-center space-x-1">
                                                            <File size={14} /> <span>{att.file_name}</span>
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Comment Form */}
                        <div className="p-6 bg-white border-t border-gray-100">
                            <form onSubmit={handleComment} className="flex space-x-4">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        placeholder="Ketik tanggapan..."
                                        rows="1"
                                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-orange-500 rounded-xl resize-none"
                                    ></textarea>
                                    <label className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 cursor-pointer p-2">
                                        <input type="file" className="hidden" onChange={e => setData('attachment', e.target.files[0])} />
                                        <ImageIcon size={20} />
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing || !data.content.trim()}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                            {data.attachment && <div className="text-xs text-orange-600 mt-2 flex items-center"><File size={14} className="mr-1" /> {data.attachment.name}</div>}
                        </div>
                    </div>
                )}
            </div>
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-900">Edit Submisi</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <select
                                        value={editData.type}
                                        onChange={e => {
                                            setEditData('type', e.target.value);
                                            if (e.target.value === 'aspirasi') setEditData('visibility', 'public');
                                        }}
                                        className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                    >
                                        <option value="laporan">Laporan</option>
                                        <option value="aduan">Aduan</option>
                                        <option value="aspirasi">Aspirasi</option>
                                    </select>
                                    {editErrors.type && <p className="text-red-500 text-xs mt-1">{editErrors.type}</p>}
                                </div>

                                {editData.type !== 'aspirasi' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Privasi</label>
                                        <select
                                            value={editData.visibility}
                                            onChange={e => setEditData('visibility', e.target.value)}
                                            className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                        >
                                            <option value="private">Privat (Hanya Dosen/Admin)</option>
                                            <option value="public">Publik (Semua Orang)</option>
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                                    <input
                                        type="text"
                                        value={editData.title}
                                        onChange={e => setEditData('title', e.target.value)}
                                        className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                        placeholder="Tuliskan judul secara singkat"
                                    />
                                    {editErrors.title && <p className="text-red-500 text-xs mt-1">{editErrors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Isi</label>
                                    <textarea
                                        value={editData.content}
                                        onChange={e => setEditData('content', e.target.value)}
                                        rows="5"
                                        className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                        placeholder="Ceritakan secara detail..."
                                    ></textarea>
                                    {editErrors.content && <p className="text-red-500 text-xs mt-1">{editErrors.content}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lampiran Tambahan (Opsional)</label>
                                    <input
                                        type="file"
                                        onChange={e => setEditData('attachment', e.target.files[0])}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Mengunggah file baru akan menambahkannya ke lampiran saat ini.</p>
                                    {editErrors.attachment && <p className="text-red-500 text-xs mt-1">{editErrors.attachment}</p>}
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={editProcessing}
                                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow-md shadow-orange-500/30 transition disabled:opacity-50"
                                >
                                    {editProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
