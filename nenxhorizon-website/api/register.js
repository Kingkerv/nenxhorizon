/* ============================================================
   NENXHORIZON — POST /api/register
   ------------------------------------------------------------
   The game calls this once, the first time a player ever joins.
   It writes them into the registry and never overwrites them.

   You do not need to edit this file.

   It needs three secrets, set in Vercel under
   Settings -> Environment Variables:

     SUPABASE_URL           your Supabase project URL
     SUPABASE_SERVICE_KEY   your Supabase service_role key (SECRET)
     NENX_KEY               the shared secret the game sends

   What the game sends:
     POST /api/register
     Headers: Content-Type: application/json
              x-nenx-key: <NENX_KEY>
     Body:    { "userId": 716768216,
                "username": "kingkerveu",
                "displayName": "Kerv Kure",
                "firstJoinAt": "2026-08-26T12:00:00Z" }

   What it answers:
     200 {"ok":true}                  written, or already there
     400 {"ok":false,"error":"..."}   the body was malformed
     401 {"ok":false,"error":"..."}   wrong or missing key
     405 {"ok":false,"error":"..."}   wrong method
     500 {"ok":false,"error":"..."}   the database said no
   ============================================================ */

const crypto = require('crypto');

/* constant-time string compare, so the key can't be guessed by timing */
function sameSecret(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const A = Buffer.from(a, 'utf8');
  const B = Buffer.from(b, 'utf8');
  if (A.length !== B.length) {
    // still burn the comparison so length isn't leaked by timing
    crypto.timingSafeEqual(A, A);
    return false;
  }
  return crypto.timingSafeEqual(A, B);
}

function clean(value, maxLen) {
  if (typeof value !== 'string') return null;
  const s = value.trim().slice(0, maxLen);
  return s.length ? s : null;
}

/* optional stat columns the game may start sending later.
   Add a name here and a column in Supabase, nothing else changes. */
const OPTIONAL_STATS = ['totalPower', 'level', 'nenRank'];

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const NENX_KEY = process.env.NENX_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY || !NENX_KEY) {
    console.error('register: missing environment variables');
    return res.status(500).json({ ok: false, error: 'server_not_configured' });
  }

  /* ---- auth ---- */
  const sent = req.headers['x-nenx-key'];
  if (!sameSecret(Array.isArray(sent) ? sent[0] : sent || '', NENX_KEY)) {
    return res.status(401).json({ ok: false, error: 'bad_key' });
  }

  /* ---- body ---- */
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {
      return res.status(400).json({ ok: false, error: 'bad_json' });
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'bad_body' });
  }

  const userId = Number(body.userId);
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return res.status(400).json({ ok: false, error: 'bad_userId' });
  }

  const username = clean(body.username, 50);
  if (!username) return res.status(400).json({ ok: false, error: 'bad_username' });

  const displayName = clean(body.displayName, 50) || username;

  let firstJoinAt = clean(body.firstJoinAt, 40);
  if (!firstJoinAt || isNaN(Date.parse(firstJoinAt))) {
    firstJoinAt = new Date().toISOString();
  }

  const row = { userId, username, displayName, firstJoinAt };

  /* optional stats, only if the game actually sent them */
  const stats = {};
  for (const key of OPTIONAL_STATS) {
    if (body[key] !== undefined && body[key] !== null && body[key] !== '') {
      stats[key] = body[key];
      row[key] = body[key];
    }
  }

  const base = SUPABASE_URL.replace(/\/+$/, '');
  const auth = {
    'apikey': SERVICE_KEY,
    'Authorization': 'Bearer ' + SERVICE_KEY,
    'Content-Type': 'application/json'
  };

  try {
    /* INSERT, and quietly do nothing if this userId is already on the wall.
       That is what makes the endpoint safe to call twice. */
    const insert = await fetch(base + '/rest/v1/players', {
      method: 'POST',
      headers: Object.assign({}, auth, {
        'Prefer': 'resolution=ignore-duplicates,return=minimal'
      }),
      body: JSON.stringify([row])
    });

    if (!insert.ok) {
      const detail = await insert.text();
      console.error('register: supabase insert failed', insert.status, detail);
      return res.status(500).json({ ok: false, error: 'db_write_failed' });
    }

    /* If the game sent live stats, refresh just those columns on an existing
       row. firstJoinAt is never touched, so the original date always survives. */
    if (Object.keys(stats).length) {
      const patch = await fetch(
        base + '/rest/v1/players?userId=eq.' + encodeURIComponent(userId),
        {
          method: 'PATCH',
          headers: Object.assign({}, auth, { 'Prefer': 'return=minimal' }),
          body: JSON.stringify(stats)
        }
      );
      if (!patch.ok) {
        console.error('register: stat refresh failed', patch.status, await patch.text());
        /* the player is registered, which is the important part */
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('register: unexpected error', err);
    return res.status(500).json({ ok: false, error: 'unexpected' });
  }
};
