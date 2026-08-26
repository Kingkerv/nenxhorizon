/* ============================================================
   NENXHORIZON — the registry wall
   Reads /api/players and draws every soul who ever entered.
   You do not need to edit this file.
   ============================================================ */
(function () {
  'use strict';

  var PAGE = 300;

  var elCount = document.getElementById('soul-count');
  var elGrid = document.getElementById('souls');
  var elState = document.getElementById('reg-state');
  var elSearch = document.getElementById('reg-search');
  var elSort = document.getElementById('reg-sort');
  var elMore = document.getElementById('reg-more');
  var elTools = document.getElementById('reg-tools');

  var all = [];      // everything loaded so far
  var total = 0;     // true total in the database
  var offset = 0;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function fmtDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '—';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function setState(mark, title, detail) {
    if (!elState) return;
    elState.hidden = false;
    elState.innerHTML =
      '<span class="mark">' + mark + '</span>' +
      '<p style="color:var(--ink-soft);margin:0 0 .4rem">' + title + '</p>' +
      (detail ? '<p style="font-size:.86rem;margin:0">' + detail + '</p>' : '');
  }
  function clearState() { if (elState) elState.hidden = true; }

  /* count that ticks up instead of just appearing */
  function countUp(el, to) {
    if (!el) return;
    if (to <= 0) { el.textContent = '0'; return; }
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || to > 20000) { el.textContent = to.toLocaleString(); return; }
    var start = null, dur = 1100;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- one card ----------
     Extra columns (totalPower, level, nenRank ...) appear on their own
     the moment the database starts returning them. Nothing to change here. */
  function soulHTML(p, rank) {
    var extras = [];
    if (p.totalPower != null && p.totalPower !== '') {
      extras.push('<span class="soul__stat">TP <b>' + esc(Number(p.totalPower).toLocaleString()) + '</b></span>');
    }
    if (p.level != null && p.level !== '') {
      extras.push('<span class="soul__stat">LVL <b>' + esc(p.level) + '</b></span>');
    }
    if (p.nenRank != null && p.nenRank !== '') {
      extras.push('<span class="soul__stat">NEN <b>' + esc(p.nenRank) + '</b></span>');
    }

    var name = p.displayName || p.username || 'Unknown';

    return '' +
      '<article class="soul">' +
        (rank ? '<span class="soul__rank">#' + rank + '</span>' : '') +
        '<div class="soul__name">' + esc(name) + '</div>' +
        '<div class="soul__handle">@' + esc(p.username || '') + '</div>' +
        '<div class="soul__meta">' +
          '<span>' + esc(fmtDate(p.firstJoinAt)) + '</span>' +
          '<span>' + esc(p.userId) + '</span>' +
        '</div>' +
        (extras.length ? '<div class="soul__extra">' + extras.join('') + '</div>' : '') +
      '</article>';
  }

  /* ---------- draw ---------- */
  function render() {
    if (!elGrid) return;

    var q = (elSearch && elSearch.value || '').trim().toLowerCase();
    var mode = (elSort && elSort.value) || 'new';

    /* rank is join order: #1 is the very first soul ever */
    var ranked = all.map(function (p, i) {
      return { p: p, rank: total - i };
    });

    var list = ranked.filter(function (r) {
      if (!q) return true;
      return String(r.p.username || '').toLowerCase().indexOf(q) !== -1 ||
             String(r.p.displayName || '').toLowerCase().indexOf(q) !== -1 ||
             String(r.p.userId || '').indexOf(q) !== -1;
    });

    if (mode === 'old') {
      list = list.slice().reverse();
    } else if (mode === 'az') {
      list = list.slice().sort(function (a, b) {
        return String(a.p.username || '').toLowerCase()
          .localeCompare(String(b.p.username || '').toLowerCase());
      });
    }

    if (!list.length) {
      elGrid.innerHTML = '';
      setState('無', q ? 'No soul by that name has entered.' : 'The wall is empty. Be the first.');
      return;
    }

    clearState();
    elGrid.innerHTML = list.map(function (r) { return soulHTML(r.p, r.rank); }).join('');
  }

  /* ---------- load ---------- */
  function load(more) {
    if (elMore) { elMore.disabled = true; elMore.textContent = 'Loading...'; }

    return fetch('/api/players?limit=' + PAGE + '&offset=' + offset, { headers: { 'Accept': 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!data || data.ok !== true) throw new Error(data && data.error || 'bad_response');

        total = data.count || 0;
        all = all.concat(data.players || []);
        offset = all.length;

        if (!more) countUp(elCount, total);
        else if (elCount) elCount.textContent = total.toLocaleString();

        if (elTools) elTools.hidden = total === 0;

        if (elMore) {
          if (all.length < total) {
            elMore.hidden = false;
            elMore.disabled = false;
            elMore.textContent = 'Load ' + Math.min(PAGE, total - all.length) + ' more';
          } else {
            elMore.hidden = true;
          }
        }

        render();
      })
      .catch(function (err) {
        if (elCount) elCount.textContent = '—';
        if (elMore) elMore.hidden = true;
        if (elTools) elTools.hidden = true;
        if (elGrid) elGrid.innerHTML = '';
        setState(
          '待',
          'The registry is not connected yet.',
          'This page needs the live site to be deployed. If you are looking at the files on your own computer, this message is normal and expected.<br><span style="opacity:.6">(' + esc(err.message) + ')</span>'
        );
      });
  }

  if (elSearch) elSearch.addEventListener('input', render);
  if (elSort) elSort.addEventListener('change', render);
  if (elMore) elMore.addEventListener('click', function () { load(true); });

  setState('…', 'Reading the registry...');
  load(false);
})();
