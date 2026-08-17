---
version: 3.0
name: C2C Ownership — Frame (video / frame layer) · Zoltan Gero
description: >
  Rebuilt 2026-08-16 from the HeyGen reference render "Comment-to-Client: The Ownership Formula",
  which Zoltán named as the best of everything we have made. Light near-white ground with a faint
  grid, sentence-case Inter headings, blue as the lead and GREEN as the accent (the reference used
  orange; Zoltán dislikes orange, so every orange role becomes green). 100% light ground, zero dark scenes. Thin drawn line charts, tilted 3D device cards, building tables,
  annotation rings, and an app-style end card. Motion is out of scope — see ../MOTION.md.
unit: the frame — 1920×1080 primary; 9:16 and 1:1 documented
principle: atoms are sacred · composition is free · numbers come from the script

colors:
  bg:          "#f4f7fa"   # light ground, faint grid texture over it
  bg-white:    "#fdfefe"
  grid:        "rgba(26,115,232,0.05)"
  blue:        "#1a73e8"   # LEAD — headings, wordmark, icons, primary bar, links
  green:       "#22a75a"   # ACCENT — replaces the reference's orange, everywhere
    navy:        "#111d2e"   # display type on light
  label:       "#8a94a6"   # micro-labels, axis text, tracked caps
  muted:       "#5b6b86"
  card:        "#ffffff"
  ok:          "#16a34a"   # "Verified" pills
  shadow-card: "0 18px 44px rgba(17,29,46,0.10)"
  shadow-btn:  "0 8px 20px rgba(34,167,90,0.35)"

radii:
  card:   "16px"
  tile:   "12px"
  btn:    "8px"
  badge:  "6px"
  pill:   "100px"
  circle: "50%"

typography:
  # Inter only — 400 / 500 / 600 / 700 / 800.
  kicker:      { fontFamily: "Inter", px: 26, weight: 700, tracking: "0.22em", upper: true, color: "label" }
  hero:        { fontFamily: "Inter", px: 96,  weight: 700, lineHeight: 1.12, tracking: "-0.02em", color: "navy", case: "sentence" }
  hero-caps:   { fontFamily: "Inter", px: 104, weight: 800, tracking: "0.01em", upper: true, color: "blue" }
  display-word:   { fontFamily: "Inter", px: 132, weight: 800, upper: true, color: "green" }
  card-title:  { fontFamily: "Inter", px: 34,  weight: 700, color: "navy" }
  wordmark:    { fontFamily: "Inter", px: 62,  weight: 700, color: "blue" }
  domain:      { fontFamily: "Inter", px: 30,  weight: 600, color: "blue" }
  micro-label: { fontFamily: "Inter", px: 18,  weight: 600, tracking: "0.16em", upper: true, color: "label" }
  row:         { fontFamily: "Inter", px: 24,  weight: 500, color: "navy" }
  body:        { fontFamily: "Inter", px: 24,  weight: 400, lineHeight: 1.5, color: "muted" }
  btn:         { fontFamily: "Inter", px: 26,  weight: 700, color: "card" }

spacing:
  safe:      "140px"
  card-pad:  "34px"
  row-gap:   "14px"
---

# C2C Ownership — Frame

## The one change from the reference: NO ORANGE

The HeyGen render uses orange for every accent — the `OWN` burn, the second bar, the `PRIORITY`
badge, the `EXACTLY` annotation, the `Instant Access` button, the `ALGORITHM CHANGE` title.
**Zoltán dislikes orange** (recorded 2026-07-30, re-confirmed 2026-08-16). Every one of those roles
becomes **green `#22a75a`**. Nothing else about the reference changes.

Blue leads. Green accents. That is the whole colour system.

## The ground

**Light, by default:** `#f4f7fa` with a faint blue grid texture over it, ~64px pitch,
`rgba(26,115,232,0.05)`, and a soft near-white lift toward the centre. Objects float on it with
soft shadows.

**100% LIGHT. Zero dark scenes. No exceptions.** Decided 2026-08-16.

The HeyGen reference uses two near-black scenes for its product and data moments. **We do not.**
Zoltán's instruction is explicit: the ground stays light everywhere, from the first frame to the
last. What we take from the reference is its **motion**, not its darkness.

The two jobs those dark scenes did are handled on the light ground instead:

- **Product moments** — tilted device cards keep their perspective and depth, but sit on the light
  ground with a soft blue-tinted shadow instead of a glow on black.
- **Data moments** — the line chart draws in **blue** with a green end dot on the light ground.
  Cyan is not part of this palette; it only existed to survive a black background.
- **The burn word** loses its bloom and becomes a solid green word at display scale. Emphasis
  comes from size and colour, not from glow.

## Components

**card** — white, `radii.card`, `shadow-card`, no border. The workhorse.

**tilted device stack** - two cards in perspective, rotated 8-12 degrees, offset in depth: a narrow sidebar card behind, a wide Contact Details card in front, on the LIGHT ground with a soft blue-tinted shadow beneath.

**list card** — a card with a 4px blue left rule, a `card-title`, then rows separated by hairlines.
**One row is highlighted**: green 1.5px border, faint green fill, and a small green `PRIORITY`
badge on the right.

