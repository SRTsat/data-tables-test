import React, { useEffect, useState, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt'; // WAJIB ADA buat select
import $ from 'jquery';
import 'datatables.net-responsive-dt';

import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net-select-dt/css/select.dataTables.min.css';

DataTable.use(DT);

export default function UserList({ users }: { users: any[] }) {
    const tableRef = useRef<any>(null); // Untuk akses instance datatable
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
    });

    const openModal = (user: any = null) => {
        if (user) {
            setEditMode(true);
            setCurrentId(user.id);
            setData({ name: user.name, email: user.email });
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
            put(`/users/${currentId}`, { onSuccess: () => setIsOpen(false) });
        } else {
            post('/users', { onSuccess: () => setIsOpen(false) });
        }
    };

    // Fungsi Bulk Delete
    const handleBulkDelete = () => {
        const dt = tableRef.current.dt();
        const selectedData = dt.rows({ selected: true }).data().toArray();
        const ids = selectedData.map((item: any) => item.id);

        if (ids.length === 0) return alert('Pilih data dulu, bro!');

        if (confirm(`Yakin mau hapus ${ids.length} data ini?`)) {
            router.post('/users/bulk-delete', { ids: ids }, {
                onSuccess: () => {
                    alert('Berhasil dihapus!');
                    dt.rows().deselect();
                }
            });
        }
    };

    const columns = [
        {
            data: null,
            defaultContent: '',
            orderable: false,
            className: 'select-checkbox', // Kolom Checkbox
            width: '5%'
        },
        { data: 'id', title: 'ID', width: '5%' },
        { data: 'name', title: 'Nama', width: '30%' },
        { data: 'email', title: 'Email', width: '30%' },
        {
            data: null,
            title: 'Aksi',
            width: '30%',
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
        const onDelete = function(this: any) {
            const id = $(this).data('id');
            if (confirm('Hapus user ini?')) router.delete(`/users/${id}`);
        };
        const onEdit = function(this: any) {
            const id = $(this).data('id');
            const user = users.find(u => u.id === id);
            if (user) openModal(user);
        };

        $(document).on('click', '.btn-delete', onDelete);
        $(document).on('click', '.btn-edit', onEdit);
        return () => {
            $(document).off('click', '.btn-delete', onDelete);
            $(document).off('click', '.btn-edit', onEdit);
        };
    }, [users]);

    return (
        <div style={{ padding: '40px', background: '#000', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
            <Head title="User Management" />
            
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
                /* Styling Checkbox Select */
                table.dataTable tbody td.select-checkbox:before {
                    border: 1px solid white !important;
                }
                table.dataTable tr.selected td.select-checkbox:after {
                    content: '✓' !important;
                    margin-top: -11px !important;
                    margin-left: -4px !important;
                    text-shadow: none !important;
                    color: #2563eb !important;
                }
                .dataTables_info, .dataTables_paginate { color: #888 !important; margin-top: 15px !important; }
            `}</style>

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <nav style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
                    <Link href="/users-list" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>Users</Link>
                    <Link href="/categories" style={{ color: '#94a3b8', textDecoration: 'none' }}>Categories</Link>
                </nav>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>User Management</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleBulkDelete} style={{ background: '#ef4444', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            Hapus Terpilih
                        </button>
                        <button onClick={() => openModal()} style={{ background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            + Tambah User
                        </button>
                    </div>
                </div>

                <div style={{ background: '#050505', padding: '25px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
                    <DataTable 
                        ref={tableRef}
                        data={users} 
                        columns={columns} 
                        className="display" 
                        options={{ 
                            responsive: true, 
                            autoWidth: false,
                            select: { style: 'multi', selector: 'td:first-child' } // AKTIFKAN SELECT
                        }} 
                    />
                </div>
            </div>

            {/* MODAL (Tetap Sama) */}
            {isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#111', padding: '30px', borderRadius: '12px', width: '450px', border: '1px solid #333' }}>
                        <h3 style={{ marginBottom: '20px' }}>{editMode ? 'Edit User' : 'Tambah User'}</h3>
                        <form onSubmit={submit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ color: '#aaa' }}>Nama</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: 'white', borderRadius: '6px' }} />
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ color: '#aaa' }}>Email</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: 'white', borderRadius: '6px' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="submit" style={{ flex: 1, background: '#2563eb', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Simpan</button>
                                <button type="button" onClick={() => setIsOpen(false)} style={{ flex: 1, background: '#222', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Batal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}