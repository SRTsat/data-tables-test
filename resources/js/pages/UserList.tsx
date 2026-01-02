import React, { useEffect, useState, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import $ from 'jquery';
import Select from 'react-select';
import UserFormModal from '../components/UserFormModal';
import DataTableBase from '../components/DataTableBase';
import MainLayout from '../components/MainLayout';
import ActionButton from '../components/ActionButton';

// CSS Imports
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net-select-dt/css/select.dataTables.min.css';

DataTable.use(DT);

export default function UserList({ users, categories }: { users: any[], categories: any[] }) {
    const tableRef = useRef<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        category_id: '',
    });

    const categoryOptions = categories.map(cat => ({
        value: cat.name,
        label: cat.name
    }));

    // Filter Logic
    const handleMultiFilter = (selectedOptions: any) => {
        const dt = tableRef.current.dt();
        if (!selectedOptions || selectedOptions.length === 0) {
            dt.column(4).search('').draw();
        } else {
            const searchValues = selectedOptions.map((opt: any) => opt.value).join('|');
            dt.column(4).search(searchValues ? `^(${searchValues})$` : '', true, false).draw();
        }
    };

    const openModal = (user: any = null) => {
        if (user) {
            setEditMode(true);
            setCurrentId(user.id);
            setData({ 
                name: user.name, 
                email: user.email,
                category_id: user.category_id || '' 
            });
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
            post('/users', { onSuccess: () => { setIsOpen(false); reset(); } });
        }
    };
    
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
        { data: null, defaultContent: '', orderable: false, className: 'select-checkbox', width: '5%' },
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
    <MainLayout title="User Management">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>User Management</h2>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <ActionButton variant="danger" onClick={handleBulkDelete}>
                    Hapus Terpilih
                </ActionButton>

                <div style={{ width: '250px' }}>
                    <Select 
                        isMulti 
                        options={categoryOptions} 
                        onChange={handleMultiFilter} 
                        placeholder="Filter Kategori..."
                    />
                </div>

                <ActionButton variant="primary" onClick={() => openModal()}>
                    + Tambah User
                </ActionButton>
            </div>
        </div>

        <div style={{ background: '#050505', padding: '25px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
            <DataTableBase 
                ref={tableRef} 
                data={users} 
                columns={columns} 
                options={{ select: { style: 'multi', selector: 'td:first-child' } }} 
            />
        </div>

        <UserFormModal 
            isOpen={isOpen} 
            editMode={editMode} 
            data={data} 
            setData={setData} 
            errors={errors} 
            processing={processing} 
            onSubmit={submit} 
            onClose={() => setIsOpen(false)} 
            categories={categories} 
        />
    </MainLayout>
);
}