**lead card** — circular blue avatar with initials, name bold, role in `micro-label`, an
`ACTIVE LEAD` pill top-right, then labelled columns (`micro-label` over `row`). Carries the
annotation.

**annotation** — a hand-drawn mark that draws on: a thin ring circling a value, or a written word
(`EXACTLY`) in green. Slightly irregular, deliberately imperfect. **One per frame.**

**headline rings** — two thin open circles flanking a sentence-case headline, drawn on from the
outside in. Green.

**result tile** — white soft card, a glyph, an uppercase label (`COLD OUTREACH` / `QUALIFIED LEAD`).
Always a pair, negative left, positive right.

**bar pair** — two short rounded bars with `micro-label` beneath and a counting value above; blue
first, green second, green wins.

**line chart, light** — thin `label` axes, 3px blue stroke drawing left to right, green end dot.

**line chart, dramatic** - a vertical tracked-caps label at the left, a 3px BLUE stroke drawing across the LIGHT frame, then the display word lands beside it and the line turns green. REAL-TIME FEED in tiny tracked caps, top right.

**display word** - one word at display scale in solid green. Exactly ONE per film, on the light ground, for the single biggest idea. No glow, no bloom - size and colour carry it.

**building table** — a white card, header row in `micro-label`, then rows that arrive one by one:
avatar initials chip, name, email in `label`, and a green `Verified` pill. A green `VERIFIED ASSET`
badge sits top-right of the card. Rows never all appear at once.

**progress rail** — a thin line with `STEP 01 / STEP 02` stops, a blue dot travelling, the last
label green.

**app icon** — a blue rounded square, `radii.tile`, with a white chat glyph. The end-card mark.

**CTA button** — green, `radii.btn`, white 700 label with a trailing arrow, `shadow-btn`.
Pulses **softly** — never aggressively.

## The end card — this is what was different

The film closes on a **light** ground, centred, in this order, each element arriving in sequence:

```
        [app icon]              blue rounded square, chat glyph
     Comment-to-Client          wordmark, blue, 700
      commentclient.com         domain, blue, 600
       100% OWNERSHIP           micro-label, tracked caps, grey
    ( Instant Access → )        green button, softly pulsing
```

Nothing else on the frame. Generous air. The button is the only moving thing once the stack has
landed, and the ground keeps its ambient drift.

## Typography

**Sentence case for headings** (`You're already here`, `Audience Growth Analysis`). Uppercase is
for kickers, micro-labels, result labels, and the two-word statement pairs
(`VIEWS → LEADS`). Keywords stay caps: YES · GUIDE · ACTION · TRIGGER · BUY.
**Never "CRM" on screen.**

**Hero 96px, caps statement 104px, burn word 132px.** The burn word is the only thing allowed
above ~110px, and there is one per film. The repeated defect on this channel is an oversized
title — recorded 2026-07-30 and 2026-08-15.

**Emphasis: one word or one phrase per frame**, green. Solid colour only, never gradient-clipped,
because per-letter animation splits text into spans.

## The avatar

Composited **after** the render, as a transparent-background WebM.

**Shape: a CIRCLE.** Decided 2026-08-16. The HeyGen reference uses a plain rectangular cutout;
Zoltán wants the circular corner treatment instead, so the composite step applies a **circular
mask** and places it in a corner.

Everything else is untouched: never stretch it, never oval-ise it (a circle is round, not an
ellipse — keep the source aspect and crop square before masking), never veil or fade it, never
re-compress. HeyGen Video Agent is banned; the clip is generated in the app and composited
locally with ffmpeg.

## Layout

Centre-weighted. Kicker above, heading centred, the object beneath. Cards sit at 45–70% of frame
width. **Safe margin 140px on every side**, shadows included. One idea per frame.

## Do / Don't

**Do:** light ground with a faint grid · white cards with soft shadows · real UI · sentence-case
headings · blue leads, green accents · one annotation per frame · one display word per film ·
a light end card with a green CTA · a light ground on every single frame.

**Don't:** **orange, anywhere** · ANY dark scene, ever · cyan · garish overload ·
oversized headings · anything touching the edges · whole-sentence emphasis · outlines or ink
borders · gradients on type · "CRM" · "Studio" in a dashboard · dashes ("-") in the script or VO ·
a static hub-and-spoke diagram · a rectangular avatar cutout.

## ⚠️ No external Google Fonts `<link>`

On this machine the Google Fonts stylesheet never fires its load event and `check` / `render` hang
with a navigation timeout. Declare `font-family: "Inter", sans-serif`, add **no** `<link>` and
**no** `@import` — the compiler injects Inter locally.

## Reference frames — the ground truth

`C:\Users\gdp\Downloads\Comment-to-Client_ The Ownership Formula.mp4` (the HeyGen render, 2:46) —
**this is the target.** Plus `C2C_style_demo.mp4` and `C2C_motion_demo.mp4` in
`Documents\Claude\Projects\C2C — Comment-To-Client\`. When in doubt, pull frames with ffmpeg and
look, rather than guessing.

## Companions

`DESIGN.md` · `brand.css` · `../MOTION.md` · `../BLOCKS.md`
