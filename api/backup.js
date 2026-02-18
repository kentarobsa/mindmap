import { put, list, del } from '@vercel/blob';

export default async function handler(req, res) {
  // Auth check - same cookie as main site
  const cookie = req.headers.cookie || '';
  if (!cookie.includes('mindmap-auth=ok')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    // Save backup to Vercel Blob
    try {
      const { data } = req.body || {};
      if (!data) return res.status(400).json({ error: 'No data' });

      // Delete old backup first (keep only latest)
      const existing = await list({ prefix: 'mindmap-backup/' });
      for (const blob of existing.blobs) {
        await del(blob.url);
      }

      // Save new backup
      const blob = await put('mindmap-backup/latest.json', JSON.stringify(data), {
        access: 'public',
        contentType: 'application/json',
      });

      return res.status(200).json({ ok: true, url: blob.url, savedAt: new Date().toISOString() });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'GET') {
    // Load latest backup from Vercel Blob
    try {
      const existing = await list({ prefix: 'mindmap-backup/' });
      if (!existing.blobs.length) {
        return res.status(404).json({ error: 'No backup found' });
      }
      const latest = existing.blobs[0];
      const response = await fetch(latest.url);
      const data = await response.json();
      return res.status(200).json({ ok: true, data, savedAt: latest.uploadedAt });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
