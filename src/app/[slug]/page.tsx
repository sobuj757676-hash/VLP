export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <div>Subdomain: {slug}.abcd.com</div>;
}
