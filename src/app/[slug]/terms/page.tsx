import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.vpnProduct.findUnique({
    where: { subdomain_slug: slug, status: 'published' },
  });

  if (!product) {
    return { title: 'Not Found' };
  }

  return {
    title: `Terms & Conditions - ${product.name}`,
  };
}

export default async function TermsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.vpnProduct.findUnique({
    where: { subdomain_slug: slug, status: 'published' },
    include: { legal: true },
  });

  if (!product) {
    notFound();
  }

  const primaryColor = product.primary_color || '#3b82f6';
  const secondaryColor = product.secondary_color || '#1d4ed8';
  const fontFamily = product.font_family || 'Inter, sans-serif';

  return (
    <div
      style={{
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor,
        fontFamily: fontFamily,
      } as React.CSSProperties}
      className="min-h-screen flex flex-col bg-gray-50"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primary-color: ${primaryColor};
          --secondary-color: ${secondaryColor};
        }
        .text-primary { color: var(--primary-color); }
        .bg-primary { background-color: var(--primary-color); }
      `}} />

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            {product.logo_url ? (
              <img src={product.logo_url} alt={`${product.name} Logo`} className="h-10 w-10 object-contain" />
            ) : (
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {product.name.charAt(0)}
              </div>
            )}
            <span className="font-bold text-xl text-gray-900">{product.name}</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto py-16 px-4 flex-grow">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 max-w-4xl mx-auto border border-gray-100">
          <h1 className="text-4xl font-extrabold mb-8 text-gray-900 border-b pb-6">Terms & Conditions</h1>
          {product.legal?.effective_date && (
            <p className="text-gray-500 mb-8 font-medium">Effective Date: {new Date(product.legal.effective_date).toLocaleDateString()}</p>
          )}

          <div
            className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.legal?.terms_html || '<p>No terms and conditions available.</p>' }}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-auto border-t border-gray-800">
        <div className="container mx-auto text-center text-gray-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} {product.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
