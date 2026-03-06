export default function robots() {
  const baseUrl = 'https://roomserviceai.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/', '/sales/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
