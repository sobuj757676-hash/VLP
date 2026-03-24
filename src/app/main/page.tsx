import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function Main() {
  const products = await prisma.vpnProduct.findMany({
    where: { status: 'published' },
    orderBy: { display_order: 'asc' },
  });

  const config = await prisma.siteConfig.findMany();
  const configMap = config.reduce((acc, item) => {
    try {
      acc[item.key] = JSON.parse(item.value);
    } catch (e) {
      acc[item.key] = item.value;
    }
    return acc;
  }, {} as Record<string, any>);

  const heroHeadline = configMap['hero.headline'] || 'Discover the Best VPNs for Your Needs';
  const heroSubheadline = configMap['hero.subheadline'] || 'Secure, fast, and reliable VPN solutions across all your devices.';
  const heroCtaLabel = configMap['hero.cta.label'] || 'Explore VPNs';
  const heroBackground = configMap['hero.background'] || 'bg-gradient-to-r from-blue-600 to-indigo-700';

  const aboutHeading = configMap['about.heading'] || 'About Us';
  const aboutBody = configMap['about.body'] || 'We provide a curated list of top-tier VPN products to keep your online activity secure and private.';

  const contactEmail = configMap['contact.email'] || 'contact@abcd.com';

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">ABCD Portfolio</Link>
          <nav className="space-x-4">
            <Link href="#catalog" className="text-gray-600 hover:text-blue-600">Catalog</Link>
            <Link href="#about" className="text-gray-600 hover:text-blue-600">About</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`text-white py-20 px-4 ${heroBackground.startsWith('bg-') ? heroBackground : ''}`} style={heroBackground.startsWith('#') ? { backgroundColor: heroBackground } : {}}>
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight max-w-4xl mx-auto">{heroHeadline}</h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">{heroSubheadline}</p>
          <Link href="#catalog" className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition">
            {heroCtaLabel}
          </Link>
        </div>
      </section>

      {/* VPN Catalog */}
      <section id="catalog" className="py-20 bg-gray-50 px-4 flex-grow">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our VPN Products</h2>

          {products.length === 0 ? (
            <div className="text-center text-gray-500 bg-white p-12 rounded-lg shadow-sm">
              <p className="text-lg">No VPN products are currently published.</p>
              <p className="text-sm mt-2">Check back later or contact support.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((vpn) => (
                <div key={vpn.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
                  <div className="p-6 flex-grow">
                    <div className="flex items-center space-x-4 mb-4">
                      {vpn.logo_url ? (
                        <img src={vpn.logo_url} alt={`${vpn.name} logo`} className="w-16 h-16 rounded-xl object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">
                          {vpn.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{vpn.name}</h3>
                        {vpn.app_rating && (
                          <div className="flex items-center text-yellow-500 text-sm mt-1">
                            <span className="font-bold mr-1">{vpn.app_rating}</span>
                            <span>★</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                      {vpn.short_description || 'No description available.'}
                    </p>
                  </div>
                  <div className="p-6 pt-0 mt-auto border-t border-gray-50 bg-gray-50">
                    <Link
                      href={process.env.NODE_ENV === 'production' ? `https://${vpn.subdomain_slug}.abcd.com` : `http://${vpn.subdomain_slug}.localhost:3000`}
                      className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      target="_blank"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">{aboutHeading}</h2>
          <div className="prose prose-lg mx-auto text-gray-600" dangerouslySetInnerHTML={{ __html: aboutBody }} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold mb-4">ABCD Portfolio</h3>
            <p className="text-gray-400">Your trusted source for premium VPN solutions.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-200">Contact</h4>
            <a href={`mailto:${contactEmail}`} className="text-gray-400 hover:text-white transition">{contactEmail}</a>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-200">Legal</h4>
            <div className="space-y-2 flex flex-col">
              <Link href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} ABCD Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
