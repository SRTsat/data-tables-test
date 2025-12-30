import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function UserCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <div className="min-h-screen bg-black p-8 text-white">
            <Head title="Tambah User Baru" />
            
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Tambah User Baru</h2>
                    <Link 
                        href="/users-list" 
                        className="text-gray-400 hover:text-white transition"
                    >
                        ← Kembali ke Tabel
                    </Link>
                </div>

                <form onSubmit={submit} className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800">
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
                        <input 
                            type="text" 
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className={`w-full p-3 rounded bg-black border ${errors.name ? 'border-red-500' : 'border-gray-700'} focus:border-blue-500 outline-none transition`}
                            placeholder="Contoh: John Doe"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name}</p>}
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium mb-2">Alamat Email</label>
                        <input 
                            type="email" 
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className={`w-full p-3 rounded bg-black border ${errors.email ? 'border-red-500' : 'border-gray-700'} focus:border-blue-500 outline-none transition`}
                            placeholder="john@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 disabled:opacity-50"
                    >
                        {processing ? 'Sedang Menyimpan...' : 'Simpan User'}
                    </button>
                </form>
            </div>
        </div>
    );
}