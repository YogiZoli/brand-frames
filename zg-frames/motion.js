/* zg-frames motion.js v1.1 — the shared motion library.
   Rules encoded here come from _frames/MOTION.md + FEEDBACK-LOG.md.
   Videos load this file; they never redefine motion.
   Usage: <script src="motion.js"></script> then ZG.build("main");
   Markup: <section class="clip" data-start data-duration> > .cam
   Opt-in:  data-anim="name" data-at="s" data-dur="s" data-val="..." */
(function (w) {
  var PULSE = 1.02;              /* ±2% — "finom", 2026-08-17 */
  var tl;

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
      yoyo: true, transformOrigin: "center", ease: "sine.inOut" }, at);
  }

  var A = {
    kick:   function (e, at) { tl.from(e, { opacity: 0, y: -16, duration: .55, ease: "power2.out" }, at); },
    fi:     function (e, at, d) { tl.from(e, { opacity: 0, y: 24, duration: d || .7, ease: "power2.out" }, at); },
    /* reading-time floor: 0.5s + 0.4s per word. Warns if a caption cannot be read. */
    readable: function (e, at, d, v) {
      var w = (e.textContent || "").trim().split(/\s+/).length, need = .5 + .4 * w;
      e.dataset.readNeed = need.toFixed(1);
    },
    reveal: function (e, at) { tl.from(kids(e), { opacity: 0, y: 40, duration: .6, stagger: .12, ease: "power3.out" }, at); },
    rise:   function (e, at) { tl.from(chars(e), { yPercent: 120, opacity: 0, duration: .6, stagger: .045, ease: "power4.out" }, at); },
    fadewords: function (e, at, d) {
      var ws = words(e);
      tl.from(ws, { opacity: 0, duration: .45, stagger: (d || 1.2) / Math.max(1, ws.length), ease: "power2.out" }, at);
    },
    /* emphasis word: blurry in, pulses blurry, FINISHES SHARP, then the rule draws */
    blurword: function (e, at, d) {
      d = d || 3; e.classList.add("glowword");
      tl.fromTo(e, { opacity: 0, filter: "blur(26px)", scale: .96 },
        { opacity: 1, filter: "blur(14px)", scale: 1, duration: .5, ease: "power2.out" }, at);
      tl.to(e, { filter: "blur(6px)", scale: PULSE, duration: .55, repeat: 2, yoyo: true, ease: "sine.inOut" }, at + .5);
      tl.to(e, { filter: "blur(0px)", scale: 1, duration: .6, ease: "power2.out" }, at + 2.2);
      var u = e.parentNode.querySelector(".uln");
      if (u) tl.fromTo(u, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: .7, ease: "power3.out" }, at + 2.5);
    },
    pop:    function (e, at) { tl.fromTo(e, { scale: .3, opacity: 0, transformOrigin: "center" }, { scale: 1, opacity: 1, duration: .6, ease: "back.out(1.7)" }, at); },
    pops:   function (e, at) { tl.fromTo(kids(e), { scale: 0, opacity: 0, transformOrigin: "center" }, { scale: 1, opacity: 1, duration: .55, stagger: .18, ease: "back.out(1.8)" }, at); },
    draw:   function (e, at, d) { tl.fromTo(e, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d || .7, ease: "power1.inOut" }, at); },
    gx:     function (e, at, d) { tl.fromTo(e, { scaleX: 0 }, { scaleX: 1, duration: d || .8, ease: "power3.out" }, at); },
    bars:   function (e, at) { tl.from(e, { width: 0, duration: 1, ease: "power3.out" }, at); },
    /* bar opening is always visible: grows from zero height */
    barsh:  function (e, at, d) { tl.fromTo(e, { scaleY: 0 }, { scaleY: 1, transformOrigin: "bottom", duration: d || 1.3, ease: "power3.out" }, at); },
    count:  function (e, at, d, v) {
      var o = { v: 0 }, t = n(v, 0), suf = e.dataset.suffix || "";
      tl.to(o, { v: t, duration: d || 1.8, ease: "power1.out", onUpdate: function () {
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
      tl.to(e, { strokeDashoffset: C * (1 - pct), duration: d || 2.2, ease: "power1.out" }, at);
    },
    /* PULSE RING — same size as its circle, only pulsing */
    pring:  function (e, at, d) {
      tl.to(e, { opacity: .6, duration: .4 }, at);
      pulse(e, at, d || 2.5);
    },
    orbit:  function (e, at, d) { tl.to(e, { rotation: 360, duration: 2.4, repeat: Math.max(1, Math.round((d || 3) / 2.4)), ease: "none", transformOrigin: "center" }, at); },
    travel: function (e, at, d, v) { tl.fromTo(e, { x: 0, opacity: 0 }, { x: n(v, 300), opacity: 1, duration: d || 1.2, ease: "power1.inOut" }, at); },
    /* LENS — never empty. Moves between targets and magnifies the letters inside. */
    lens:   function (e, at, d) {
      var p = (e.dataset.path || "0,0").split(";").map(function (s) { return s.split(",").map(Number); }),
          txt = (e.dataset.words || "").split("|"),
          inner = e.querySelector(".lenstxt"), hold = 1.5;
      tl.set(e, { x: p[0][0], y: p[0][1] }, at);
      if (inner && txt[0]) tl.set(inner, { textContent: txt[0] }, at);
      tl.fromTo(e, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .6, ease: "back.out(1.6)" }, at);
      if (inner) tl.fromTo(inner, { scale: .45, opacity: 0 }, { scale: 1, opacity: 1, duration: .8, ease: "power3.out" }, at + .2);
      /* v1.6 — the lens may NEVER show a word it is not standing on (HF-v6-05,
         "off szöveg"). While it travels the glass is blank; the new word appears
         only once the lens has landed. Blank glass in flight is honest; a wrong
         word in the glass is a lie about what is underneath. */
      for (var i = 1; i < p.length; i++) {
        var t = at + .9 + (i - 1) * hold;
        if (inner) tl.to(inner, { opacity: 0, scale: .5, duration: .28, ease: "power2.in" }, t - .18);
        tl.to(e, { x: p[i][0], y: p[i][1], duration: .9, ease: "power2.inOut" }, t);
        if (inner && txt[i]) {
          tl.set(inner, { textContent: txt[i] }, t + .78);
          tl.to(inner, { opacity: 1, scale: 1, duration: .55, ease: "power3.out" }, t + .78);
        }
      }
      tl.to(e, { opacity: 0, duration: .4, ease: "power2.in" }, at + (d || 5));
    },
    /* POP BUBBLE — a small card that swims in beside what is being pointed at,
       waits, then leaves. Always anchored to a thing on screen, never floating free. */
    popin:  function (e, at, d) {
      var dx = n(e.dataset.dx, 0), dy = n(e.dataset.dy, 26);
      tl.fromTo(e, { opacity: 0, x: "+=" + dx, y: "+=" + dy, scale: .92 },
        { opacity: 1, x: "-=" + dx, y: "-=" + dy, scale: 1, duration: .55, ease: "back.out(1.5)" }, at);
      if (d) tl.to(e, { opacity: 0, y: "-=18", duration: .35, ease: "power2.in" }, at + d);
    },
    /* LINE CHART — draws left to right, each dot pops as the line reaches it, fine shake */
    chart:  function (e, at, d) {
      d = d || 2.6;
      var path = e.querySelector(".cline"), dots = e.querySelectorAll(".cdot"), stage = e.querySelector(".cstage");
      if (path) tl.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease: "power1.inOut" }, at);
      for (var i = 0; i < dots.length; i++) {
        tl.fromTo(dots[i], { opacity: 0 }, { opacity: .35, duration: .3 }, at + .25 + (d - .5) * (i / Math.max(1, dots.length - 1)));
      }
      if (stage) tl.to(stage, { x: "+=3", y: "-=2", duration: .09, repeat: Math.round(d / .09), yoyo: true, ease: "none" }, at);

    },
    /* HIGHLIGHTER — a soft slanted band swipes in under the word, left to right */
    highlight: function (e, at, d) {
      var svg = e.querySelector("svg");
      if (svg) tl.fromTo(svg, { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: d || .8, ease: "power2.out" }, at);
      else tl.fromTo(e, { scaleX: 0 }, { scaleX: 1, duration: d || .8, ease: "power2.out",
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
          duration: d || 2.2, ease: "power2.inOut" }, at);
    },
    cursor: function (e, at, d) {
      var p = (e.dataset.path || "0,0").split(";").map(function (s) { return s.split(",").map(Number); }),
          step = (d || 2.4) / Math.max(1, p.length - 1);
      tl.set(e, { x: p[0][0], y: p[0][1] }, at);
      for (var i = 1; i < p.length; i++) {
        tl.to(e, { x: p[i][0], y: p[i][1], duration: step, ease: "power2.inOut" }, at + (i - 1) * step);
      }
    },
    /* mouse travels to a target then "clicks" */
    click:  function (e, at, d) {
      var p = (e.dataset.path || "0,0").split(";").map(function (s) { return s.split(",").map(Number); });
      tl.set(e, { x: p[0][0], y: p[0][1], opacity: 0 }, at);
      tl.to(e, { opacity: 1, duration: .3 }, at);
      tl.to(e, { x: p[1][0], y: p[1][1], duration: d || 1.1, ease: "power2.inOut" }, at + .2);
      tl.to(e, { scale: .8, duration: .12, yoyo: true, repeat: 1, ease: "power2.in" }, at + .2 + (d || 1.1));
    }
  };

  /* ---- auto patterns ---- */

  function autoArrow(g, s, d) {
    var cells = g.querySelectorAll(".icell"), line = g.querySelector(".arline"),
        head = g.querySelector(".arhead"), dot = g.querySelector(".tdot"),
        rings = g.querySelectorAll(".pring, .prsame");
    if (!cells.length) return;
    tl.fromTo(cells[0], { opacity: 0, scale: .82 }, { opacity: 1, scale: 1, duration: .7, ease: "power3.out" }, s + .25);
    if (line) A.draw(line, s + .9, .9);
    if (dot) A.travel(dot, s + .95, 1, n(dot.dataset.val, 300));
    if (head) A.draw(head, s + 1.7, .35);
    if (cells[1]) tl.fromTo(cells[1], { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .9, ease: "power2.out" }, s + 1.15);
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
      if (f) tl.fromTo(f, { scaleX: 0 }, { scaleX: 1, duration: step * 1.5, ease: "power2.inOut" }, t0 + i * step * 2 + .4);
      if (b) tl.fromTo(b, { x: -160, opacity: 0 }, { x: sg.offsetWidth, opacity: 1, duration: step * 1.6, ease: "power1.inOut" }, t0 + i * step * 2 + .4);
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
      tl.to(a, { opacity: 0, scale: .8, duration: .3, ease: "power2.in" }, at);
      tl.fromTo(b, { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .45, ease: "back.out(1.7)" }, at + .2);
      pulse(b, at + .7, 1.2);
    });
    var lastB = items.length ? items[items.length - 1].querySelector(".fb") : null;
    if (lastB && d >= 4) tl.to(lastB, { scale: 1.16, duration: d - 2.4, ease: "sine.out" }, s + 2.2);
  }

  /* SIGNATURE MOVE — the closing ring: draws shut, lands, breathes once. */
  A.signature = function (e, at, d) {
    var bar = e.parentNode.querySelector(".sigbar"), face = e.parentNode.querySelector(".sigface");
    if (face) tl.fromTo(face, { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: "back.out(1.7)" }, at);
    if (bar) {
      var C = ringLen(bar);
      tl.set(bar, { strokeDasharray: C, strokeDashoffset: C }, 0);
      tl.to(bar, { strokeDashoffset: 0, duration: d || 1.3, ease: "power2.inOut" }, at + .3);
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
      tl.to(arc, { strokeDashoffset: C * (1 - pct * .5), duration: d || 1.8, ease: "power1.out" }, at);
    }
    if (nd) tl.fromTo(nd, { rotation: -90, transformOrigin: "50% 100%" },
      { rotation: -90 + 180 * pct, duration: d || 1.8, ease: "power2.out" }, at);
    if (num) A.count(num, at, d || 1.8, num.dataset.val);
  };

  /* CYCLE — the loop draws once round, then the active node lights up. No spinning. */
  A.cycle = function (e, at, d) {
    var ring = e.querySelector(".cycpath"), nodes = e.querySelectorAll(".cycnode");
    d = d || 2.2;
    if (ring) {
      var C = ringLen(ring);
      tl.set(ring, { strokeDasharray: C, strokeDashoffset: C }, 0);
      tl.to(ring, { strokeDashoffset: 0, duration: d, ease: "power1.inOut" }, at);
    }
    nodes.forEach(function (nd, i) {
      var t = at + .2 + d * (i / Math.max(1, nodes.length));
      tl.fromTo(nd, { scale: .4, opacity: 0, transformOrigin: "center" },
        { scale: 1, opacity: 1, duration: .45, ease: "back.out(1.7)" }, t);
    });
    var last = nodes[nodes.length - 1];
    if (last) pulse(last, at + d + .3, 1.6);
  };

  /* FUNNEL — stages narrow downward, each one arrives after the one above it. */
  A.funnelin = function (e, at, d) {
    var st = e.querySelectorAll(".fnst"), step = Math.min(.55, (d || 2.4) / Math.max(1, st.length));
    st.forEach(function (s, i) {
      tl.fromTo(s, { opacity: 0, scaleX: .55, y: -18, transformOrigin: "center top" },
        { opacity: 1, scaleX: 1, y: 0, duration: .6, ease: "power3.out" }, at + i * step);
    });
    var last = st[st.length - 1];
    if (last) pulse(last, at + st.length * step + .3, 1.4);
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
        { opacity: 1, scale: 1, duration: .5, ease: "back.out(1.7)" }, at + 1.3 + i * .25);
    });
    var win = e.querySelector(".brend.win");
    if (win) pulse(win, at + 2, Math.max(1.2, d - 2));
  };

  /* BEFORE / AFTER — a wipe line travels across and reveals the second state. */
  A.wipe = function (e, at, d) {
    var after = e.querySelector(".bafter"), bar = e.querySelector(".bawipe");
    d = d || 1.8;
    if (after) tl.fromTo(after, { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: d, ease: "power2.inOut" }, at);
    if (bar) tl.fromTo(bar, { left: "0%", opacity: 0 },
      { left: "100%", opacity: 1, duration: d, ease: "power2.inOut" }, at);
    if (bar) tl.to(bar, { opacity: 0, duration: .3 }, at + d);
  };

  /* GRID — many small cells arrive as a wave, never all at once. */
  A.gridin = function (e, at, d) {
    var cells = e.querySelectorAll(".gcell");
    tl.fromTo(cells, { opacity: 0, scale: .6, transformOrigin: "center" },
      { opacity: 1, scale: 1, duration: .45, ease: "back.out(1.6)",
        stagger: { each: (d || 1.8) / Math.max(1, cells.length), from: "start" } }, at);
    var hot = e.querySelector(".gcell.on");
    if (hot) pulse(hot, at + (d || 1.8) + .3, 1.6);
  };

  w.ZG = {
    PULSE: PULSE,
    build: function (id) {
      if (w.ZGI) w.ZGI.paint();      /* v1.6: paint BEFORE measuring — geometry must be final */
      tl = gsap.timeline({ paused: true });
      document.querySelectorAll("section.clip").forEach(function (sec) {
        var s = n(sec.dataset.start, 0), d = n(sec.dataset.duration, 3), cam = sec.querySelector(".cam");
        tl.fromTo(cam, { opacity: 0, y: 44, scale: .97 }, { opacity: 1, y: 0, scale: 1, duration: .5, ease: "power3.out" }, s);
        tl.to(cam, { scale: 1.03, duration: d, ease: "sine.inOut" }, s);
        tl.to(cam, { opacity: 0, y: -30, duration: .32, ease: "power2.in" }, s + Math.max(.34, d - .32));
        tl.set(cam, { opacity: 0 }, s + d);

        sec.querySelectorAll("[data-anim]").forEach(function (el) {
          var f = A[el.dataset.anim];
          if (f) f(el, s + n(el.dataset.at, 0), n(el.dataset.dur, 0) || undefined, el.dataset.val);
        });

        if (d >= 4) {
          sec.querySelectorAll(".arrow").forEach(function (g) { autoArrow(g, s, d); });
          sec.querySelectorAll(".rail").forEach(function (r) { autoRail(r, s, d); });
          sec.querySelectorAll(".flipgroup").forEach(function (g) { autoFlip(g, s, d); });
          sec.querySelectorAll("[data-pulse]").forEach(function (e) {
            var t = n(e.dataset.pulse, 2); pulse(e, s + t, d - t - .4);
          });
        } else {
          sec.querySelectorAll(".arrow").forEach(function (g) {
            tl.from(g.querySelectorAll(".icell"), { opacity: 0, y: 26, duration: .5, stagger: .18, ease: "power3.out" }, s + .2);
            var l = g.querySelector(".arline"), h = g.querySelector(".arhead");
            if (l) A.draw(l, s + .5, .4); if (h) A.draw(h, s + .85, .25);
          });
          sec.querySelectorAll(".rail").forEach(function (r) {
            tl.from(r.querySelectorAll(".rstop"), { opacity: 0, y: 20, duration: .45, stagger: .12 }, s + .2);
            r.querySelectorAll(".rfill").forEach(function (f) { A.gx(f, s + .4, .6); });
          });
        }
      });
      if (w.ZGI) w.ZGI.paint();
      w.__timelines = w.__timelines || {};
      w.__timelines[id || "main"] = tl;
      return tl;
    }
  };
})(window);
