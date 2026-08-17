/* zg-frames motion.js — the shared motion library.
   Rules encoded here come from _frames/MOTION.md + FEEDBACK-LOG.md.
   Videos load this file; they never redefine motion.
   Usage: <script src="motion.js"></script> then ZG.build("main");
   Markup contract: <section class="clip" data-start data-duration> > .cam
   Element opt-in: data-anim="name" data-at="s" data-dur="s" data-val="..." */
(function (w) {
  var PULSE = 1.02;            /* ±2% — Zoltan 2026-08-17, "finom" */
  var tl;

  function n(v, d) { v = parseFloat(v); return isNaN(v) ? d : v; }
  function kids(e) { return e.children.length ? e.children : [e]; }

  /* split text into per-word spans (natural reading rhythm) */
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

  /* soft pulse, always at the END of a scene once the element has landed */
  function pulse(el, at, dur) {
    if (!el || dur < 1) return;
    var reps = Math.max(1, Math.round(dur / 1.1));
    tl.to(el, { scale: PULSE, duration: 1.1, repeat: reps, yoyo: true,
      transformOrigin: "center", ease: "sine.inOut" }, at);
  }

  var A = {
    kick:   function (e, at) { tl.from(e, { opacity: 0, y: -16, duration: .55, ease: "power2.out" }, at); },
    fi:     function (e, at, d) { tl.from(e, { opacity: 0, y: 24, duration: d || .7, ease: "power2.out" }, at); },
    reveal: function (e, at) { tl.from(kids(e), { opacity: 0, y: 40, duration: .6, stagger: .12, ease: "power3.out" }, at); },
    rise:   function (e, at) { tl.from(chars(e), { yPercent: 120, opacity: 0, duration: .6, stagger: .045, ease: "power4.out" }, at); },
    /* phase 0 of the word treatment: words fade in one by one */
    fadewords: function (e, at, d) { tl.from(words(e), { opacity: 0, duration: .45, stagger: (d || 1.2) / Math.max(1, words(e).length), ease: "power2.out" }, at); },
    /* the emphasis word: starts blurry, pulses blurry, FINISHES SHARP, underline fades in */
    blurword: function (e, at, d) {
      d = d || 3;
      e.classList.add("glowword");
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
    barsh:  function (e, at) { tl.fromTo(e, { scaleY: 0 }, { scaleY: 1, transformOrigin: "bottom", duration: 1.1, ease: "power3.out" }, at); },
    count:  function (e, at, d, v) {
      var o = { v: 0 }, t = n(v, 0), dec = (t % 1 !== 0) ? 1 : 0;
      tl.to(o, { v: t, duration: d || 1.8, ease: "power1.out", onUpdate: function () {
        e.textContent = (e.dataset.suffix || "") ? o.v.toFixed(dec) + e.dataset.suffix : o.v.toFixed(dec);
      } }, at);
    },
    type:   function (e, at, d, v) {
      var o = { i: 0 }, s = v || "";
      tl.to(o, { i: s.length, duration: d || 1.4, ease: "none", onUpdate: function () {
        e.textContent = s.slice(0, Math.round(o.i));
      } }, at);
    },
    orbit:  function (e, at, d) { tl.to(e, { rotation: 360, duration: 2.4, repeat: Math.max(1, Math.round((d || 3) / 2.4)), ease: "none", transformOrigin: "center" }, at); },
    /* travelling dot along a horizontal line: data-val = px distance */
    travel: function (e, at, d, v) { tl.fromTo(e, { x: 0, opacity: 0 }, { x: n(v, 300), opacity: 1, duration: d || 1.2, ease: "power1.inOut" }, at); },
    /* lens: three phases from data-path="x,y;x,y;x,y" */
    lens:   function (e, at, d) {
      var p = (e.dataset.path || "0,0").split(";").map(function (s) { return s.split(",").map(Number); });
      tl.fromTo(e, { opacity: 0, scale: .6, x: p[0][0], y: p[0][1] },
        { opacity: 1, scale: 1, duration: .6, ease: "back.out(1.6)" }, at);
      for (var i = 1; i < p.length; i++) {
        tl.to(e, { x: p[i][0], y: p[i][1], duration: 1.1, ease: "power2.inOut" }, at + .8 + (i - 1) * 1.6);
      }
      tl.to(e, { opacity: 0, duration: .4, ease: "power2.in" }, at + (d || 5));
    },
    /* line chart: draws left to right, then a fine shake, green end dot */
    chart:  function (e, at, d) {
      var path = e.querySelector(".cline"), dot = e.querySelector(".cdot"), stage = e.querySelector(".cstage");
      if (path) tl.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d || 2.2, ease: "power1.inOut" }, at);
      if (dot) A.pop(dot, at + (d || 2.2) - .2);
      if (stage) tl.to(stage, { x: "+=3", y: "-=2", duration: .09, repeat: Math.round((d || 2.2) / .09), yoyo: true, ease: "none" }, at);
    },
    /* screencast: zoom + pan the mounted stage, cursor travels, lens follows */
    dzoom:  function (e, at, d) {
      var sc = n(e.dataset.scale, 1.6), x = n(e.dataset.px, -180), y = n(e.dataset.py, -90);
      tl.fromTo(e, { scale: 1, x: 0, y: 0 }, { scale: sc, x: x, y: y, duration: d || 2.2, ease: "power2.inOut" }, at);
    },
    cursor: function (e, at, d) {
      var p = (e.dataset.path || "0,0").split(";").map(function (s) { return s.split(",").map(Number); });
      tl.set(e, { x: p[0][0], y: p[0][1] }, at);
      for (var i = 1; i < p.length; i++) {
        tl.to(e, { x: p[i][0], y: p[i][1], duration: (d || 2.4) / (p.length - 1), ease: "power2.inOut" }, at + (i - 1) * ((d || 2.4) / (p.length - 1)));
      }
    }
  };

  /* ---- auto patterns: the operator writes markup, the library times it ---- */

  /* 3-phase icon build for any .arrow group:
     1 first icon fades + grows · 2 line fills L→R while 2nd icon fades in · 3 both full, soft pulse */
  function autoArrow(g, s, d) {
    var cells = g.querySelectorAll(".icell"), line = g.querySelector(".arline"),
        head = g.querySelector(".arhead"), dot = g.querySelector(".tdot"),
        rings = g.querySelectorAll(".pring");
    if (!cells.length) return;
    tl.fromTo(cells[0], { opacity: 0, scale: .82 }, { opacity: 1, scale: 1, duration: .7, ease: "power3.out" }, s + .25);
    if (line) A.draw(line, s + .9, .9);
    if (dot) A.travel(dot, s + .95, 1, n(dot.dataset.val, 300));
    if (head) A.draw(head, s + 1.7, .35);
    if (cells[1]) tl.fromTo(cells[1], { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .9, ease: "power2.out" }, s + 1.15);
    if (d >= 4) {
      for (var i = 0; i < rings.length; i++) {
        tl.to(rings[i], { opacity: .55, duration: .5 }, s + 2.4);
        pulse(rings[i], s + 2.4, d - 3);
      }
      pulse(cells[cells.length - 1].querySelector(".icon"), s + 2.4, d - 3);
    }
  }

  /* progress rail: fills segment by segment, dots land as the line arrives,
     a bold segment travels, last stop turns green and pulses when complete */
  function autoRail(r, s, d) {
    var stops = r.querySelectorAll(".rstop"), segs = r.querySelectorAll(".rseg"),
        t0 = s + .3, step = Math.min(1.1, Math.max(.5, (d - 1.6) / Math.max(1, stops.length)));
    stops.forEach(function (st, i) {
      A.pop(st, t0 + i * step * 2);
    });
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

  /* state flip (hand -> YES): each item swaps, the last one grows slowly */
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
        /* camera: in, ambient drift, out */
        tl.fromTo(cam, { opacity: 0, y: 44, scale: .97 }, { opacity: 1, y: 0, scale: 1, duration: .5, ease: "power3.out" }, s);
        tl.to(cam, { scale: 1.03, duration: d, ease: "sine.inOut" }, s);
        tl.to(cam, { opacity: 0, y: -30, duration: .32, ease: "power2.in" }, s + Math.max(.34, d - .32));
        tl.set(cam, { opacity: 0 }, s + d);

        /* explicit element animations */
        sec.querySelectorAll("[data-anim]").forEach(function (el) {
          var f = A[el.dataset.anim];
          if (f) f(el, s + n(el.dataset.at, 0), n(el.dataset.dur, 0) || undefined, el.dataset.val);
        });

        /* auto patterns — only on scenes with room (two speeds rule) */
        if (d >= 4) {
          sec.querySelectorAll(".arrow").forEach(function (g) { autoArrow(g, s, d); });
          sec.querySelectorAll(".rail").forEach(function (r) { autoRail(r, s, d); });
          sec.querySelectorAll(".flipgroup").forEach(function (g) { autoFlip(g, s, d); });
          sec.querySelectorAll("[data-pulse]").forEach(function (e) { pulse(e, s + n(e.dataset.pulse, 2), d - n(e.dataset.pulse, 2) - .4); });
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
