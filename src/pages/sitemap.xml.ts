import { getCollection } from 'astro:content';

const SITE = 'https://tozluskor.vercel.app';

function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function entry(loc: string, priority: string, changefreq: string): string {
  return `  <url>\n    <loc>${SITE}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export async function GET() {
  const PER_PAGE_CAT = 4;
  const PER_PAGE_TAG = 4;

  const collections = ['spor-kitapligi', 'spor-filmografisi', 'cumhuriyet-donemi-spor', 'kisisel-blog'] as const;

  const urls: string[] = [];

  // --- Statik sayfalar ---
  urls.push(entry('/', '1.0', 'daily'));
  urls.push(entry('/hakkimizda/', '0.4', 'monthly'));
  urls.push(entry('/ara/', '0.3', 'monthly'));

  // --- Kategoriler + makaleler + pagination ---
  for (const col of collections) {
    const entries = (await getCollection(col, ({ data }: any) => !data.draft))
      .sort((a: any, b: any) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

    // Kategori index
    urls.push(entry(`/${col}/`, '0.8', 'weekly'));

    // Kategori pagination (sayfa 2+)
    const totalCatPages = Math.ceil(entries.length / PER_PAGE_CAT);
    for (let p = 2; p <= totalCatPages; p++) {
      urls.push(entry(`/${col}/sayfa/${p}/`, '0.5', 'weekly'));
    }

    // Makale detay
    for (const e of entries) {
      urls.push(entry(`/${col}/${e.id}/`, '0.7', 'monthly'));
    }
  }

  // --- Etiket sayfaları ---
  const allEntries: any[] = [];
  for (const col of collections) {
    const entries = await getCollection(col, ({ data }: any) => !data.draft);
    for (const e of entries) allEntries.push(e);
  }

  const tagMap = new Map<string, { slug: string; count: number }>();
  for (const item of allEntries) {
    for (const tag of (item.data.tags || []) as string[]) {
      const slug = tagSlug(tag);
      if (!tagMap.has(slug)) tagMap.set(slug, { slug, count: 0 });
      tagMap.get(slug)!.count++;
    }
  }

  for (const [, { slug, count }] of tagMap) {
    // Etiket index
    urls.push(entry(`/etiket/${slug}/`, '0.5', 'weekly'));

    // Etiket pagination (sayfa 2+)
    const totalTagPages = Math.ceil(count / PER_PAGE_TAG);
    for (let p = 2; p <= totalTagPages; p++) {
      urls.push(entry(`/etiket/${slug}/sayfa/${p}/`, '0.4', 'weekly'));
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
