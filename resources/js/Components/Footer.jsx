import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 lg:py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex justify-center md:justify-start">
                        <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 tracking-tight">
                            SAPA Universitas Boyolali
                        </span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
                        <Link href={route('about')} className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">Tentang</Link>
                        <Link href={route('terms')} className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">Syarat & Ketentuan</Link>
                        <Link href={route('privacy')} className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">Privasi</Link>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center w-full">
                        &copy; {new Date().getFullYear()} SAPA Universitas Boyolali. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
