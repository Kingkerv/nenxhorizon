/* ============================================================
   NENXHORIZON — GET /api/players
   ------------------------------------------------------------
   Feeds the registry wall. Public, read only, no secrets leave
   the server. You do not need to edit this file.

   GET /api/players?limit=300&offset=0
     -> { "ok": true, "count": 1204, "players": [ ... ] }

   `count` is the total number of souls ever registered, not the
   number returned in this page.
   ============================================================ */

const MAX_LIMIT = 500;
const DEFAULT_LIMIT = 300;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('players: missing environment variables');
    return res.status(500).json({ ok: false, error: 'server_not_configured' });
  }

  const q = req.query || {};
  let limit = parseInt(q.limit, 10);
  if (!Number.isFinite(limit) || limit <= 0) limit = DEFAULT_LIMIT;
  limit = Math.min(limit, MAX_LIMIT);

  let offset = parseInt(q.offset, 10);
  if (!Number.isFinite(offset) || offset < 0) offset = 0;

  const base = SUPABASE_URL.replace(/\/+$/, '');
  const url = base + '/rest/v1/players?select=*&order=firstJoinAt.desc';

  try {
    const r = await fetch(url, {
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Range-Unit': 'items',
        'Range': offset + '-' + (offset + limit - 1),
        'Prefer': 'count=exact'
      }
    });

    if (!r.ok && r.status !== 206) {
      const detail = await r.text();
      console.error('players: supabase read failed', r.status, detail);
      return res.status(500).json({ ok: false, error: 'db_read_failed' });
    }

    const players = await r.json();

    /* Content-Range looks like "0-299/1204" — the bit after the slash
       is the true total. */
    let count = Array.isArray(players) ? players.length : 0;
    const range = r.headers.get('content-range');
    if (range && range.indexOf('/') !== -1) {
      const total = parseInt(range.split('/')[1], 10);
      if (Number.isFinite(total)) count = total;
    }

    /* cached at the edge for 30s so a busy wall doesn't hammer the database */
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=300');
    return res.status(200).json({
      ok: true,
      count: count,
      offset: offset,
      limit: limit,
      players: Array.isArray(players) ? players : []
    });
  } catch (err) {
    console.error('players: unexpected error', err);
    return res.status(500).json({ ok: false, error: 'unexpected' });
  }
};
