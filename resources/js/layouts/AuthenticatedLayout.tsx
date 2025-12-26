import { PropsWithChildren } from 'react'

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow p-4">
                <h1 className="text-lg font-semibold">Dashboard</h1>
            </header>

            <main className="p-6">
                {children}
            </main>
        </div>
    )
}
