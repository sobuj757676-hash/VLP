import Link from 'next/link';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-50 flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
        <div className="text-2xl font-bold mb-8 pl-2 mt-4 text-blue-400">Super Admin</div>
        <nav className="space-y-2 flex-1">
          <Link href="/admin" className="block px-4 py-3 rounded hover:bg-gray-800 transition">Dashboard</Link>
          <Link href="/admin/products" className="block px-4 py-3 rounded hover:bg-gray-800 transition">VPN Products</Link>
          <Link href="/admin/site-config" className="block px-4 py-3 rounded hover:bg-gray-800 transition">Main Site CMS</Link>
        </nav>
        <div className="pt-8 border-t border-gray-800 text-sm text-gray-500 text-center">
          v1.0.0 Ecosystem
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
