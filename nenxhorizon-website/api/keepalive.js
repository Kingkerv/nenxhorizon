/* ============================================================
   NENXHORIZON — GET /api/keepalive
   ------------------------------------------------------------
   Supabase pauses free projects that see no database activity
   for about a week. Vercel calls this endpoint once a day
   (see the "crons" entry in vercel.json), it touches the
   database, and the project never goes to sleep.

   You do not need to edit this file, and you never need to
   visit this URL yourself.
   ============================================================ */

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ ok: false, error: 'server_not_configured' });
  }

  try {
    const r = await fetch(
      SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/players?select=userId&limit=1',
      {
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': 'Bearer ' + SERVICE_KEY,
          'Range-Unit': 'items',
          'Range': '0-0'
        }
      }
    );
    if (!r.ok && r.status !== 206) {
      console.error('keepalive: supabase said', r.status, await r.text());
      return res.status(500).json({ ok: false, error: 'db_unreachable' });
    }
    return res.status(200).json({ ok: true, awake: true });
  } catch (err) {
    console.error('keepalive: unexpected error', err);
    return res.status(500).json({ ok: false, error: 'unexpected' });
  }
};
