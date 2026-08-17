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
    /* PROGRESS RING — 0 to 100%, then it STOPS. Never a spinner. */
    ring:   function (e, at, d) {
      tl.fromTo(e, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d || 1.8, ease: "power2.inOut" }, at);
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
      if (inner) tl.fromTo(inner, { scale: .7, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: "power2.out" }, at + .2);
      for (var i = 1; i < p.length; i++) {
        var t = at + .9 + (i - 1) * hold;
        tl.to(e, { x: p[i][0], y: p[i][1], duration: .9, ease: "power2.inOut" }, t);
        if (inner && txt[i]) tl.set(inner, { textContent: txt[i] }, t + .9);
        if (inner && txt[i]) tl.fromTo(inner, { scale: .75 }, { scale: 1, duration: .4, ease: "power2.out" }, t + .9);
      }
      tl.to(e, { opacity: 0, duration: .4, ease: "power2.in" }, at + (d || 5));
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
      tl.fromTo(e, { scaleX: 0 }, { scaleX: 1, duration: d || .8, ease: "power2.out",
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

  w.ZG = {
    PULSE: PULSE,
    build: function (id) {
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
      w.__timelines = w.__timelines || {};
      w.__timelines[id || "main"] = tl;
      return tl;
    }
  };
})(window);
