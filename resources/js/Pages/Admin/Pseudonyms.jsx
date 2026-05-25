import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Trash2, Edit, Plus, X } from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';

export default function Pseudonyms({ auth, pseudonyms }) {
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        name: '',
        category: 'Flora'
    });

    const openCreate = () => {
        setEditingId(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEdit = (pseudonym) => {
        setEditingId(pseudonym.id);
        setData({
            name: pseudonym.name,
            category: pseudonym.category
        });
        clearErrors();
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            patch(route('admin.pseudonyms.update', editingId), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                }
            });
        } else {
            post(route('admin.pseudonyms.store'), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus nama samaran ini?')) {
            router.delete(route('admin.pseudonyms.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kamus Nama</h2>}
        >
            <Head title="Kamus Nama Samaran" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Manajemen Nama Samaran</h3>
                        <button
                            onClick={openCreate}
                            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition"
                        >
                            <Plus size={20} />
                            <span>Tambah Nama</span>
                        </button>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-y border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                                            <th className="px-6 py-4 font-medium">Nama Samaran</th>
                                            <th className="px-6 py-4 font-medium">Kategori</th>
                                            <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-gray-700">
                                        {pseudonyms.data.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500 italic">
                                                    Belum ada data nama samaran.
                                                </td>
                                            </tr>
                                        )}
                                        {pseudonyms.data.map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50/50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    {p.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        p.category.toLowerCase() === 'flora' ? 'bg-green-100 text-green-700' :
                                                        p.category.toLowerCase() === 'fauna' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {p.category.charAt(0).toUpperCase() + p.category.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button 
                                                        onClick={() => openEdit(p)}
                                                        className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition mr-2"
                                                        title="Edit Nama"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(p.id)}
                                                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                                                        title="Hapus Nama"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {pseudonyms.links && (
                                <div className="mt-6">
                                    <Pagination links={pseudonyms.links} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah/Edit */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Nama' : 'Tambah Nama Baru'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                        placeholder="Contoh: Harimau"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <select
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                                    >
                                        <option value="Flora">Flora</option>
                                        <option value="Fauna">Fauna</option>
                                        <option value="Benda">Benda</option>
                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
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
