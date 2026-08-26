/* ============================================================
   NENXHORIZON — renders the roadmap board from data/board.js
   You never need to edit this file. Edit data/board.js instead.
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.NENX_BOARD || { DONE: [], DOING: [], PLANNED: [] };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function cardHTML(c) {
    var tags = (c.tags || []).map(function (t) {
      var cls = 'tag';
      if (t === 'hot') cls += ' tag--hot';
      if (t === 'new') cls += ' tag--new';
      return '<span class="' + cls + '">' + esc(t) + '</span>';
    }).join('');

    return '' +
      '<article class="card">' +
        '<h3 class="card__title">' + esc(c.title) +
          (c.cj ? '<span class="cj">' + esc(c.cj) + '</span>' : '') +
        '</h3>' +
        '<p class="card__desc">' + esc(c.desc) + '</p>' +
        (tags ? '<div class="card__tags">' + tags + '</div>' : '') +
      '</article>';
  }

  function fill(key, bodyId, countId) {
    var list = DATA[key] || [];
    var body = document.getElementById(bodyId);
    var count = document.getElementById(countId);
    if (count) count.textContent = list.length;
    if (!body) return;
    body.innerHTML = list.length
      ? list.map(cardHTML).join('')
      : '<p class="faint" style="padding:12px;font-size:.88rem">Nothing here yet.</p>';
  }

  fill('DONE', 'col-done', 'count-done');
  fill('DOING', 'col-doing', 'count-doing');
  fill('PLANNED', 'col-planned', 'count-planned');

  /* totals in the header strip */
  var total = (DATA.DONE || []).length + (DATA.DOING || []).length + (DATA.PLANNED || []).length;
  var t = document.getElementById('board-total');
  if (t) t.textContent = total;
})();
