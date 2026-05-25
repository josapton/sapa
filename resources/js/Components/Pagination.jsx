import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center mt-8 space-x-1">
            {links.map((link, key) => (
                link.url === null ? (
                    <div
                        key={key}
                        className="px-4 py-2 text-sm text-gray-400 border border-transparent rounded-lg"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 text-sm border rounded-lg hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition ${
                            link.active ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:text-white' : 'bg-white text-gray-700 border-gray-200'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
}
