const PASSWORD = process.env.SITE_PASSWORD || 'admin';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pwd } = req.body || {};

  if (pwd === PASSWORD) {
    res.setHeader('Set-Cookie', 'mindmap-auth=ok; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800');
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: 'Wrong password' });
}
