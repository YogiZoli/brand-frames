/* zg-frames motion.js v1.1 — the shared motion library.
   Rules encoded here come from _frames/MOTION.md + FEEDBACK-LOG.md.
   Videos load this file; they never redefine motion.
   Usage: <script src="motion.js"></script> then ZG.build("main");
   Markup: <section class="clip" data-start data-duration> > .cam
   Opt-in:  data-anim="name" data-at="s" data-dur="s" data-val="..." */
(function (w) {
  var PULSE = 1.02;              /* ±2% — "finom", 2026-08-17 */
  var tl;

  /* ==========================================================================
     v1.7 — A MOZGÁS ALAPTÖRVÉNYEI
     ========================================================================== */

  /* --- 1. NÉGY EASING, TÖBB NINCS ---------------------------------------
     Eddig tizenhárom különböző easing volt használatban. Tizenhárom easing
     nem stílus, hanem a stílus hiánya: a néző nem tud megtanulni egy nyelvet,
     amiben minden mondat máshogy hangsúlyoz. Négy van, mindegyiknek egy
     dolga van, és mindegyiknek NEVE van, nem képlete. */
  var E = {
    enter: "power3.out",     /* megérkezik: gyorsan indul, lágyan leül */
    exit:  "power2.in",      /* elmegy: lágyan indul, gyorsan tűnik el */
    move:  "power2.inOut",   /* helyet változtat: mindkét vége lágy */
    pop:   "back.out(1.6)"   /* megjelenik hangsúllyal: apró túllövéssel */
  };
  /* A töltés KÜLÖN eset, és szándékosan majdnem lineáris: egy progress,
     ami eases-in, ugrásnak látszik. Ez nem ötödik stílus, hanem műszer. */
  var E_FILL = "power1.out";

  /* --- 2. A TÖMEG IDŐT JELENT -------------------------------------------
     Egy nagy elem lassabban indul és lassabban áll meg, mint egy kicsi. És
     az időtartam a MEGTETT ÚTTAL skálázódjon, ne legyen fix. Eddig minden
     0,8 mp volt, akár 100, akár 1000 pixelt mozgott valami. Pontosan ettől
     érződik egy animáció gépiesnek: a fizika hiányzik belőle.

     --- 3. SEBESSÉG-PLAFON ------------------------------------------------
     30 kocka per másodpercnél a gyors mozgás strobozik, tehát ugrálva
     látszik, nem folyamatosan. Mivel a `filter:blur` tiltott (megduplázza a
     render idejét), az egyetlen megoldás a sebesség korlátozása:
     egy elem egy kocka alatt ne mozduljon 60 pixelnél többet.
        60 px / kocka  ·  30 kocka / mp  =  1800 px / mp   ez a plafon.
     A dur() ezt garantálja: ha a kért idő gyorsabb lenne, kinyújtja. */
  var MAX_PX_PER_SEC = 1800;
  function dur(px, base) {
    px = Math.abs(px || 0);
    var d = (base || 0.42) + px / 1600;          /* tömeg-arányos alapérték */
    var floor = px / MAX_PX_PER_SEC;             /* a strobo-plafon */
    return Math.max(d, floor, 0.28);
  }
  function dist(a, b) { return Math.hypot(b[0] - a[0], b[1] - a[1]); }

  /* --- 4. AZ IRÁNY JELENTÉST HORDOZ -------------------------------------
     Ha ezt következetesen tartjuk, a néző MEGTANULJA a nyelvünket anélkül,
     hogy tudná, hogy tanul. Ez a legolcsóbb márkaépítés, ami létezik.

        alulról érkezik  = ÚJ dolog, most jön be a történetbe
        balról érkezik   = FOLYTATÁS, ugyanannak a gondolatnak a következő fele
        nagyobbodik      = HANGSÚLY, ez a fontos
        felfelé távozik  = LEZÁRVA, ezt már elintéztük

     Ezt a négy belépőt nevesítjük, hogy a jelenet-táblában szóval lehessen
     hivatkozni rájuk, ne pixelekkel. */
  var DIR = {
    "new":   { y: 34,  x: 0,   scale: 1 },
    "cont":  { y: 0,   x: -48, scale: 1 },
    "emph":  { y: 0,   x: 0,   scale: 0.88 },
    "close": { y: -26, x: 0,   scale: 1 }
  };

  /* --- 5. ELŐKÉSZÍTÉS ÉS UTÓREZGÉS --------------------------------------
     Egy apró ELLENMOZDULAT a fő mozdulat előtt, mint amikor nekifutsz, és egy
     leheletnyi TÚLLÖVÉS a végén. Ez az egyetlen dolog, ami egy animációt
     élővé tesz. A back.out már részben ezt csinálta, csak nem rendszeresen,
     hanem véletlenszerűen, ahol épp eszembe jutott.
     Rendszerré téve: az anticipáció 6% az úton, 0,12 mp. Nem több. Ha látod,
     hogy ott van, akkor túl sok. */
  function settle(el, at, props, d, dir) {
    var v = DIR[dir || "new"];
    tl.fromTo(el, { opacity: 0, y: v.y, x: v.x, scale: v.scale },
      { opacity: 1, y: 0, x: 0, scale: 1, duration: d || 0.55, ease: E.enter }, at);
  }

  /* --- 6. MOZGÁS-HIERARCHIA ---------------------------------------------
     A LEGFONTOSABB elem mozogjon UTOLJÁRA és LEGLASSABBAN. Ha a főszereplő
     érkezik elsőnek és leggyorsabban, akkor a szem a mellékszereplőkön köt
     ki, mert azok mozognak, amikor ő már megállt. Ez fordítva volt néhány
     jelenetben. A `data-hero` jelöli meg a főszereplőt, és a build a jelenet
     végén, lassabban indítja. */

  /* --- 7. HANGVEZÉRLŐ TÁBLA ---------------------------------------------
     Mi szöveget írunk, a HyperFrames gyárt kockát. Hangmotort NEM írunk.
     Amit írhatunk: egy TÁBLÁZATOT arról, mikor melyik hangminta szólna.
     A motion.js menet közben feljegyzi a jeleteket, a build végén kiírja
     `window.__zgCues`-ba, és onnan egy külön szkript teszi bele ffmpeggel.
     Lásd SOUND.md. */
  var cues = [];
  function cue(name, t) { cues.push({ t: Math.round(t * 100) / 100, s: name }); }

  function n(v, d) { v = parseFloat(v); return isNaN(v) ? d : v; }

  /* Real geometric length of a ring/arc, in SVG user units.
     pathLength="1" is not reliable on <circle> in every engine — if it is ignored,
     stroke-dasharray:1 means "1px", the ring reads as solid, and the fill APPEARS to
     snap to 100%. Measuring removes the guess. (HF-v6-02) */
  function ringLen(e) {
    try { if (e.getTotalLength) { var L = e.getTotalLength(); if (L > 2) return L; } } catch (x) {}
    return 2 * Math.PI * n(e.getAttribute("r"), 100);
  }
  function kids(e) { return e.children.length ? e.children : [e]; }

  function words(e) {
    if (e.dataset.zgw) return e.querySelectorAll(".wd");
    e.dataset.zgw = 1;
    e.innerHTML = e.textContent.trim().split(/\s+/)
      .map(function (x) { return '<span class="wd">' + x + "</span>"; }).join(" ");
    return e.querySelectorAll(".wd");
  }
  function chars(e) {
    if (e.dataset.zgc) return e.querySelectorAll(".ch");
    e.dataset.zgc = 1;
    e.innerHTML = e.textContent.split("").map(function (c) {
      return c === " " ? '<span class="sp"></span>' : '<span class="ch">' + c + "</span>";
    }).join("");
    return e.querySelectorAll(".ch");
  }

  /* soft pulse — ALWAYS at the end, once the element has landed */
  function pulse(el, at, dur) {
    if (!el || dur < 1) return;
    tl.to(el, { scale: PULSE, duration: 1.1, repeat: Math.max(1, Math.round(dur / 1.1)),
      yoyo: true, transformOrigin: "center", ease: E.move }, at);
  }

  /* GOMB-PULZÁLÁS — látványosabb: nagyobb lélegzet + zöld glow lüktet a
     dobozárnyékon. Feedback 2026-08-29: "legyen glowing vagy pulsating effect,
     minden gombon, jól látható." Nincs filter:blur, csak scale + box-shadow. */
  function btnPulse(el, at, dur) {
    if (!el || dur < 1) return;
    var reps = Math.max(1, Math.round(dur / 1.15));
    tl.to(el, { scale: 1.035, duration: 1.15, repeat: reps, yoyo: true,
      transformOrigin: "center", ease: E.move }, at);
    tl.fromTo(el, { boxShadow: "0 18px 44px -16px rgba(18,161,80,.45)" },
      { boxShadow: "0 24px 70px -8px rgba(18,161,80,.85), 0 0 0 6px rgba(18,161,80,.12)",
        duration: 1.15, repeat: reps, yoyo: true, ease: E.move }, at);
  }

  /* fromTo, never from: a mounted block is re-seeked every time its slot becomes
     visible, and tl.from() records its start state at registration, so on a
     seek-back it desyncs (hyperframes-core: "Prefer gsap.fromTo() over
     gsap.from()"). Every entrance below declares both ends explicitly. */
  var A = {
    kick:   function (e, at) { tl.fromTo(e, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: .55, ease: E.enter }, at); },
    fi:     function (e, at, d) { tl.fromTo(e, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: d || .7, ease: E.enter }, at); },
    /* OLVASÁSI IDŐ MINIMUMA — v1.7-ben ez már VALÓDI ellenőrzés.
       Eddig kiszámolta a szükséges időt, beleírta egy attribútumba, és senki
       nem nézte meg soha. Egy szabály, amit nem mér senki, nem szabály.
       A képlet: 0,5 mp elkapni a szemmel, plusz 0,4 mp szavanként elolvasni.
       Ha egy felirat kevesebb ideig van a képen, a néző NEM TUDJA VÉGIGOLVASNI,
       és ez nem ízlés kérdése, hanem mérhető hiba.
       A console.warn azért kell, mert a `hyperframes check` a konzolt olvassa,
       tehát innentől ez a rendszer többi hibájával egy helyen jelenik meg. */
    readable: function (e, at, d, v) {
      var words = (e.textContent || "").trim().split(/\s+/).filter(Boolean).length;
      e.dataset.readNeed = (0.5 + 0.4 * words).toFixed(1);
    },
    reveal: function (e, at) { tl.fromTo(kids(e), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .6, stagger: .12, ease: E.enter }, at); },
    rise:   function (e, at) { tl.fromTo(chars(e), { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, stagger: .045, ease: E.enter }, at); },
    fadewords: function (e, at, d) {
      var ws = words(e);
      tl.fromTo(ws, { opacity: 0 }, { opacity: 1, duration: .45, stagger: (d || 1.2) / Math.max(1, ws.length), ease: E.enter }, at);
    },
    /* emphasis word: blurry in, pulses blurry, FINISHES SHARP, then the rule draws */
    blurword: function (e, at, d) {
      d = d || 3; e.classList.add("glowword");
      tl.fromTo(e, { opacity: 0, filter: "blur(26px)", scale: .96 },
        { opacity: 1, filter: "blur(14px)", scale: 1, duration: .5, ease: E.enter }, at);
      tl.to(e, { filter: "blur(6px)", scale: PULSE, duration: .55, repeat: 2, yoyo: true, ease: E.move }, at + .5);
      tl.to(e, { filter: "blur(0px)", scale: 1, duration: .6, ease: E.enter }, at + 2.2);
      var u = e.parentNode.querySelector(".uln");
      if (u) tl.fromTo(u, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: .7, ease: E.enter }, at + 2.5);
    },
    pop:    function (e, at) { tl.fromTo(e, { scale: .3, opacity: 0, transformOrigin: "center" }, { scale: 1, opacity: 1, duration: .6, ease: E.pop }, at); },
    pops:   function (e, at) { tl.fromTo(kids(e), { scale: 0, opacity: 0, transformOrigin: "center" }, { scale: 1, opacity: 1, duration: .55, stagger: .18, ease: E.pop }, at); },
    draw:   function (e, at, d) { tl.fromTo(e, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d || .7, ease: E.move }, at); },
    gx:     function (e, at, d) { tl.fromTo(e, { scaleX: 0 }, { scaleX: 1, duration: d || .8, ease: E.enter }, at); },
    bars:   function (e, at) {
      var w0 = e.style.width || getComputedStyle(e).width;
      tl.fromTo(e, { width: 0 }, { width: w0, duration: 1, ease: E.enter }, at);
    },
    /* bar opening is always visible: grows from zero height */
    barsh:  function (e, at, d) { tl.fromTo(e, { scaleY: 0 }, { scaleY: 1, transformOrigin: "bottom", duration: d || 1.3, ease: E.enter }, at); },
    count:  function (e, at, d, v) {
      var o = { v: 0 }, t = n(v, 0), suf = e.dataset.suffix || "";
      tl.to(o, { v: t, duration: d || 1.8, ease: E_FILL, onUpdate: function () {
        e.textContent = Math.round(o.v) + suf;
      } }, at);
    },
    /* typing with a caret — "letters in progress" */
    type:   function (e, at, d, v) {
      var o = { i: 0 }, s = v || "", host = e;
      tl.add(function () { host.classList.add("on"); }, at);
      tl.to(o, { i: s.length, duration: d || 1.6, ease: "none", onUpdate: function () {
        host.innerHTML = s.slice(0, Math.round(o.i)) + '<span class="caret"></span>';
      } }, at);
      tl.add(function () { host.innerHTML = s; host.classList.remove("on"); }, at + (d || 1.6) + .35);
    },
    /* PROGRESS RING — starts EMPTY, grows a little every frame, ends full, then STOPS.
       v1.6: never trust pathLength. We measure the real circumference and animate in
       user units, so the ring can never snap to full (HF-v6-02, "megint csak beugrott").
       Ease is near-linear on purpose: a progress bar that eases-in looks like a jump. */
    ring:   function (e, at, d) {
      var C = ringLen(e), pct = n(e.dataset.pct, 100) / 100;
      tl.set(e, { strokeDasharray: C, strokeDashoffset: C }, 0);          /* empty from frame 0 */
      tl.to(e, { strokeDashoffset: C * (1 - pct), duration: d || 2.2, ease: E_FILL }, at);
    },
    /* PULSE RING — same size as its circle, only pulsing */
    pring:  function (e, at, d) {
      tl.to(e, { opacity: .6, duration: .4 }, at);
      pulse(e, at, d || 2.5);
    },
    orbit:  function (e, at, d) { tl.to(e, { rotation: 360, duration: 2.4, repeat: Math.max(1, Math.round((d || 3) / 2.4)), ease: "none", transformOrigin: "center" }, at); },
    travel: function (e, at, d, v) { tl.fromTo(e, { x: 0, opacity: 0 }, { x: n(v, 300), opacity: 1, duration: d || 1.2, ease: E.move }, at); },
    /* LENS — a real magnifier. The glass is NEVER empty: the current word rides
       along while travelling, and the next word swells in over it as the lens
       lands. Feedback 2026-08-29: "ne legyen üres a zoom-effect, imitálja a
       valódi zoom-ot." (Ez felülírja a régi v1.6 "blank while it travels" elvet.) */
    lens:   function (e, at, d) {
      var p = (e.dataset.path || "0,0").split(";").map(function (s) { return s.split(",").map(Number); }),
          txt = (e.dataset.words || "").split("|"),
          inner = e.querySelector(".lenstxt"), hold = 1.7;
      tl.set(e, { x: p[0][0], y: p[0][1] }, at);
      if (inner && txt[0]) tl.set(inner, { textContent: txt[0], opacity: 1, scale: 1 }, at);
      tl.fromTo(e, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .6, ease: E.pop }, at);
      if (inner) tl.fromTo(inner, { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, ease: E.enter }, at + .2);
      for (var i = 1; i < p.length; i++) {
        var t = at + 1.1 + (i - 1) * hold;
        tl.to(e, { x: p[i][0], y: p[i][1], duration: 1.0, ease: E.move }, t);
        if (inner && txt[i]) {
          /* the glass zooms out a touch mid-travel, swaps, then zooms back in */
          tl.to(inner, { scale: .8, duration: .5, ease: E.move }, t + .05);
          tl.set(inner, { textContent: txt[i] }, t + .52);
          tl.fromTo(inner, { scale: 1.35, opacity: .4 },
            { scale: 1, opacity: 1, duration: .55, ease: E.enter }, t + .52);
        }
      }
      tl.to(e, { opacity: 0, duration: .4, ease: E.exit }, at + (d || 5));
    },
    /* POP BUBBLE — a small card that swims in beside what is being pointed at,
       waits, then leaves. Always anchored to a thing on screen, never floating free. */
    popin:  function (e, at, d) {
      var dx = n(e.dataset.dx, 0), dy = n(e.dataset.dy, 26);
      tl.fromTo(e, { opacity: 0, x: "+=" + dx, y: "+=" + dy, scale: .92 },
        { opacity: 1, x: "-=" + dx, y: "-=" + dy, scale: 1, duration: .55, ease: E.pop }, at);
      if (d) tl.to(e, { opacity: 0, y: "-=18", duration: .35, ease: E.exit }, at + d);
    },
    /* UNFOLD — a tinted caption opens downward from its top edge, colour leads the
       eye. Feedback 2026-08-29 (LENS): "felül a tetején beúszott, unfold, színes". */
    unfold: function (e, at, d) {
      tl.fromTo(e, { opacity: 0, scaleY: 0, transformOrigin: "top center" },
        { opacity: 1, scaleY: 1, duration: .5, ease: E.pop }, at);
      tl.fromTo(e.children, { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: .4, stagger: .08, ease: E.enter }, at + .18);
      if (d) tl.to(e, { opacity: 0, y: -14, duration: .32, ease: E.exit }, at + d);
    },
    /* LINE CHART — draws left to right, each dot pops as the line reaches it, fine shake */
    chart:  function (e, at, d) {
      d = d || 2.6;
      var path = e.querySelector(".cline"), dots = e.querySelectorAll(".cdot"), stage = e.querySelector(".cstage");
      if (path) tl.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease: E.move }, at);
      for (var i = 0; i < dots.length; i++) {
        tl.fromTo(dots[i], { opacity: 0 }, { opacity: .35, duration: .3 }, at + .25 + (d - .5) * (i / Math.max(1, dots.length - 1)));
      }
      if (stage) tl.to(stage, { x: "+=3", y: "-=2", duration: .09, repeat: Math.round(d / .09), yoyo: true, ease: "none" }, at);

    },
    /* HIGHLIGHTER — a soft slanted band swipes in under the word, left to right */
    highlight: function (e, at, d) {
      var svg = e.querySelector("svg");
      if (svg) tl.fromTo(svg, { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: d || .8, ease: E.enter }, at);
      else tl.fromTo(e, { scaleX: 0 }, { scaleX: 1, duration: d || .8, ease: E.enter,
        transformOrigin: "left center" }, at);
    },
    /* CHART LEAD DOT — travels the polyline at constant speed, then stops and pulses */
    leaddot: function (e, at, d) {
      var poly = e.parentNode.querySelector(".cline");
      var dot = e.parentNode.querySelector(".ctrav");
      if (!poly || !dot) return;
      var pts = poly.getAttribute("points").trim().split(/\s+/).map(function (s) {
        var a = s.split(","); return { x: +a[0], y: +a[1] };
      });
      var segs = [], total = 0, i;
      for (i = 1; i < pts.length; i++) {
        var L = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        segs.push(L); total += L;
      }
      d = d || 2.6;
      tl.set(dot, { attr: { cx: pts[0].x, cy: pts[0].y }, opacity: 1 }, at);
      var t = at;
      for (i = 1; i < pts.length; i++) {
        var dur = d * (segs[i - 1] / total);
        tl.to(dot, { attr: { cx: pts[i].x, cy: pts[i].y }, duration: dur, ease: "none" }, t);
        t += dur;
      }
      pulse(dot, t + .1, 1.6);
    },
    dzoom:  function (e, at, d) {
      tl.fromTo(e, { scale: 1, x: 0, y: 0 },
        { scale: n(e.dataset.scale, 1.6), x: n(e.dataset.px, -180), y: n(e.dataset.py, -90),
          duration: d || 2.2, ease: E.move }, at);
    },
    cursor: function (e, at, d) {
      var p = (e.dataset.path || "0,0").split(";").map(function (s) { return s.split(",").map(Number); }),
          step = (d || 2.4) / Math.max(1, p.length - 1);
      tl.set(e, { x: p[0][0], y: p[0][1] }, at);
      for (var i = 1; i < p.length; i++) {
        tl.to(e, { x: p[i][0], y: p[i][1], duration: step, ease: E.move }, at + (i - 1) * step);
      }
    },
    /* mouse travels through N waypoints then "clicks" the last one.
       Feedback 2026-08-29 (FORM): a kurzor MÁR AZ ELEJÉN legyen ott, és vigye
       be az egeret a mezőre, mielőtt a gépelés indul. Több pont a path-ban:
       előbb a name mezőre, majd az email mezőre, végül a gombra. */
    click:  function (e, at, d) {
      var p = (e.dataset.path || "0,0").split(";").map(function (s) { return s.split(",").map(Number); });
      var seg = d || 1.1;
      tl.set(e, { x: p[0][0], y: p[0][1], opacity: 0 }, at);
      tl.to(e, { opacity: 1, duration: .3 }, at);
      for (var i = 1; i < p.length; i++) {
        tl.to(e, { x: p[i][0], y: p[i][1], duration: seg, ease: E.move }, at + .2 + (i - 1) * seg);
      }
      var endT = at + .2 + (p.length - 1) * seg;
      tl.to(e, { scale: .82, duration: .12, yoyo: true, repeat: 1, ease: E.exit }, endT);
    }
  };

  /* ---- auto patterns ---- */

  function autoArrow(g, s, d) {
    var cells = g.querySelectorAll(".icell"), line = g.querySelector(".arline"),
        head = g.querySelector(".arhead"), dot = g.querySelector(".tdot"),
        rings = g.querySelectorAll(".pring, .prsame");
    if (!cells.length) return;
    tl.fromTo(cells[0], { opacity: 0, scale: .82 }, { opacity: 1, scale: 1, duration: .7, ease: E.enter }, s + .25);
    if (line) A.draw(line, s + .9, .9);
    if (dot) A.travel(dot, s + .95, 1, n(dot.dataset.val, 300));
    if (head) A.draw(head, s + 1.7, .35);
    if (cells[1]) tl.fromTo(cells[1], { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .9, ease: E.enter }, s + 1.15);
    if (d >= 4) {
      for (var i = 0; i < rings.length; i++) A.pring(rings[i], s + 2.4, d - 3);
      pulse(cells[cells.length - 1].querySelector(".icon"), s + 2.4, d - 3);
    }
  }

  function autoRail(r, s, d) {
    var stops = r.querySelectorAll(".rstop"), segs = r.querySelectorAll(".rseg"),
        t0 = s + .3, step = Math.min(1.1, Math.max(.5, (d - 1.6) / Math.max(1, stops.length)));
    stops.forEach(function (st, i) { A.pop(st, t0 + i * step * 2); });
    segs.forEach(function (sg, i) {
      var f = sg.querySelector(".rfill"), b = sg.querySelector(".rbold");
      if (f) tl.fromTo(f, { scaleX: 0 }, { scaleX: 1, duration: step * 1.5, ease: E.move }, t0 + i * step * 2 + .4);
      if (b) tl.fromTo(b, { x: -160, opacity: 0 }, { x: sg.offsetWidth, opacity: 1, duration: step * 1.6, ease: E.move }, t0 + i * step * 2 + .4);
    });
    var last = stops[stops.length - 1];
    if (last) {
      var lt = t0 + (stops.length - 1) * step * 2 + .5;
      tl.add(function () { last.classList.add("on"); }, lt);
      pulse(last.querySelector(".rdot"), lt, d - (lt - s) - .4);
    }
  }

  function autoFlip(g, s, d) {
    var items = g.querySelectorAll(".flip");
    items.forEach(function (it, i) {
      var a = it.querySelector(".fa"), b = it.querySelector(".fb"), at = s + .5 + i * .75;
      tl.to(a, { opacity: 0, scale: .8, duration: .3, ease: E.exit }, at);
      tl.fromTo(b, { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .45, ease: E.pop }, at + .2);
      pulse(b, at + .7, 1.2);
    });
    var lastB = items.length ? items[items.length - 1].querySelector(".fb") : null;
    if (lastB && d >= 4) tl.to(lastB, { scale: 1.16, duration: d - 2.4, ease: E.enter }, s + 2.2);
  }

  /* SIGNATURE MOVE — the closing ring: draws shut, lands, breathes once. */
  A.signature = function (e, at, d) {
    var bar = e.parentNode.querySelector(".sigbar"), face = e.parentNode.querySelector(".sigface");
    if (face) tl.fromTo(face, { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: E.pop }, at);
    if (bar) {
      var C = ringLen(bar);
      tl.set(bar, { strokeDasharray: C, strokeDashoffset: C }, 0);
      tl.to(bar, { strokeDashoffset: 0, duration: d || 1.3, ease: E.move }, at + .3);
    }
    if (face) pulse(face, at + (d || 1.3) + .4, 1.6);
  };

  /* ===== v1.6 — the last archetype families ===== */

  /* GAUGE — a needle sweeps from the left stop to its value and settles. */
  A.gauge = function (e, at, d) {
    var arc = e.querySelector(".gaugebar"), nd = e.querySelector(".gneedle"),
        num = e.querySelector(".gnum"), pct = n(e.dataset.pct, 70) / 100;
    if (arc) {
      var C = ringLen(arc);
      tl.set(arc, { strokeDasharray: C, strokeDashoffset: C }, 0);
      /* az ív VÉGE és a mutató VÉGE ugyanoda mutasson: a fél-kör arány = pct.
         (feedback 2026-08-29, GAUGE: "nem ugyanoda mutatnak") */
      tl.to(arc, { strokeDashoffset: C * (1 - pct), duration: d || 1.8, ease: E_FILL }, at);
    }
    if (nd) tl.fromTo(nd, { rotation: -90, transformOrigin: "50% 100%" },
      { rotation: -90 + 180 * pct, duration: d || 1.8, ease: E_FILL }, at);
    if (num) A.count(num, at, d || 1.8, num.dataset.val);
  };

  /* CYCLE — the loop draws once round, then the active node lights up. No spinning. */
  A.cycle = function (e, at, d) {
    var ring = e.querySelector(".cycpath"), nodes = e.querySelectorAll(".cycnode");
    d = d || 2.2;
    if (ring) {
      var C = ringLen(ring);
      tl.set(ring, { strokeDasharray: C, strokeDashoffset: C }, 0);
      /* lineáris töltés, hogy a csomópont pontosan akkor gyúljon ki, amikor a
         kör odaér. Feedback 2026-08-29: "nincs olyan, hogy később tölt be." */
      tl.to(ring, { strokeDashoffset: 0, duration: d, ease: E_FILL }, at);
    }
    nodes.forEach(function (nd, i) {
      var t = at + d * (i / Math.max(1, nodes.length)) + .04;
      tl.fromTo(nd, { scale: .4, opacity: 0, transformOrigin: "center" },
        { scale: 1, opacity: 1, duration: .32, ease: E.pop }, t);
    });
    var last = nodes[nodes.length - 1];
    if (last) pulse(last, at + d + .3, 1.6);
  };

  /* FUNNEL — stages narrow downward, each one arrives after the one above it. */
  A.funnelin = function (e, at, d) {
    var st = e.querySelectorAll(".fnst"), step = Math.min(.55, (d || 2.4) / Math.max(1, st.length));
    st.forEach(function (s, i) {
      tl.fromTo(s, { opacity: 0, scaleX: .55, y: -18, transformOrigin: "center top" },
        { opacity: 1, scaleX: 1, y: 0, duration: .6, ease: E.enter }, at + i * step);
    });
    var last = st[st.length - 1];
    if (last) pulse(last, at + st.length * step + .3, 1.4);
  };

  /* KEYWORD ROUTER — one comment fans out to the keyword options. IF/ELSE, quiet.
     Feedback 2026-08-29: "router effect az elejére, valami nem túl harsány." */
  A.kroute = function (e, at, d) {
    var stem = e.querySelector(".krstem"), legs = e.querySelectorAll(".krleg"),
        pills = e.querySelectorAll(".krpill"), dot = e.querySelector(".krdot");
    d = d || 2.6;
    if (stem) A.draw(stem, at, .4);
    if (dot) {
      tl.set(dot, { opacity: 0, attr: { cy: 22 } }, at);
      tl.to(dot, { opacity: 1, duration: .16 }, at + .08);
      tl.to(dot, { attr: { cy: 70 }, duration: .34, ease: E.move }, at + .1);
      tl.to(dot, { opacity: 0, duration: .18 }, at + .46);
    }
    /* mint a 30 BRANCH: a láb 0-ról indul ÉS a doboz felé kivastagodik.
       Feedback 2026-08-29: "0-ról indít, és a szöveg dobozhoz érve kivastagodik." */
    legs.forEach(function (l, i) {
      var lt = at + .44 + i * .12;
      tl.fromTo(l, { strokeDashoffset: 1, strokeWidth: 2 },
        { strokeDashoffset: 0, strokeWidth: 7, duration: .6, ease: E.move }, lt);
    });
    pills.forEach(function (p, i) {
      tl.fromTo(p, { opacity: 0, y: -14, scale: .94 },
        { opacity: 1, y: 0, scale: 1, duration: .5, ease: E.pop }, at + .9 + i * .22);
    });
  };

  /* BRANCH — one line splits into two. Both legs draw, then the chosen leg lands. */
  A.branchin = function (e, at, d) {
    var stem = e.querySelector(".brstem"), legs = e.querySelectorAll(".brleg"),
        ends = e.querySelectorAll(".brend");
    d = d || 2.4;
    if (stem) A.draw(stem, at, .6);
    legs.forEach(function (l, i) { A.draw(l, at + .6 + i * .18, .7); });
    ends.forEach(function (n2, i) {
      tl.fromTo(n2, { opacity: 0, scale: .5, transformOrigin: "center" },
        { opacity: 1, scale: 1, duration: .5, ease: E.pop }, at + 1.3 + i * .25);
    });
    var win = e.querySelector(".brend.win");
    if (win) pulse(win, at + 2, Math.max(1.2, d - 2));
  };

  /* BEFORE / AFTER — a wipe line travels across and reveals the second state. */
  A.wipe = function (e, at, d) {
    var after = e.querySelector(".bafter"), bar = e.querySelector(".bawipe");
    d = d || 1.8;
    if (after) tl.fromTo(after, { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: d, ease: E.move }, at);
    if (bar) tl.fromTo(bar, { left: "0%", opacity: 0 },
      { left: "100%", opacity: 1, duration: d, ease: E.move }, at);
    if (bar) tl.to(bar, { opacity: 0, duration: .3 }, at + d);
  };

  /* GRID — many small cells arrive as a wave, never all at once. */
  A.gridin = function (e, at, d) {
    var cells = e.querySelectorAll(".gcell");
    tl.fromTo(cells, { opacity: 0, scale: .6, transformOrigin: "center" },
      { opacity: 1, scale: 1, duration: .45, ease: E.pop,
        stagger: { each: (d || 1.8) / Math.max(1, cells.length), from: "start" } }, at);
    var hot = e.querySelector(".gcell.on");
    if (hot) pulse(hot, at + (d || 1.8) + .3, 1.6);
  };

  /* ==========================================================================
     v1.7 — A RENDSZERSZINTŰ ELLENŐRZÉSEK
     Ezek nem animációk. Ezek MÉRÉSEK, amiket eddig ember végzett, rosszul.
     ========================================================================== */

  /* OLVASÁSI IDŐ AUDIT
     Végigmegy minden képre kerülő szövegen, kiszámolja, mennyi ideig kell
     olvasható maradnia, és összeveti azzal, ameddig ténylegesen a képen van.
     A `hyperframes check` a konzolt olvassa, tehát ez ott jelenik meg, a
     kontraszt- és tördelési hibák mellett. */
  var READ_SEL = ".sub,.scl,.tl,.prow,.qline,.qtext,.bnote,.gcap,.brend,.skcap,.leadr,.fnl-l";
  function auditReading(sec, s, d) {
    sec.querySelectorAll(READ_SEL).forEach(function (e) {
      var txt = (e.textContent || "").trim();
      if (!txt) return;
      var words = txt.split(/\s+/).filter(Boolean).length;
      var need = 0.5 + 0.4 * words;
      var at = n(e.dataset.at, 0);
      var onScreen = d - at - 0.32;                  /* a kimenet levonva */
      if (onScreen + 0.05 < need) {
        console.warn("[zg] OLVASHATATLAN " + sec.id + ": " + words + " szo, " +
          need.toFixed(1) + " mp kellene, " + onScreen.toFixed(1) + " mp van. \"" +
          txt.slice(0, 54) + "\"");
      }
    });
  }

  /* HOSSZ-TŰRÉS
     Angol és magyar kiadás megy ki. A magyar szöveg jellemzően 25-30 %-kal
     hosszabb az angolnál. Minden szövegdoboznak ki kell bírnia +30 %-ot
     törés nélkül. Ezt nem tudjuk lefuttatni a magyar szöveggel, mert az még
     nincs meg, de meg tudjuk mérni, mennyi HELY van a doboz szélén. */
  function auditLength(sec) {
    /* Tulajdonnevet NEM mérünk: az "Alex Rivers" magyarul is "Alex Rivers".
       A hossz-tűrés a FORDÍTANDÓ szövegre vonatkozik, nem minden szövegre. */
    sec.querySelectorAll(".scl,.tl,.brend,.fnl-l,.bnote,.gcap").forEach(function (e) {
      var host = e.parentElement;
      if (!host) return;
      var avail = host.clientWidth -
        (parseFloat(getComputedStyle(host).paddingLeft) || 0) -
        (parseFloat(getComputedStyle(host).paddingRight) || 0);
      if (avail < 40) return;
      /* nowrap elemnél a saját szélessége a szöveg szélessége */
      var txtW = e.getBoundingClientRect().width;
      if (txtW < 8) return;
      if (txtW * 1.3 > avail) {
        console.warn("[zg] SZUK DOBOZ " + sec.id + ": +30% hosszal kifolyna (" +
          Math.round(txtW) + "px szoveg, " + Math.round(avail) + "px hely). \"" +
          (e.textContent || "").trim().slice(0, 40) + "\"");
      }
    });
  }

  w.ZG = {
    PULSE: PULSE,
    E: E,
    dur: dur,
    cues: function () { return cues.slice().sort(function (a, b) { return a.t - b.t; }); },
    /* build(id) — the monolithic sampler / a whole document.
       buildIn(root, id) — one mounted archetype block, scoped to its own root.
       Both walk the same scene loop; only the DOM scope differs, so the motion
       a block ships is byte-identical to the motion the sampler approved. */
    build: function (id) { return this._run(null, id || "main"); },
    buildIn: function (root, id) { return this._run(root || null, id || "main"); },
    _run: function (scope, id) {
      var q = scope && scope.nodeType === 1 ? scope : document;
      cues = [];
      if (w.ZGT) w.ZGT.run(scope);   /* v1.7: írásjel-kultúra a mérés ELŐTT */
      if (w.ZGI) w.ZGI.paint(scope); /* v1.6: paint BEFORE measuring — geometry must be final */
      tl = gsap.timeline({ paused: true });
      q.querySelectorAll("section.clip").forEach(function (sec) {
        var s = n(sec.dataset.start, 0), d = n(sec.dataset.duration, 3), cam = sec.querySelector(".cam");
        /* intro settle, then the slow push. The push is its OWN fromTo starting
           AFTER the intro — two tweens on `scale` at the same position lazily
           capture conflicting start values under seek, which is exactly what
           made a mounted block drift bigger than the monolith. */
        tl.fromTo(cam, { opacity: 0, y: 44, scale: .97 }, { opacity: 1, y: 0, scale: 1, duration: .5, ease: E.enter }, s);
        tl.fromTo(cam, { scale: 1 }, { scale: 1.03, duration: Math.max(.1, d - .5), ease: E.move }, s + .5);
        tl.to(cam, { opacity: 0, y: -30, duration: .32, ease: E.exit }, s + Math.max(.34, d - .32));
        tl.set(cam, { opacity: 0 }, s + d);

        /* jelenet-belépő hangja: minden jelenet kap egy halk koppanást */
        cue("scene", s + .12);

        sec.querySelectorAll("[data-anim]").forEach(function (el) {
          var f = A[el.dataset.anim];
          if (f) f(el, s + n(el.dataset.at, 0), n(el.dataset.dur, 0) || undefined, el.dataset.val);
          if (el.dataset.cue) cue(el.dataset.cue, s + n(el.dataset.at, 0));
        });

        /* MOZGÁS-HIERARCHIA
           A `data-hero` elem a jelenet főszereplője. Utoljára érkezik, és
           lassabban, mint bárki más. Ha a főszereplő elsőnek érkezik és
           leggyorsabban, a szem a mellékszereplőkön köt ki, mert azok még
           mozognak, amikor ő már megállt. */
        var hero = sec.querySelector("[data-hero]");
        if (hero && d >= 3) {
          var ht = s + Math.min(d * .34, 1.5);
          tl.fromTo(hero, { opacity: 0, y: 30, scale: .96 },
            { opacity: 1, y: 0, scale: 1, duration: .82, ease: E.enter }, ht);
          cue("hero", ht);
        }

        /* VÉDJEGY-MOZDULAT — a bezáruló gyűrű, mint a film írásjele.
           Nem díszítés. A módszer LELKE: a jóváhagyás a végrehajtás elé kerül,
           a gyűrű nullából telik meg és MEGÁLL. Ugyanez a mozdulat fut le
           minden szakaszzáró jeleneten, a végkártyán és a logó körül.
           Öt videó után a néző a gyűrűről ismer rá a csatornára.
           Jelölés a jelenet-táblában: data-section-end a section elemen. */
        if (sec.hasAttribute("data-section-end")) {
          var w2 = sec.querySelector(".sigwrap");
          if (!w2) {
            w2 = document.createElement("div");
            w2.className = "sigwrap sig-auto";
            w2.setAttribute("data-layout-allow-overlap", "");
            w2.innerHTML =
              '<svg class="sigsvg" viewBox="0 0 210 210">' +
              '<circle class="sigtrack" cx="105" cy="105" r="96"/>' +
              '<circle class="sigbar" cx="105" cy="105" r="96"/></svg>' +
              '<div class="sigface"><span class="ico" data-icon="check"></span></div>';
            (sec.querySelector(".cam") || sec).appendChild(w2);
            if (w.ZGI) w.ZGI.paint(scope);
          }
          var st = s + Math.max(1.2, d - 2.2);
          A.signature(w2.querySelector(".sigbar"), st, 1.3);
          cue("ring", st + .3);
          cue("ringclose", st + 1.6);
        }

        auditReading(sec, s, d);
        auditLength(sec);

        /* A VÉDJEGY-PULZÁLÁS MINDEN GOMBON — nem csak ott, ahol data-pulse van.
           Feedback 2026-08-29 (FORM, END CARD): "minden gombon legyen a pulsating
           effect, ne csak itt, hanem az összes scene-en." */
        sec.querySelectorAll("[data-pulse]").forEach(function (e) {
          var t = n(e.dataset.pulse, 2); pulse(e, s + t, d - t - .4);
        });
        sec.querySelectorAll(".fbtn,.ecbtn,.cpill,.callout,.krpill,.appbtn")
          .forEach(function (b) {
            var land = Math.min(n(b.dataset.at, 0) + 1.2, d * 0.45);
            btnPulse(b, s + land, d - land - .4);
          });

        if (d >= 4) {
          sec.querySelectorAll(".arrow").forEach(function (g) { autoArrow(g, s, d); });
          sec.querySelectorAll(".rail").forEach(function (r) { autoRail(r, s, d); });
          sec.querySelectorAll(".flipgroup").forEach(function (g) { autoFlip(g, s, d); });
        } else {
          sec.querySelectorAll(".arrow").forEach(function (g) {
            tl.fromTo(g.querySelectorAll(".icell"), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .5, stagger: .18, ease: E.enter }, s + .2);
            var l = g.querySelector(".arline"), h = g.querySelector(".arhead");
            if (l) A.draw(l, s + .5, .4); if (h) A.draw(h, s + .85, .25);
          });
          sec.querySelectorAll(".rail").forEach(function (r) {
            tl.fromTo(r.querySelectorAll(".rstop"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .45, stagger: .12 }, s + .2);
            r.querySelectorAll(".rfill").forEach(function (f) { A.gx(f, s + .4, .6); });
          });
        }
      });
      if (w.ZGI) w.ZGI.paint(scope);
      w.__timelines = w.__timelines || {};
      w.__timelines[id || "main"] = tl;
      /* a hangvezérlő tábla kikerül az ablakra, hogy ki lehessen olvasni */
      w.__zgCues = w.ZG.cues();
      console.log("[zg] hang-jelek: " + w.__zgCues.length + " db, lasd SOUND.md");
      return tl;
    }
  };
})(window);
