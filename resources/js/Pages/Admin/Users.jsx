import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Shield, Trash2, Plus, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';

export default function Users({ auth, users }) {
    const [showModal, setShowModal] = useState(false);
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'dosen'
    });

    const handleRoleChange = (userId, newRole) => {
        router.patch(route('admin.users.role', userId), { role: newRole }, { preserveScroll: true });
    };

    const handleDelete = (userId) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini beserta semua datanya?')) {
            router.delete(route('admin.users.destroy', userId), { preserveScroll: true });
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    const openCreate = () => {
        reset();
        clearErrors();
        setShowModal(true);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen User</h2>}
        >
            <Head title="Manajemen User" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={openCreate}
                            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition"
                        >
                            <Plus size={20} />
                            <span>Tambah Admin/Dosen</span>
                        </button>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Daftar Pengguna Anonim</h3>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-y border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                                            <th className="px-6 py-4 font-medium">Nama Samaran</th>
                                            <th className="px-6 py-4 font-medium">Role</th>
                                            <th className="px-6 py-4 font-medium">Jumlah Laporan</th>
                                            <th className="px-6 py-4 font-medium">Bergabung</th>
                                            <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-gray-700">
                                        {users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50/50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                                            {user.pseudonym.charAt(0)}
                                                        </div>
                                                        <span className="font-semibold text-gray-900">{user.pseudonym}</span>
                                                        {auth.user.id === user.id && (
                                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full ml-2">Anda</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.role === 'mahasiswa' ? (
                                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">Mahasiswa</span>
                                                    ) : (
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                            disabled={auth.user.id === user.id}
                                                            className={`text-sm rounded-lg border-gray-200 focus:ring-orange-500 focus:border-orange-500 ${
                                                                auth.user.id === user.id ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer bg-white'
                                                            }`}
                                                        >
                                                            <option value="dosen">Dosen</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {user.submissions_count} Laporan, {user.comments_count} Komentar
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: localeId })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    {auth.user.id !== user.id && (
                                                        <button 
                                                            onClick={() => handleDelete(user.id)}
                                                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                                                            title="Hapus User"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {users.links && (
                                <div className="mt-6">
                                    <Pagination links={users.links} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Admin/Dosen */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Tambah Admin / Dosen</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Asli</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                        placeholder="Contoh: Budi Santoso"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                        placeholder="budi@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                        placeholder="Minimal 8 karakter"
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        value={data.role}
                                        onChange={e => setData('role', e.target.value)}
                                        className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                    >
                                        <option value="dosen">Dosen</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
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
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
