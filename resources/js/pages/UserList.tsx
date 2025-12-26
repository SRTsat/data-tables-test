import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import $ from 'jquery';

// --- IMPORT CORE ---
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-select-dt/css/select.dataTables.css';

// --- IMPORT PLUGINS ---
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';

import jszip from 'jszip';
// @ts-ignore
window.JSZip = jszip;
DataTable.use(DT);

// Definisikan tipe data props dari Laravel
interface UserProps {
    users: any[];
}

export default function UserList({ users }: UserProps) {
    
    // Handle Hapus Massal (Bulk Delete)
    const handleDeleteSelected = (dt: any) => {
        const selectedData = dt.rows({ selected: true }).data().toArray();
        const ids = selectedData.map((item: any) => item.id);

        if (ids.length === 0) return alert('Pilih data dulu, bro!');

if (confirm(`Yakin mau hapus ${ids.length} data ini?`)) {
    router.post('/users/bulk-delete', { ids: ids }, {
        onSuccess: () => alert('Berhasil!'),
    });
}
    };

    // Handle Klik Tombol Hapus per Baris (Event Delegation)
    useEffect(() => {
        $(document).on('click', '.btn-delete-row', function (e: JQuery.ClickEvent) {
            e.preventDefault();
            
            // Fix TypeScript 'this' issue
            const target = $(e.currentTarget);
            const id = target.data('id');
            const name = target.data('name');

            if (confirm(`Yakin mau hapus user ${name}?`)) {
                router.delete(`/users/${id}`, {
                    onSuccess: () => alert('User berhasil dihapus!'),
                });
            }
        });

        return () => {
            $(document).off('click', '.btn-delete-row');
        };
    }, []);

    const columns = [
        {
            data: null,
            defaultContent: '',
            orderable: false,
            className: 'select-checkbox',
            title: ''
        },
        { data: 'id', title: 'ID' },
        { data: 'name', title: 'Nama' },
        { data: 'email', title: 'Email' },
        {
            data: null,
            title: 'Aksi',
            orderable: false,
            render: (data: any) => {
                return `<button class="btn-delete-row" data-id="${data.id}" data-name="${data.name}" 
                        style="background: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        Hapus
                        </button>`;
            }
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Head title="User Management" />
            
            <style>{`
                .btn-delete-selected {
                    background-color: #d9534f !important;
                    color: white !important;
                    border-color: #d43f3a !important;
                    margin-bottom: 10px;
                }
                .btn-delete-selected:hover {
                    background-color: #c9302c !important;
                }
                table.dataTable tbody td.select-checkbox:before {
                    border: 1px solid #666 !important;
                }
                /* Biar teks info tabel di bawah kelihatan di bg-black */
                .dataTables_info, .dataTables_paginate {
                    color: white !important;
                }
            `}</style>

            <h2 className="mb-4 text-xl font-bold text-white">Data User Real-time</h2>
            
            <div className="bg-black p-4 shadow rounded text-white">
                <DataTable 
                    data={users} // Sekarang ambil dari props Laravel
                    columns={columns}
                    options={{
                        select: {
                            style: 'multi',
                            selector: 'td:first-child'
                        },
                        dom: 'lBfrtip',
                        buttons: [
                            {
                                text: '🗑️ Hapus Terpilih',
                                className: 'btn-delete-selected',
                                action: function (e: any, dt: any) {
                                    handleDeleteSelected(dt);
                                }
                            },
                            'copy', 'excel', 'pdf'
                        ],
                        pageLength: 10,
                        lengthMenu: [
                            [10, 15, 20, -1], 
                            [10, 15, 20, "Semua"] 
                        ],
                    }}
                    className="display w-full"
                />
            </div>
        </div>
    );
}