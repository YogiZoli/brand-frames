/* zg-frames type.js v1.0 — ÍRÁSJEL-KULTÚRA
   ---------------------------------------------------------------------------
   Ez fut a build ELŐTT, és megtisztítja a képre kerülő szöveget. Amit egy
   igazi tipográfus kézzel megtenne minden feliratnál, azt itt a gép teszi meg,
   minden feliratnál, mindig, felejtés nélkül.

   MIT CSINÁL

   1. Törhetetlen szóköz a szám és a mértékegység közé.
      "54 mp" soha nem törhet ketté sorvégen. Ha megteszi, az olvasó egy
      pillanatra megáll, és az a pillanat elveszett figyelem.

   2. Valódi hármaspont karakter a három pont helyett.
      Három külön pont között a betűköz egyenetlen. Az … egyetlen glif,
      helyesen kikevert térközzel.

   3. Tipográfiai idézőjel a gépíró idézőjel helyett.
      A " a írógépről maradt ránk. Magyarban „ent", angolban " ". A doksi
      lang attribútuma dönti el, melyik.

   4. Szorzójel a betű x helyett.
      "8x5" nem nyolc iksz öt. A × egy matematikai jel, más a szélessége és
      más a vonalvastagsága.

   AMIT SZÁNDÉKOSAN NEM CSINÁL

   Nem tesz be gondolatjelet. Zoltán szabálya szerint a gondolatjel a
   legárulkodóbb AI-jel egy szövegben, és ez a képre írt szövegre is áll.
   Ahol gondolatjel kellene, ott KÜLÖN JELENET kell.

   HOL NEM FUT LE
   Kódot és parancsot soha nem érint (.cmd, .cmdline, code, pre). Ott a
   gépíró idézőjel a HELYES, mert az a valóság: azt kell begépelni.
   --------------------------------------------------------------------------- */
(function (w, d) {
  var NBSP = " ";
  NBSP = String.fromCharCode(160);     /* explicit kodpont, hogy sose vesszen el */
  var SKIP = ".cmd, .cmdline, .cmdbody, code, pre, [data-type-raw]";

  /* mértékegységek, amik soha nem szakadnak el a számuktól */
  var UNITS = "mp|s|ms|perc|óra|nap|hét|hónap|év|px|%|kb|MB|GB|dB|LUFS|fps|kocka|szó|nyelv|EUR|USD|Ft";
  var RX_UNIT = new RegExp("(\\d)\\s+(" + UNITS + ")\\b", "g");
  var RX_ELLIPSIS = /\.\.\./g;
  var RX_TIMES = /(\d)\s*[xX]\s*(\d)/g;

  function curly(s, hu) {
    var o = hu ? "„" : "“", c = hu ? "”" : "”";
    /* nyitó idézőjel: sor elején vagy szóköz után */
    s = s.replace(/(^|[\s(\[])"/g, "$1" + o);
    /* a maradék záró */
    s = s.replace(/"/g, c);
    /* aposztróf */
    s = s.replace(/(\w)'(\w)/g, "$1’$2");
    return s;
  }

  function tidy(s, hu) {
    if (!s) return s;
    s = s.replace(RX_ELLIPSIS, "…");
    s = s.replace(RX_UNIT, "$1" + NBSP + "$2");
    s = s.replace(RX_TIMES, "$1 × $2");
    s = curly(s, hu);
    return s;
  }

  function walk(root, hu) {
    var it = d.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false), n, list = [];
    while ((n = it.nextNode())) list.push(n);
    list.forEach(function (t) {
      if (t.parentElement && t.parentElement.closest(SKIP)) return;
      var v = tidy(t.nodeValue, hu);
      if (v !== t.nodeValue) t.nodeValue = v;
    });
  }

  w.ZGT = {
    /* értékekre is hívható, például data-val gépelt mezőkhöz */
    tidy: tidy,
    run: function (scope) {
      var hu = (d.documentElement.getAttribute("lang") || "en").indexOf("hu") === 0;
      var root = scope && scope.nodeType === 1 ? scope : d.body;
      var q = scope && scope.nodeType === 1 ? scope : d;
      walk(root, hu);
      /* a gépelt mezők értéke attribútumban él, azt külön kell kezelni */
      q.querySelectorAll("[data-val]").forEach(function (e) {
        if (e.closest(SKIP)) return;
        if (/^[\d.]+$/.test(e.dataset.val)) return;      /* tiszta szám: hagyd */
        e.dataset.val = tidy(e.dataset.val, hu);
      });
      /* a lupé szavai is szöveg */
      q.querySelectorAll("[data-words]").forEach(function (e) {
        e.dataset.words = tidy(e.dataset.words, hu);
      });
    }
  };
})(window, document);
