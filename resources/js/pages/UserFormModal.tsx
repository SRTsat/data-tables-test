import React from 'react';

interface UserFormModalProps {
    isOpen: boolean;
    editMode: boolean;
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    categories: any[];
}

export default function UserFormModal({ 
    isOpen, editMode, data, setData, errors, processing, onSubmit, onClose, categories 
}: UserFormModalProps) {
    
    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div style={{ background: '#111', padding: '30px', borderRadius: '12px', width: '450px', border: '1px solid #333' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>{editMode ? 'Edit User' : 'Tambah User Baru'}</h3>
                
                <form onSubmit={onSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '14px' }}>Nama Lengkap</label>
                        <input 
                            type="text" value={data.name} 
                            onChange={e => setData('name', e.target.value)} 
                            style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: 'white', borderRadius: '6px', outline: 'none' }} 
                        />
                        {errors.name && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>{errors.name}</div>}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '14px' }}>Email</label>
                        <input 
                            type="email" value={data.email} 
                            onChange={e => setData('email', e.target.value)} 
                            style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: 'white', borderRadius: '6px', outline: 'none' }} 
                        />
                        {errors.email && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>{errors.email}</div>}
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '14px' }}>Pilih Kategori</label>
                        <select 
                            value={data.category_id} 
                            onChange={e => setData('category_id', e.target.value)}
                            style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: 'white', borderRadius: '6px', outline: 'none' }}
                        >
                            <option value="">-- Pilih Kategori --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" disabled={processing} style={{ flex: 1, background: '#2563eb', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {processing ? 'Proses...' : 'Simpan Data'}
                        </button>
                        <button type="button" onClick={onClose} style={{ flex: 1, background: '#222', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}