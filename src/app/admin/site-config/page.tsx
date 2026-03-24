'use client';

import { useState, useEffect } from 'react';

export default function AdminSiteConfig() {
  const [config, setConfig] = useState<Record<string, string>>({
    'hero.headline': '',
    'hero.subheadline': '',
    'hero.cta.label': '',
    'hero.background': '',
    'about.heading': '',
    'about.body': '',
    'contact.email': '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const res = await fetch('/api/admin/site-config');
    if (res.ok) {
      const data = await res.json();
      const newConfig: Record<string, string> = { ...config };
      data.forEach((item: any) => {
        try {
          newConfig[item.key] = JSON.parse(item.value);
        } catch (e) {
          newConfig[item.key] = item.value;
        }
      });
      setConfig(newConfig);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/site-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    if (res.ok) {
      alert('Config saved successfully');
    } else {
      alert('Failed to save config');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Main Site Configuration</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="border-b pb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                <input
                  type="text"
                  name="hero.headline"
                  value={config['hero.headline']}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
                <input
                  type="text"
                  name="hero.subheadline"
                  value={config['hero.subheadline']}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Label</label>
                <input
                  type="text"
                  name="hero.cta.label"
                  value={config['hero.cta.label']}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                <input
                  type="text"
                  name="about.heading"
                  value={config['about.heading']}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Text (HTML allowed)</label>
                <textarea
                  name="about.body"
                  value={config['about.body']}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Footer Section</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contact.email"
                value={config['contact.email']}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>
        </form>
      </div>
    </div>
  );
}
