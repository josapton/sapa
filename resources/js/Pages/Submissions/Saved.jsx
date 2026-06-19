import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Bookmark } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import SubmissionCard from '@/Components/SubmissionCard';

export default function Saved({ submissions }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Laporan Tersimpan</h2>}
        >
            <Head title="Laporan Tersimpan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {submissions.data.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                            <Bookmark className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Belum ada laporan yang disimpan</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Anda dapat menyimpan laporan yang menarik perhatian Anda dengan menekan ikon penanda (bookmark) pada laporan tersebut.
                            </p>
                            <div className="mt-6">
                                <Link 
                                    href={route('submissions.public_feed')}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-orange-600 border border-transparent rounded-lg font-medium text-white hover:bg-orange-700 transition"
                                >
                                    Jelajahi Laporan
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {submissions.data.map((submission) => (
                                <SubmissionCard 
                                    key={submission.id} 
                                    submission={submission} 
                                    auth={auth} 
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-8">
                        <Pagination links={submissions.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
