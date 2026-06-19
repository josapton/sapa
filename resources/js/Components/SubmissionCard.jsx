import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Flame, MessageCircle, Bookmark, Paperclip } from 'lucide-react';
import ShareDropdown from './ShareDropdown';

const CATEGORY_COLORS = {
    'Akademik': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Fasilitas': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Pelayanan': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'Keamanan': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'Lainnya': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    'Umum': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function SubmissionCard({ submission, auth, onLike, onSave, isLink = true, showActions = true }) {
    const { props } = usePage();
    
    // Check if liked
    const hasLiked = submission.likes?.some(like => 
        (auth?.user && like.user_id === auth.user.id) || 
        (!auth?.user && like.ip_address === props.client_ip)
    );

    // Get Avatar Initials
    const avatarInitial = submission.user?.pseudonym ? submission.user.pseudonym.charAt(0).toUpperCase() : 'U';
    const pseudonym = submission.user?.pseudonym || 'Anonim';
    
    // Check if saved
    const hasSaved = submission.saved_by_users?.length > 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
            <div className="p-6 flex-grow">
                {/* Header: Avatar, Name, Time, Status */}
                <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                            {avatarInitial}
                        </div>
                        <div className="min-w-0">
                            <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{pseudonym}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {submission.created_at && formatDistanceToNow(new Date(submission.created_at), { addSuffix: true, locale: localeId })}
                            </div>
                        </div>
                    </div>
                    {submission.status && submission.type !== 'aspirasi' && (
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${
                            submission.status === 'resolved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                            submission.status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                            {submission.status.toUpperCase()}
                        </span>
                    )}
                </div>

                {/* Content Link wrapper */}
                <div className="mb-4">
                    {isLink ? (
                        <Link href={route('submissions.show', submission.id)} className="block">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition line-clamp-2 mb-2">
                                {submission.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm">
                                {submission.content}
                            </p>
                        </Link>
                    ) : (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
                                {submission.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm">
                                {submission.content}
                            </p>
                        </div>
                    )}
                </div>

                {/* Tags / Badges */}
                <div className="flex flex-wrap gap-2 mb-4 items-center">
                    <span className={`px-2 py-1 text-xs rounded-md font-medium ${
                        CATEGORY_COLORS[submission.category?.name] || CATEGORY_COLORS['Umum']
                    }`}>
                        {submission.category ? submission.category.name : 'Umum'}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-md border ${
                        submission.type === 'laporan' ? 'border-red-200 text-red-600 dark:border-red-900/50 dark:text-red-400' :
                        submission.type === 'aduan' ? 'border-orange-200 text-orange-600 dark:border-orange-900/50 dark:text-orange-400' :
                        'border-purple-200 text-purple-600 dark:border-purple-900/50 dark:text-purple-400'
                    }`}>
                        {submission.type ? submission.type.charAt(0).toUpperCase() + submission.type.slice(1) : ''}
                    </span>
                    {submission.tracking_code && (
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center ml-auto">
                            <span className="mr-1 hidden sm:inline">Kode:</span> 
                            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                {submission.tracking_code}
                            </span>
                        </div>
                    )}
                </div>

                {/* Attachments Preview (if any) */}
                {isLink && submission.attachments && submission.attachments.length > 0 && (
                    <Link href={route('submissions.show', submission.id)} className="block">
                        {submission.attachments[0].mime_type.startsWith('image/') ? (
                            <div className="mt-2 rounded-xl overflow-hidden h-48 border border-gray-100 dark:border-gray-700">
                                <img 
                                    src={`/storage/${submission.attachments[0].file_path}`} 
                                    alt="Lampiran" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        ) : (
                            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 mt-2">
                                <Paperclip size={16} />
                                <span>{submission.attachments.length} Lampiran</span>
                            </div>
                        )}
                    </Link>
                )}
            </div>

            {/* Actions Footer */}
            {showActions && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2 items-center justify-end rounded-b-2xl mt-auto">
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            if (onLike) {
                                onLike(submission.id);
                            } else {
                                router.post(route('submissions.like', submission.id), {}, { preserveScroll: true });
                            }
                        }}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all border ${
                            hasLiked ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 border-transparent' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-500 border-gray-200 dark:border-gray-600'
                        }`}
                    >
                        <Flame size={16} className={hasLiked ? 'fill-orange-500 text-orange-500' : ''} />
                        <span className="font-semibold text-sm">{submission.likes_count || 0}</span>
                    </button>

                    <Link 
                        href={route('submissions.show', submission.id)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all border bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
                    >
                        <MessageCircle size={16} />
                        <span className="font-semibold text-sm">{submission.public_comments_count || 0}</span>
                    </Link>

                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            if (!auth?.user) {
                                window.location.href = route('login');
                                return;
                            }
                            if (onSave) {
                                onSave(submission.id);
                            } else {
                                router.post(route('saved_submissions.toggle', submission.id), {}, { preserveScroll: true });
                            }
                        }}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all border ${
                            hasSaved
                                ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                        <Bookmark size={16} className={hasSaved ? 'fill-blue-500 text-blue-500' : ''} />
                        <span className="hidden sm:inline font-medium text-sm">{hasSaved ? 'Tersimpan' : 'Simpan'}</span>
                    </button>

                    <ShareDropdown 
                        url={window.location.origin + route('submissions.show', submission.id, false)} 
                        title={submission.title} 
                    />
                </div>
            )}
        </div>
    );
}
