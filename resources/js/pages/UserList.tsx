import React, { useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import $ from 'jquery';
import 'datatables.net-responsive-dt';
// Import CSS dasar DataTable
import 'datatables.net-dt/css/dataTables.dataTables.min.css';


DataTable.use(DT);

export default function UserList({ users }: { users: any[] }) {
    
    const columns = [
        { data: 'id', title: 'ID', width: '5%' },
        { data: 'name', title: 'Nama', width: '30%' },
        { data: 'email', title: 'Email', width: '35%' },
        {
            data: null,
            title: 'Aksi',
            width: '30%',
            orderable: false,
            render: (data: any) => `
                <div style="display: flex; gap: 8px;">
                    <button class="btn-edit" data-id="${data.id}" 
                        style="background: #eab308; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                        Edit
                    </button>
                    <button class="btn-delete" data-id="${data.id}" 
                        style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                        Hapus
                    </button>
                </div>
            `
        }
    ];

    useEffect(() => {
        const onDelete = function(this: any) {
            const id = $(this).data('id');
            if (confirm('Yakin mau hapus user ini?')) {
                router.delete(`/users/${id}`);
            }
        };

        const onEdit = function(this: any) {
            const id = $(this).data('id');
            router.get(`/users/${id}/edit`);
        };

        $(document).on('click', '.btn-delete', onDelete);
        $(document).on('click', '.btn-edit', onEdit);

        return () => {
            $(document).off('click', '.btn-delete', onDelete);
            $(document).off('click', '.btn-edit', onEdit);
        };
    }, []);

    return (
        <div style={{ padding: '40px', background: '#000', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
            <Head title="User Management" />
            
            {/* CSS Global untuk DataTable Dark Mode */}
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
                .dataTables_paginate .paginate_button.current { background: #333 !important; border: none !important; color: white !important; }
            `}</style>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <nav style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
                    <Link href="/users-list" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold', borderBottom: '2px solid #60a5fa' }}>Users</Link>
                    <Link href="/categories" style={{ color: '#94a3b8', textDecoration: 'none' }}>Categories</Link>
                </nav>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>User Management</h2>
                    <Link 
                        href="/users/create" 
                        style={{ background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                        + Tambah User
                    </Link>
                </div>

                <div style={{ background: '#050505', padding: '25px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
                    <DataTable 
                        data={users} 
                        columns={columns} 
                        className="display"
                        options={{
                            responsive: true,
                            autoWidth: false,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}