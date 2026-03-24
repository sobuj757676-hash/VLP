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
    title: product.meta_title || `${product.name} VPN`,
    description: product.meta_description || product.short_description,
  };
}

export default async function SubdomainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.vpnProduct.findUnique({
    where: { subdomain_slug: slug, status: 'published' },
    include: {
      features: { orderBy: { display_order: 'asc' } },
      pricing_plans: { orderBy: { display_order: 'asc' } },
      legal: true,
    },
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
      className="min-h-screen flex flex-col"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primary-color: ${primaryColor};
          --secondary-color: ${secondaryColor};
        }
        .text-primary { color: var(--primary-color); }
        .bg-primary { background-color: var(--primary-color); }
        .bg-secondary { background-color: var(--secondary-color); }
        .border-primary { border-color: var(--primary-color); }
      `}} />

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {product.logo_url ? (
              <img src={product.logo_url} alt={`${product.name} Logo`} className="h-10 w-10 object-contain" />
            ) : (
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {product.name.charAt(0)}
              </div>
            )}
            <span className="font-bold text-xl text-gray-900">{product.name}</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-primary transition font-medium">Features</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-primary transition font-medium">Pricing</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-24 px-4 text-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
        <div className="container mx-auto relative z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 max-w-4xl mx-auto drop-shadow-sm">{product.name}</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto opacity-90 font-light">
            {product.short_description}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {product.show_app_badge && product.app_store_url && (
              <a href={product.app_store_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-white text-gray-900 font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13.12 4.23c-.76.92-1.88 1.54-3.12 1.48-.13-1.16.4-2.33 1.13-3.11.75-.82 1.95-1.44 3.03-1.42.15 1.25-.26 2.19-1.04 3.05"/></svg>
                App Store
              </a>
            )}
            {product.show_play_badge && product.play_store_url && (
              <a href={product.play_store_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-white text-gray-900 font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M5 2.015L20.5 12 5 21.985v-19.97z"/></svg>
                Google Play
              </a>
            )}
          </div>

          {(product.app_rating || product.download_count_display) && (
            <div className="mt-12 flex items-center justify-center space-x-6 text-sm font-medium opacity-80">
              {product.app_rating && (
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <span className="text-yellow-400 text-lg mr-2">★</span>
                  <span>{product.app_rating} / 5.0 Rating</span>
                </div>
              )}
              {product.download_count_display && (
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span>{product.download_count_display} Downloads</span>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* About Description */}
      {product.long_description && (
        <section className="py-16 bg-white px-4">
          <div className="container mx-auto max-w-3xl prose prose-lg text-gray-700 text-center" dangerouslySetInnerHTML={{ __html: product.long_description }} />
        </section>
      )}

      {/* Features Section */}
      {product.features.length > 0 && (
        <section id="features" className="py-20 bg-gray-50 px-4 border-t border-gray-100">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">Why Choose {product.name}?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {product.features.map((feature) => (
                <div key={feature.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {product.pricing_plans.length > 0 && (
        <section id="pricing" className="py-24 bg-white px-4 border-t border-gray-100">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">Simple, Transparent Pricing</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {product.pricing_plans.map((plan) => {
                let featuresList: string[] = [];
                try {
                  featuresList = plan.features_list ? JSON.parse(plan.features_list) : [];
                } catch(e) {}

                return (
                  <div key={plan.id} className={`w-full max-w-sm rounded-3xl p-8 flex flex-col ${plan.is_featured ? 'border-2 border-primary shadow-xl relative scale-105 z-10 bg-white' : 'border border-gray-200 shadow-sm bg-gray-50'}`}>
                    {plan.is_featured && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase shadow-md">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.plan_name}</h3>
                    <div className="mb-6 flex items-baseline">
                      <span className="text-4xl font-extrabold text-gray-900">{plan.monthly_price}</span>
                      <span className="text-gray-500 ml-2 font-medium">{plan.currency}/mo</span>
                    </div>
                    {plan.yearly_price && (
                      <p className="text-sm text-gray-500 mb-8 font-medium">or {plan.yearly_price} {plan.currency}/year</p>
                    )}
                    <ul className="space-y-4 mb-8 flex-grow">
                      {featuresList.map((f, i) => (
                        <li key={i} className="flex items-start text-gray-700">
                          <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          <span className="font-medium">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={plan.cta_url || '#'} className={`block w-full text-center py-4 rounded-xl font-bold transition-all ${plan.is_featured ? 'bg-primary text-white hover:bg-secondary shadow-lg hover:shadow-xl' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                      {plan.cta_label}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer / Legal */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-auto">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            {product.logo_url ? (
              <img src={product.logo_url} alt={`${product.name} Logo`} className="h-8 w-8 object-contain opacity-80" />
            ) : (
              <div className="h-8 w-8 bg-gray-800 rounded flex items-center justify-center font-bold text-gray-400">
                {product.name.charAt(0)}
              </div>
            )}
            <span className="font-semibold text-gray-400">&copy; {new Date().getFullYear()} {product.name}. All rights reserved.</span>
          </div>
          <div className="flex space-x-6 text-gray-400">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link>
            {product.legal?.contact_email && (
              <a href={`mailto:${product.legal.contact_email}`} className="hover:text-white transition">Contact</a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
