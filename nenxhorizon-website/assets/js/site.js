/* ============================================================
   NENXHORIZON — shared site behaviour
   Runs on every page. You never need to edit this file.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- your links (edited in assets/js/links.js) ----------
     Any element with data-link="roblox" gets that URL. If the URL is
     blank the element removes itself so the site never shows a dead
     button.
  --------------------------------------------------------------- */
  var L = window.NENX_LINKS || {};
  document.querySelectorAll('[data-link]').forEach(function (el) {
    var url = (L[el.getAttribute('data-link')] || '').trim();
    if (url) {
      el.setAttribute('href', url);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    } else {
      el.remove();
    }
  });

  /* ---------- mobile nav ---------- */
  var burger = document.querySelector('.nav__burger');
  var links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', links.classList.contains('is-open'));
    });
  }

  /* ---------- image slots ----------------------------------
     Any <div class="shot__frame" data-shot="filename.jpg"> will try to
     load assets/img/<filename>. If the file isn't there yet, a labelled
     placeholder is shown instead. Drop the file in, refresh, done.
  --------------------------------------------------------- */
  document.querySelectorAll('[data-shot]').forEach(function (frame) {
    var file = frame.getAttribute('data-shot');
    var size = frame.getAttribute('data-size') || '';
    var label = frame.getAttribute('data-label') || file;

    var ph = document.createElement('div');
    ph.className = 'shot__ph';
    ph.innerHTML =
      '<span class="mark">写</span>' +
      '<span class="name">' + label + '</span>' +
      (size ? '<span class="size">' + size + '</span>' : '');
    frame.appendChild(ph);

    var img = new Image();
    img.alt = frame.getAttribute('data-alt') || label;
    img.loading = 'lazy';
    img.onload = function () {
      frame.innerHTML = '';
      frame.appendChild(img);
    };
    img.onerror = function () { /* keep the placeholder */ };
    img.src = 'assets/img/' + file;
  });

  /* ---------- reveal on scroll ---------- */
  var rv = document.querySelectorAll('.rv');
  if (rv.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- guide: highlight the chapter you're reading ---------- */
  var tocLinks = document.querySelectorAll('.toc__list a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
          if (map[e.target.id]) map[e.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  /* ---------- click a redeem code to copy it ---------- */
  document.querySelectorAll('.code').forEach(function (el) {
    var badge = document.createElement('span');
    badge.className = 'code__copied';
    badge.textContent = 'COPIED';
    el.appendChild(badge);
    el.addEventListener('click', function () {
      var id = el.querySelector('.code__id');
      if (!id) return;
      var text = id.textContent.trim();
      var done = function () {
        el.classList.add('is-copied');
        setTimeout(function () { el.classList.remove('is-copied'); }, 1100);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(ta); done();
      }
    });
  });

  /* ---------- current year in footer ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
