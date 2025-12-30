import React, { useEffect, useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import $ from 'jquery';
import 'datatables.net-responsive-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

DataTable.use(DT);

export default function CategoryList({ categories }: { categories: any[] }) {
    // State Modal
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    // Form Inertia
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
    });

    // Toggle Modal
    const openModal = (category: any = null) => {
        if (category) {
            setEditMode(true);
            setCurrentId(category.id);
            setData({ name: category.name });
        } else {
            setEditMode(false);
            reset();
        }
        clearErrors();
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMode) {
            put(`/categories/${currentId}`, { onSuccess: () => setIsOpen(false) });
        } else {
            post('/categories', { onSuccess: () => { setIsOpen(false); reset(); } });
        }
    };

    const columns = [
        { data: 'id', title: 'ID', width: '15%' },
        { data: 'name', title: 'Nama Kategori', width: '60%' },
        {
            data: null,
            title: 'Aksi',
            width: '25%',
            orderable: false,
            render: (row: any) => `
                <div style="display: flex; gap: 8px;">
                    <button class="btn-edit" data-id="${row.id}" style="background:#eab308; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:bold;">Edit</button>
                    <button class="btn-delete" data-id="${row.id}" style="background:#ef4444; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:bold;">Hapus</button>
                </div>
            `
        }
    ];

    useEffect(() => {
        const handleDelete = function(this: any) {
            const id = $(this).data('id');
            if(confirm('Yakin mau hapus kategori ini?')) {
                router.delete(`/categories/${id}`);
            }
        };

        const onEdit = function(this: any) {
            const id = $(this).data('id');
            const category = categories.find(c => c.id === id);
            if (category) openModal(category);
        };

        $(document).on('click', '.btn-delete', handleDelete);
        $(document).on('click', '.btn-edit', onEdit);

        return () => { 
            $(document).off('click', '.btn-delete', handleDelete);
            $(document).off('click', '.btn-edit', onEdit);
        };
    }, [categories]);

    return (
        <div style={{ padding: '40px', background: '#000', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
            <Head title="Categories" />
            
            <style>{`
                .dataTables_wrapper { color: white !important; }
                .dataTables_wrapper .dataTables_length select, 
                .dataTables_wrapper .dataTables_filter input { 
                    color: white !important; background: #111 !important; border: 1px solid #333 !important; padding: 6px !important; border-radius: 4px; outline: none;
                }
                table.dataTable { width: 100% !important; margin: 20px 0 !important; border-collapse: collapse !important; background: transparent !important; }
                table.dataTable thead th { 
                    color: white !important; border-bottom: 2px solid #333 !important; text-align: left !important; padding: 15px 12px !important; background: #0a0a0a !important;
                }
                table.dataTable tbody td { 
                    color: #ccc !important; border-bottom: 1px solid #1a1a1a !important; padding: 12px !important; background: transparent !important;
                }
                .dataTables_info, .dataTables_paginate { color: #888 !important; margin-top: 15px !important; }
                .dataTables_paginate .paginate_button { color: white !important; }
            `}</style>

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <nav style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
                    <Link href="/users-list" style={{ color: '#94a3b8', textDecoration: 'none' }}>Users</Link>
                    <Link href="/categories" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>Categories</Link>
                </nav>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Category Management</h2>
                    <button onClick={() => openModal()} style={{ background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        + Tambah Kategori
                    </button>
                </div>

                <div style={{ background: '#050505', padding: '25px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
                    <DataTable data={categories} columns={columns} className="display" options={{ responsive: true, autoWidth: false }} />
                </div>
            </div>

            {/* MODAL UNTUK TAMBAH & EDIT */}
            {isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#111', padding: '30px', borderRadius: '12px', width: '450px', border: '1px solid #333', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>{editMode ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>
                        <form onSubmit={submit}>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '14px' }}>Nama Kategori</label>
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: 'white', borderRadius: '6px', outline: 'none' }}
                                    placeholder="Contoh: Elektronik"
                                />
                                {errors.name && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>{errors.name}</div>}
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="submit" disabled={processing} style={{ flex: 1, background: '#2563eb', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {processing ? 'Proses...' : 'Simpan Kategori'}
                                </button>
                                <button type="button" onClick={() => setIsOpen(false)} style={{ flex: 1, background: '#222', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}