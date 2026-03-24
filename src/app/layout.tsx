import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Multi-Tenant VPN Portfolio',
  description: 'A platform to discover the best VPN solutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">{children}</body>
    </html>
  );
}
