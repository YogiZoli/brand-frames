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
    lock:     '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'
  };
  w.ZGI = {
    paint: function () {
      document.querySelectorAll("[data-icon]").forEach(function (e) {
        var p = P[e.dataset.icon];
        if (p) e.innerHTML = S + p + "</svg>";
      });
    },
    has: function (n) { return !!P[n]; }
  };
})(window);
