import React from 'react';

export const getUserColumns = () => [
    { 
        data: null, 
        defaultContent: '', 
        orderable: false, 
        className: 'select-checkbox', 
        width: '5%' 
    },
    { data: 'id', title: 'ID', width: '5%' },
    { data: 'name', title: 'Nama', width: '25%' },
    { data: 'email', title: 'Email', width: '25%' },
    { 
        data: 'category.name', 
        title: 'Kategori', 
        width: '15%',
        defaultContent: '<span style="color:#666">No Category</span>'
    },
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