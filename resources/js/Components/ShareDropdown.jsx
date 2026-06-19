import { Share2, Link as LinkIcon, Hash, Globe, MessageCircle } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';

export default function ShareDropdown({ url, title }) {
    const shareUrl = url || window.location.href;
    const shareTitle = title || 'Lihat laporan ini di SAPA';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        alert('Tautan disalin ke clipboard!');
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    url: shareUrl
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            handleCopyLink();
        }
    };

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button 
                    className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-xl transition-all border bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
                    title="Bagikan"
                >
                    <Share2 size={16} />
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content align="right" width="48">
                <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                >
                    <MessageCircle size={16} className="text-green-500" /> WhatsApp
                </a>
                <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                >
                    <Hash size={16} /> Twitter / X
                </a>
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                >
                    <Globe size={16} className="text-blue-600" /> Facebook
                </a>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                
                <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-3 w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                >
                    <LinkIcon size={16} /> Salin Link
                </button>
                
                <button
                    onClick={handleNativeShare}
                    className="flex items-center gap-3 w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                >
                    <Share2 size={16} /> Bagikan...
                </button>
            </Dropdown.Content>
        </Dropdown>
    );
}
