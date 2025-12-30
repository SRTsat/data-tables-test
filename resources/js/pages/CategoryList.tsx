import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import $ from 'jquery';

// Import CSS bawaan supaya struktur tabelnya terbentuk dulu
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

DataTable.use(DT);

export default function CategoryList({ categories }: { categories: any[] }) {
    const { data, setData, post, reset } = useForm({ name: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.name) return alert('Nama kategori jangan kosong, bro!');
        post('/categories', { onSuccess: () => reset() });
    };

    const columns = [
        { data: 'id', title: 'ID', width: '10%' },
        { data: 'name', title: 'Nama Kategori', width: '70%' },
        {
            data: null,
            title: 'Aksi',
            width: '20%',
            orderable: false,
            render: (row: any) => `
                <button class="btn-delete" data-id="${row.id}" 
                    style="background:#ff4d4d; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:bold;">
                    Hapus
                </button>
            `
        }
    ];

    React.useEffect(() => {
        const handleDelete = function(this: any) {
            const id = $(this).data('id');
            if(confirm('Yakin mau hapus kategori ini?')) {
                router.delete(`/categories/${id}`);
            }
        };

        $(document).on('click', '.btn-delete', handleDelete);
        return () => { $(document).off('click', '.btn-delete', handleDelete); };
    }, []);

    return (
        <div style={{ padding: '40px', background: '#000', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
            <Head title="Categories" />
            
            {/* Custom CSS untuk maksa tabel jadi Putih & Sejajar */}
            <style>{`
                .dataTables_wrapper { color: white !important; }
                .dataTables_wrapper .dataTables_length select, 
                .dataTables_wrapper .dataTables_filter input { 
                    color: white !important; background: #222 !important; border: 1px solid #444 !important; padding: 5px !important; border-radius: 4px;
                }
                table.dataTable { width: 100% !important; margin: 20px 0 !important; border-collapse: collapse !important; }
                table.dataTable thead th { 
                    color: white !important; border-bottom: 2px solid #333 !important; text-align: left !important; padding: 12px !important;
                }
                table.dataTable tbody td { 
                    color: #ccc !important; border-bottom: 1px solid #222 !important; padding: 12px !important; 
                }
                .dataTables_info, .dataTables_paginate { color: white !important; margin-top: 15px !important; }
                .dataTables_paginate .paginate_button { color: white !important; }
            `}</style>

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>Category Management</h2>

                {/* Form Tambah */}
                <form onSubmit={submit} style={{ marginBottom: '30px', display: 'flex', gap: '10px', background: '#111', padding: '20px', borderRadius: '8px' }}>
                    <input 
                        type="text" value={data.name} 
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Ketik nama kategori..."
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#000', color: 'white' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Tambah Kategori
                    </button>
                </form>

                {/* Container Tabel */}
                <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
                    <DataTable 
                        data={categories} 
                        columns={columns} 
                        className="display"
                        options={{
                            autoWidth: false,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}