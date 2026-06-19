import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Flame, Send, File, Image as ImageIcon, ArrowLeft, MessageCircle, Trash2, Edit, X, Bookmark, Share2, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import ShareDropdown from '@/Components/ShareDropdown';

const CATEGORY_COLORS = {
    'Akademik': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Fasilitas': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Pelayanan': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'Keamanan': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'Lainnya': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    'Umum': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const InternalComment = ({ comment, auth, onReply }) => {
    const isMe = auth?.user && comment.user_id === auth.user.id;
    const isStaffComment = comment?.user?.role !== 'mahasiswa';

    return (
        <div className="space-y-4">
            <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                    isMe ? 'bg-orange-500 text-white rounded-tr-sm' : 
                    isStaffComment ? 'bg-gray-800 dark:bg-gray-700 text-white rounded-tl-sm' :
                    'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-sm'
                }`}>
                    <div className={`flex justify-between items-center text-xs mb-1 font-semibold ${isMe ? 'text-orange-100' : isStaffComment ? 'text-gray-300' : 'text-gray-500'}`}>
                        <span>{comment?.user?.pseudonym} • {comment?.created_at && formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: localeId })}</span>
                        {!isMe && (
                            <button onClick={() => onReply(comment)} className="ml-4 hover:underline flex items-center gap-1 opacity-80 hover:opacity-100 transition">
                                <Send size={10} /> Balas
                            </button>
                        )}
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
            
            {comment.replies && comment.replies.length > 0 && (
                <div className="pl-6 sm:pl-12 space-y-4 border-l-2 border-gray-100 dark:border-gray-700 mt-2">
                    {comment.replies.map(reply => (
                        <InternalComment key={reply.id} comment={reply} auth={auth} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    );
};

const PublicComment = ({ comment, submission, onReply }) => {
    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                        <span>{comment.is_anonymous ? 'Anonim' : (comment.author_name || 'Guest')}</span>
                        {comment.user_id && comment.user_id === submission.user_id && (
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Pelapor</span>
                        )}
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {comment.created_at && formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: localeId })}
                        </span>
                        <button onClick={() => onReply(comment)} className="text-xs text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-1">
                            Balas
                        </button>
                    </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">{comment.content}</p>
            </div>
            
            {comment.replies && comment.replies.length > 0 && (
                <div className="pl-6 sm:pl-12 space-y-4 border-l-2 border-gray-100 dark:border-gray-700 mt-2">
                    {comment.replies.map(reply => (
                        <PublicComment key={reply.id} comment={reply} submission={submission} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function SubmissionDetail({ auth, submission, categories = [], can_print = false, staffUsers = [] }) {
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
    const [replyTo, setReplyTo] = useState(null);
    const [publicReplyTo, setPublicReplyTo] = useState(null);

    const { data: editData, setData: setEditData, post: postEdit, processing: editProcessing, errors: editErrors } = useForm({
        title: submission?.title || '',
        content: submission?.content || '',
        type: submission?.type || 'laporan',
        category_id: submission?.category_id || '',
        visibility: submission?.visibility || 'private',
        incident_date: submission?.incident_date || '',
        incident_location: submission?.incident_location || '',
        attachments: [],
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
        const payload = replyTo ? { ...data, parent_id: replyTo.id } : data;
        router.post(route('comments.store', submission?.id), payload, {
            onSuccess: () => {
                reset();
                setReplyTo(null);
            },
            preserveScroll: true
        });
    };

    const { data: publicData, setData: setPublicData, post: postPublic, processing: publicProcessing, reset: resetPublic } = useForm({
        content: '',
        is_anonymous: false,
        author_name: '',
    });

    const handlePublicComment = (e) => {
        e.preventDefault();
        const payload = publicReplyTo ? { ...publicData, parent_id: publicReplyTo.id } : publicData;
        router.post(route('public_comments.store', submission?.id), payload, {
            onSuccess: () => {
                resetPublic();
                setPublicReplyTo(null);
            },
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
        router.post(route('likes.toggle', submission?.id), {}, { preserveScroll: true });
    };

    const handleVisibilityToggle = () => {
        if (confirm(`Anda yakin ingin mengubah visibilitas laporan ini menjadi ${submission?.visibility === 'public' ? 'Private' : 'Public'}?`)) {
            router.patch(route('submissions.visibility', submission?.id), {}, { preserveScroll: true });
        }
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Head title={submission?.title || 'Detail Submisi'} />

            {/* Navbar */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <Link href={auth?.user ? route('dashboard') : route('home')} className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition">
                        <ArrowLeft size={20} />
                        <span>Kembali</span>
                    </Link>
                    <div className="flex flex-wrap w-full sm:w-auto gap-2">
                        {isOwner && (
                            <button 
                                onClick={() => setShowEditModal(true)}
                                className="flex-1 sm:flex-none justify-center inline-flex items-center space-x-2 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-4 py-2 rounded-lg font-medium transition"
                            >
                                <Edit size={18} />
                                <span>Edit</span>
                            </button>
                        )}
                        {canDelete && (
                            <button 
                                onClick={handleDelete}
                                className="flex-1 sm:flex-none justify-center inline-flex items-center space-x-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-4 py-2 rounded-lg font-medium transition"
                            >
                                <Trash2 size={18} />
                                <span>Hapus</span>
                            </button>
                        )}
                        {can_print && (
                            <a 
                                href={route('submissions.print_pdf', submission.id)} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex-1 sm:flex-none justify-center inline-flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition"
                            >
                                <File size={18} />
                                <span>Cetak PDF</span>
                            </a>
                        )}
                        {auth?.user && (auth.user.role === 'admin' || auth.user.role === 'dosen') && (
                            <button 
                                onClick={handleVisibilityToggle}
                                className={`flex-1 sm:flex-none justify-center inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
                                    submission?.visibility === 'public' 
                                    ? 'text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40' 
                                    : 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40'
                                }`}
                            >
                                {submission?.visibility === 'public' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                                <span>{submission?.visibility === 'public' ? 'Sembunyikan (Privat)' : 'Tampilkan (Publik)'}</span>
                            </button>
                        )}
                        {isOwner && submission?.status !== 'resolved' && (
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (confirm('Apakah Anda yakin masalah ini telah terselesaikan? Laporan akan ditandai sebagai Selesai.')) {
                                        router.post(route('submissions.resolve', submission.id), {}, { preserveScroll: true });
                                    }
                                }}
                                className="flex-1 sm:flex-none justify-center inline-flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-4 py-2 rounded-lg font-medium transition"
                            >
                                <CheckCircle size={18} />
                                <span>Tandai Selesai</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
                    <div className="p-4 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                    {submission?.user?.pseudonym ? submission.user.pseudonym.charAt(0) : 'U'}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">{submission?.user?.pseudonym || 'Anonim'}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {submission?.created_at && formatDistanceToNow(new Date(submission.created_at), { addSuffix: true, locale: localeId })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center justify-end">
                                {submission?.type !== 'aspirasi' && (
                                    isStaff ? (
                                        <select 
                                            value={submission?.status} 
                                            onChange={handleStatusChange}
                                            className={`px-2.5 py-1 pr-8 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-orange-500 cursor-pointer shrink-0 ${
                                                submission?.status === 'resolved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                                submission?.status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                                'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            <option value="pending">PENDING</option>
                                            <option value="processing">PROCESSING</option>
                                            <option value="resolved">RESOLVED</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${
                                            submission?.status === 'resolved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                            submission?.status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                            'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}>
                                            {submission?.status?.toUpperCase()}
                                        </span>
                                    )
                                )}
                                {isStaff && submission?.type !== 'aspirasi' && auth?.user?.role === 'admin' && (
                                    <select 
                                        value={submission?.assigned_to || ''} 
                                        onChange={(e) => {
                                            router.post(route('submissions.assign', submission.id), { assigned_to: e.target.value }, { preserveScroll: true });
                                        }}
                                        className="px-3 py-1 pr-8 text-sm font-semibold rounded-full border-0 bg-blue-100 text-blue-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    >
                                        <option value="">Belum Ditugaskan</option>
                                        {props.staffUsers?.map(user => (
                                            <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                                        ))}
                                    </select>
                                )}
                                {!isStaff && submission?.assignedTo && (
                                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-700">
                                        Ditugaskan ke: {submission.assignedTo.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4 items-center">
                            <span className={`px-2 py-1 text-xs rounded-md font-medium ${
                                CATEGORY_COLORS[submission?.category?.name] || CATEGORY_COLORS['Umum']
                            }`}>
                                {submission?.category ? submission.category.name : 'Umum'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-md border ${
                                submission?.type === 'laporan' ? 'border-red-200 text-red-600 dark:border-red-900/50 dark:text-red-400' :
                                submission?.type === 'aduan' ? 'border-orange-200 text-orange-600 dark:border-orange-900/50 dark:text-orange-400' :
                                'border-purple-200 text-purple-600 dark:border-purple-900/50 dark:text-purple-400'
                            }`}>
                                {submission?.type ? submission.type.charAt(0).toUpperCase() + submission.type.slice(1) : ''}
                            </span>
                            {submission?.tracking_code && (
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center ml-auto">
                                    <span className="mr-1 hidden sm:inline">Kode:</span> 
                                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                        {submission.tracking_code}
                                    </span>
                                </div>
                            )}
                        </div>

                        {(submission?.incident_date || submission?.incident_location) && (
                            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                {submission?.incident_date && !isNaN(new Date(submission.incident_date).getTime()) && (
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold">Tanggal Kejadian:</span>
                                        <span>{new Date(submission.incident_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                )}
                                {submission?.incident_location && (
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold">Lokasi Kejadian:</span>
                                        <span>{submission.incident_location}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">{submission?.title}</h1>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed mb-6">{submission?.content}</p>

                        {submission?.attachments?.map(attachment => (
                            <div key={attachment.id}>{renderAttachment(attachment)}</div>
                        ))}
                    </div>

                    <div className="px-4 sm:px-8 py-4 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2 sm:gap-4 items-center rounded-b-3xl">
                        <button 
                            onClick={handleLike}
                            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl transition-all border ${
                                hasLiked ? 'bg-orange-50 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Flame size={20} className={hasLiked ? 'fill-orange-500 text-orange-500' : ''} />
                            <span className="font-bold text-sm sm:text-base">{submission?.likes_count || 0}</span>
                        </button>
                        
                        {isPublic && (
                            <button 
                                onClick={() => document.getElementById('public-comments-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all"
                            >
                                <MessageCircle size={20} />
                                <span className="font-bold text-sm sm:text-base">{submission?.public_comments?.length || 0}</span>
                            </button>
                        )}

                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                if (!auth.user) {
                                    window.location.href = route('login');
                                    return;
                                }
                                router.post(route('saved_submissions.toggle', submission.id), {}, { preserveScroll: true });
                            }}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all border ${
                                submission.saved_by_users?.length > 0
                                    ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Bookmark size={20} className={submission.saved_by_users?.length > 0 ? 'fill-blue-500 text-blue-500' : ''} />
                            <span className="font-medium text-sm sm:text-base">Simpan</span>
                        </button>

                        <ShareDropdown 
                            url={window.location.href} 
                            title={submission?.title} 
                        />
                    </div>
                </div>

                {/* Conversation Section */}
                {canViewComments && (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                <MessageCircle className="mr-2 text-orange-500" />
                                Percakapan Tertutup
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hanya Anda dan pihak kampus yang dapat melihat percakapan ini.</p>
                        </div>
                        
                        <div className="p-8 bg-gray-50/30 dark:bg-gray-900/30 space-y-6 max-h-[500px] overflow-y-auto">
                            {!submission?.comments || submission.comments.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    Belum ada tanggapan.
                                </div>
                            ) : (
                                submission.comments.map(comment => (
                                    <InternalComment key={comment.id} comment={comment} auth={auth} onReply={(c) => setReplyTo(c)} />
                                ))
                            )}
                        </div>

                        {/* Comment Form */}
                        <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                            {replyTo && (
                                <div className="mb-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg flex justify-between items-center text-sm border border-orange-100 dark:border-orange-800">
                                    <span>Membalas komentar dari <strong>{replyTo.user?.pseudonym}</strong></span>
                                    <button onClick={() => setReplyTo(null)} className="text-orange-500 hover:text-orange-700 p-1"><X size={16} /></button>
                                </div>
                            )}
                            <form onSubmit={handleComment} className="flex space-x-4">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        placeholder="Ketik tanggapan..."
                                        rows="1"
                                        className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-orange-500 focus:ring-orange-500 rounded-xl resize-none"
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

                {/* Public Comments Section */}
                {isPublic && (
                    <div id="public-comments-section" className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-8">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                Komentar Publik ({submission?.public_comments?.length || 0})
                            </h3>
                        </div>
                        
                        <div className="p-8 bg-gray-50/30 dark:bg-gray-900/30 space-y-6">
                            {/* Public Comment Form */}
                            <div id="public-comments-form" className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <form onSubmit={handlePublicComment} className="space-y-4">
                                    {publicReplyTo && (
                                        <div className="mb-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg flex justify-between items-center text-sm border border-blue-100 dark:border-blue-800">
                                            <span>Membalas komentar dari <strong>{publicReplyTo.is_anonymous ? 'Anonim' : (publicReplyTo.author_name || 'Guest')}</strong></span>
                                            <button onClick={() => setPublicReplyTo(null)} className="text-blue-500 hover:text-blue-700 p-1"><X size={16} /></button>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <input
                                            type="checkbox"
                                            id="is_anonymous"
                                            checked={publicData.is_anonymous}
                                            onChange={e => {
                                                setPublicData('is_anonymous', e.target.checked);
                                                if (e.target.checked) setPublicData('author_name', '');
                                            }}
                                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <label htmlFor="is_anonymous">Kirim sebagai anonim</label>
                                    </div>
                                    
                                    {!publicData.is_anonymous && (
                                        <div>
                                            <input
                                                type="text"
                                                value={publicData.author_name}
                                                onChange={e => setPublicData('author_name', e.target.value)}
                                                placeholder="Nama Anda (opsional)"
                                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:ring-orange-500 dark:text-white"
                                            />
                                        </div>
                                    )}
                                    
                                    <div>
                                        <textarea
                                            value={publicData.content}
                                            onChange={e => setPublicData('content', e.target.value)}
                                            placeholder="Tulis komentar Anda..."
                                            rows="3"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:ring-orange-500 dark:text-white resize-none"
                                        ></textarea>
                                    </div>
                                    
                                    <div className="flex justify-start">
                                        <button
                                            type="submit"
                                            disabled={publicProcessing || !publicData.content.trim()}
                                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {publicProcessing ? 'Mengirim...' : 'Kirim Komentar'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Public Comments List */}
                            <div className="space-y-4">
                                {!submission?.public_comments || submission.public_comments.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                        Belum ada komentar publik. Jadilah yang pertama!
                                    </div>
                                ) : (
                                    submission.public_comments.map(comment => (
                                        <PublicComment key={comment.id} comment={comment} submission={submission} onReply={(c) => {
                                            setPublicReplyTo(c);
                                            document.getElementById('public-comments-form')?.scrollIntoView({ behavior: 'smooth' });
                                        }} />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit Submisi</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                                    <select
                                        value={editData.type}
                                        onChange={e => {
                                            setEditData('type', e.target.value);
                                            if (e.target.value === 'aspirasi') setEditData('visibility', 'public');
                                        }}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                    >
                                        <option value="laporan">Laporan</option>
                                        <option value="aduan">Aduan</option>
                                        <option value="aspirasi">Aspirasi</option>
                                    </select>
                                    {editErrors.type && <p className="text-red-500 text-xs mt-1">{editErrors.type}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                                    <select
                                        value={editData.category_id}
                                        onChange={e => setEditData('category_id', e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {editErrors.category_id && <p className="text-red-500 text-xs mt-1">{editErrors.category_id}</p>}
                                </div>

                                {editData.type !== 'aspirasi' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Privasi</label>
                                            <select
                                                value={editData.visibility}
                                                onChange={e => setEditData('visibility', e.target.value)}
                                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                            >
                                                <option value="private">Privat (Hanya Dosen/Admin)</option>
                                                <option value="public">Publik (Semua Orang)</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                                
                                {editData.type !== 'aspirasi' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Kejadian (Opsional)</label>
                                            <input
                                                type="date"
                                                value={editData.incident_date}
                                                onChange={e => setEditData('incident_date', e.target.value)}
                                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                            />
                                            {editErrors.incident_date && <p className="text-red-500 text-xs mt-1">{editErrors.incident_date}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lokasi Kejadian (Opsional)</label>
                                            <input
                                                type="text"
                                                value={editData.incident_location}
                                                onChange={e => setEditData('incident_location', e.target.value)}
                                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                                placeholder="Contoh: Gedung A, Ruang 204"
                                            />
                                            {editErrors.incident_location && <p className="text-red-500 text-xs mt-1">{editErrors.incident_location}</p>}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul</label>
                                    <input
                                        type="text"
                                        value={editData.title}
                                        onChange={e => setEditData('title', e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                        placeholder="Tuliskan judul secara singkat"
                                    />
                                    {editErrors.title && <p className="text-red-500 text-xs mt-1">{editErrors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Isi</label>
                                    <div className="relative">
                                        <textarea
                                            value={editData.content}
                                            onChange={e => setEditData('content', e.target.value)}
                                            rows="5"
                                            maxLength="2000"
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm pb-6"
                                            placeholder="Ceritakan secara detail..."
                                        ></textarea>
                                        <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                                            {editData.content.length} / 2000 karakter
                                        </div>
                                    </div>
                                    {editErrors.content && <p className="text-red-500 text-xs mt-1">{editErrors.content}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lampiran Tambahan (Opsional, Maks 10MB/file)</label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={e => setEditData('attachments', Array.from(e.target.files))}
                                        className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 dark:file:bg-orange-900/30 file:text-orange-700 dark:file:text-orange-400 hover:file:bg-orange-100 dark:hover:file:bg-orange-900/50"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Mengunggah file baru akan menambahkannya ke lampiran saat ini.</p>
                                    {editErrors.attachments && <p className="text-red-500 text-xs mt-1">{editErrors.attachments}</p>}
                                    {Object.keys(editErrors).filter(key => key.startsWith('attachments.')).map(key => (
                                        <p key={key} className="text-red-500 text-xs mt-1">{editErrors[key]}</p>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition">
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
