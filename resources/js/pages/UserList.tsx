import React, { useState, useRef } from 'react';
import { router, useForm } from '@inertiajs/react';
import Select from 'react-select';
import UserFormModal from '../components/UserFormModal';
import DataTableBase from '../components/DataTableBase';
import MainLayout from '../components/MainLayout';
import ActionButton from '../components/ActionButton';

// Variabel global instan buat filter (biar gak kena delay state React)
let currentFilter = ''; 

export default function UserList({ categories }: { categories: any[] }) {
    const tableRef = useRef<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '', email: '', category_id: '',
    });

    const categoryOptions = categories.map(cat => ({ value: cat.name, label: cat.name }));

    // --- HANDLERS ---
    const handleMultiFilter = (selectedOptions: any) => {
        currentFilter = selectedOptions ? selectedOptions.map((opt: any) => opt.value).join(',') : '';
        tableRef.current.dt().ajax.reload();
    };

    const onEdit = (user: any) => {
        clearErrors();
        setEditMode(true);
        setCurrentId(user.id);
        setData({ name: user.name, email: user.email, category_id: user.category_id || '' });
        setIsOpen(true);
    };

    const onDelete = (id: number) => {
        if (confirm('Yakin mau hapus user ini?')) {
            router.delete(`/users/${id}`, { onSuccess: () => tableRef.current.dt().ajax.reload(null, false) });
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = { onSuccess: () => { setIsOpen(false); tableRef.current.dt().ajax.reload(null, false); } };
        editMode ? put(`/users/${currentId}`, options) : post('/users', options);
    };

    const columns = [
        { data: 'id', title: 'ID', width: '5%' },
        { data: 'name', title: 'Nama' },
        { data: 'email', title: 'Email' },
        { data: 'category.name', title: 'Kategori', defaultContent: '-' },
        {
            data: null,
            title: 'Aksi',
            orderable: false,
            render: (row: any) => `
                <div style="display: flex; gap: 8px;">
                    <button class="btn-edit" style="background:#eab308; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Edit</button>
                    <button class="btn-delete" data-id="${row.id}" style="background:#ef4444; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Hapus</button>
                </div>
            `
        }
    ];

    return (
        <MainLayout title="User Management">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>User Management</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '250px' }}>
                        <Select isMulti options={categoryOptions} onChange={handleMultiFilter} placeholder="Filter..." />
                    </div>
                    <ActionButton variant="primary" onClick={() => { reset(); setEditMode(false); setIsOpen(true); }}>
                        + Tambah User
                    </ActionButton>
                </div>
            </div>

            <DataTableBase 
                ref={tableRef} 
                columns={columns} 
                options={{ 
                    onEdit: onEdit, 
                    onDelete: onDelete,
                    ajax: {
                        url: "/users/json",
                        data: (d: any) => { d.categories = currentFilter; }
                    }
                }} 
            />

            {isOpen && <UserFormModal key={currentId || 'new'} isOpen={isOpen} editMode={editMode} data={data} setData={setData} errors={errors} processing={processing} onSubmit={submit} onClose={() => setIsOpen(false)} categories={categories} />}
        </MainLayout>
    );
}