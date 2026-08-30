/* zg-frames icons.js — one stroke weight, one grid, always inside a circle.
   Letters as icons are an anti-pattern (DESIGN-FOUNDATION.md).
   Usage: <span class="ico" data-icon="comment"></span>  → filled by ZGI.paint() */
(function (w) {
  var S = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
          'stroke-linecap="round" stroke-linejoin="round">';
  var P = {
    comment:  '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z"/>',
    client:   '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
    script:   '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    voice:    '<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
    visuals:  '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 14l4-4 3 3 4-5 7 7"/>',
    face:     '<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01"/><path d="M8.5 14.5a5 5 0 0 0 7 0"/>',
    check:    '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>',
    cross:    '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
    clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    money:    '<circle cx="12" cy="12" r="9"/><path d="M12 6v12"/><path d="M15 9.5a2.5 2.5 0 0 0-2.5-2h-1a2 2 0 0 0 0 4h1a2 2 0 0 1 0 4h-1A2.5 2.5 0 0 1 9 14"/>',
    place:    '<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    title:    '<path d="M4 6h16"/><path d="M9 6v13"/><path d="M6 19h6"/>',
    caption:  '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 12h4M13 12h4M7 15h10"/>',
    globe:    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z"/>',
    spark:    '<path d="M12 3l2.2 5.6L20 11l-5.8 2.4L12 19l-2.2-5.6L4 11l5.8-2.4z"/>',
    lock:     '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    /* v1.6 — new families: branch, funnel, cycle, gauge, quote, question, code, grid */
    branch:   '<circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.4 11L15.6 7M8.4 13l7.2 4"/>',
    funnel:   '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    cycle:    '<path d="M20 12a8 8 0 0 1-13.7 5.6"/><path d="M4 12a8 8 0 0 1 13.7-5.6"/><path d="M17.7 3v3.6h-3.6"/><path d="M6.3 21v-3.6h3.6"/>',
    gauge:    '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4.2-5"/><circle cx="12" cy="17" r="1.6"/>',
    quote:    '<path d="M9 6C6.5 7.4 5 9.7 5 12.6V18h5.4v-5.6H7.8c0-2 .7-3.5 2.4-4.6z"/><path d="M19 6c-2.5 1.4-4 3.7-4 6.6V18h5.4v-5.6h-2.6c0-2 .7-3.5 2.4-4.6z"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.4A2.7 2.7 0 1 1 12 12.8V14"/><path d="M12 17.4h.01"/>',
    warn:     '<path d="M12 3.6 21 19.4H3z"/><path d="M12 9.6v4.2"/><path d="M12 16.6h.01"/>',
    heart:    '<path d="M12 20.4 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 1 1 19.4 13z"/>',
    code:     '<path d="M9 8 4.5 12 9 16"/><path d="m15 8 4.5 4L15 16"/><path d="M13.4 5.4 10.6 18.6"/>',
    grid:     '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
    mail:     '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.6 6.5 8.4 6.2 8.4-6.2"/>',
    tag:      '<path d="M3 11.4V4.5A1.5 1.5 0 0 1 4.5 3h6.9a2 2 0 0 1 1.4.6l7.6 7.6a2 2 0 0 1 0 2.8l-6.4 6.4a2 2 0 0 1-2.8 0L3.6 12.8a2 2 0 0 1-.6-1.4z"/><path d="M7.6 7.6h.01"/>'
  };
  /* SKITCH glyphs — drawn paths on a 24 grid, never font characters.
     White stroke on a solid disc. Meaning = shape + word, never colour alone. */
  var G = {
    cross: '<path d="M7.4 7.4 16.6 16.6M16.6 7.4 7.4 16.6"/>',
    check: '<path d="M6.6 12.4 10.4 16.2 17.4 8.2"/>',
    bang:  '<path d="M12 6.4v7.2"/><path d="M12 17.4h.01"/>',
    query: '<path d="M9.1 9.2A2.9 2.9 0 1 1 12 12.9V14.4"/><path d="M12 17.8h.01"/>',
    dash:  '<path d="M7 12h10"/>',
    heart: '<path d="M12 19.4 5.4 12.6a4.2 4.2 0 0 1 5.9-6l.7.7.7-.7a4.2 4.2 0 1 1 5.9 6z" fill="currentColor" stroke-width="1.2"/>'
  };
  var SG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
           'stroke-linecap="round" stroke-linejoin="round">';
  w.ZGI = {
    paint: function (scope) {
      var q = scope && scope.nodeType === 1 ? scope : document;
      q.querySelectorAll("[data-icon]").forEach(function (e) {
        var p = P[e.dataset.icon];
        if (p) e.innerHTML = S + p + "</svg>";
      });
      q.querySelectorAll("[data-glyph]").forEach(function (e) {
        var p = G[e.dataset.glyph];
        if (p) e.innerHTML = SG + p + "</svg>";
      });
    },
    has: function (n) { return !!P[n]; },
    glyphs: function () { return Object.keys(G); }
  };
})(window);
