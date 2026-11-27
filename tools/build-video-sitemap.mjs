// Builds video-sitemap.xml (Google video sitemap) from the manifest snapshot plus video-captions.json.
// Run from the repo root: node tools/build-video-sitemap.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const SITE = 'https://www.kafka.blog';
const MEDIA = 'https://audio.kafka.blog/videos/';
const snap = JSON.parse(readFileSync('tools/video-manifest-snapshot.json', 'utf8')).videos;
const caps = JSON.parse(readFileSync('video-captions.json', 'utf8')).videos;
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const cut = (s, n) => { s = String(s || '').trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; };

const urls = Object.entries(snap).map(([path, v]) => {
  const c = caps[path] || {};
  if (!c.title || !c.description) throw new Error('video-captions.json has no title/description for ' + path);
  const tags = (c.keywords || []).slice(0, 32).map(k => `      <video:tag>${esc(k)}</video:tag>`).join('\n');
  return `  <url>
    <loc>${SITE}${path}</loc>
    <video:video>
      <video:thumbnail_loc>${MEDIA}${v.file}.jpg</video:thumbnail_loc>
      <video:title>${esc(cut(c.title, 100))}</video:title>
      <video:description>${esc(cut(c.description, 2048))}</video:description>
      <video:content_loc>${MEDIA}${v.file}.mp4</video:content_loc>
      <video:duration>${Math.round(v.duration)}</video:duration>
      <video:publication_date>${v.uploadDate}T00:00:00+00:00</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:uploader info="${SITE}/">Basava (बासभ)</video:uploader>
${tags}
    </video:video>
  </url>`;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join('\n')}
</urlset>
`;
writeFileSync('video-sitemap.xml', xml);
console.log('video-sitemap.xml:', urls.length, 'films');
