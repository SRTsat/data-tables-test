import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface MainLayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
    return (
        <div style={{ padding: '40px', background: '#000', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
            <Head title={title} />
            
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Navbar Terpusat */}
                <nav style={{ marginBottom: '30px', display: 'flex', gap: '20px', borderBottom: '1px solid #1a1a1a', paddingBottom: '20px' }}>
                    <Link href="/users-list" style={{ color: title === 'User Management' ? '#60a5fa' : '#94a3b8', textDecoration: 'none', fontWeight: 'bold' }}>Users</Link>
                    <Link href="/categories" style={{ color: title === 'Category Management' ? '#60a5fa' : '#94a3b8', textDecoration: 'none' }}>Categories</Link>
                </nav>

                {/* Konten Dinamis */}
                <main>{children}</main>
            </div>
        </div>
    );
}