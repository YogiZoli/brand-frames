---
version: 2.0
name: C2C — Frame (video / frame layer) · Zoltan Gero
description: >
  The Comment-to-Client look, rebuilt 2026-08-16 from frames of the two local reference renders
  (C2C_style_demo.mp4 and C2C_motion_demo.mp4). Calm, bright, product-grade. A pale blue-grey
  gradient ground, generous air, and white cards with soft shadows carrying real UI. Headings are
  SENTENCE CASE and restrained in size; blue is the lead, green is the payoff, and a hand-drawn
  green ellipse or underline is the signature annotation. No orange, no dark scenes, no outlines.
  Motion is out of scope — see ../MOTION.md.
unit: the frame — 1920×1080 primary; 9:16 and 1:1 documented
principle: atoms are sacred · composition is free · numbers come from the script

colors:
  bg-top:      "#f7fafc"   # near-white, top-left of the ground gradient
  bg:          "#e8eef5"   # pale blue-grey, the body of the ground
  bg-tint:     "rgba(52,168,83,0.05)"   # faint green lift, top-left only
  blue:        "#1a73e8"   # lead — headings on cards, icons, the primary bar, links
  blue-soft:   "rgba(26,115,232,0.10)"  # active nav pill, tinted insets
  green:       "#22a75a"   # the payoff — positive values, the hand-drawn annotation, ✓
  navy:        "#111d2e"   # display and card headings
  label:       "#8a94a6"   # micro-labels and axis text
  muted:       "#5b6b86"   # sub-lines and body
  card:        "#ffffff"
  red:         "#dc2626"   # ✗ only, never as an accent
  shadow-card: "0 18px 44px rgba(17,29,46,0.10)"
  shadow-chip: "0 6px 16px rgba(17,29,46,0.10)"

radii:
  card:   "16px"
  tile:   "12px"
  input:  "8px"
  pill:   "100px"
  circle: "50%"

typography:
  # Inter only — 400 / 500 / 600 / 700. Never another family.
  kicker:      { fontFamily: "Inter", px: 30, weight: 700, tracking: "0.16em", upper: true, color: "blue" }
  micro-label: { fontFamily: "Inter", px: 20, weight: 600, tracking: "0.14em", upper: true, color: "label" }
  hero:        { fontFamily: "Inter", px: 92, weight: 700, lineHeight: 1.12, tracking: "-0.02em", color: "navy", case: "sentence" }
  hero-sm:     { fontFamily: "Inter", px: 68, weight: 700, lineHeight: 1.15, color: "navy", case: "sentence" }
  card-title:  { fontFamily: "Inter", px: 34, weight: 700, color: "navy" }
  card-lead:   { fontFamily: "Inter", px: 34, weight: 700, color: "blue" }
  stat-value:  { fontFamily: "Inter", px: 40, weight: 700, color: "navy" }
  stat-accent: { fontFamily: "Inter", px: 40, weight: 700, color: "blue" }
  value:       { fontFamily: "Inter", px: 26, weight: 600, color: "navy" }
  value-green: { fontFamily: "Inter", px: 26, weight: 700, color: "green" }
  body:        { fontFamily: "Inter", px: 24, weight: 400, lineHeight: 1.5, color: "muted" }

spacing:
  safe:      "140px"   # nothing crosses this line, ever
  card-pad:  "36px"
  stack-gap: "28px"
---

# C2C — Frame

## What this is

Rebuilt from the reference renders themselves, not from a description. Two earlier attempts
missed: one re-skinned Blue Professional (right colours, wrong bones), one over-corrected into
huge uppercase display type. **The real C2C is calm and product-grade.** Its authority comes from
looking like real software on a quiet ground, not from shouting.

Five things carry the identity:

1. **A pale blue-grey ground with a very soft light**, near-white toward the top-left, with the
   faintest green lift there. Never flat, never dark, never busy.
2. **White cards with a generous soft shadow** — 16px radius, no border — carrying *real* UI:
   dashboards, lead cards, forms, result tiles. This is the workhorse component.
3. **Sentence-case headings, restrained in size.** `Turn viewers into real leads`, not
   `TURN VIEWERS INTO REAL LEADS`.
4. **Blue leads, green pays off.** Blue for the subject, the icon, the primary bar. Green for the
   result — a positive value, `Warm to Hot`, `Client`, a ✓, the growing bar that wins.
5. **A hand-drawn green ellipse or underline** around the key phrase. This is the signature
   annotation and the one informal mark in the system.

## The ground

```css
background:
  radial-gradient(52% 44% at 22% 12%, rgba(52,168,83,0.05) 0%, transparent 60%),
  linear-gradient(158deg, #f7fafc 0%, #eef3f8 46%, #e8eef5 100%);
```

Nothing hard-edged ever touches it. It drifts almost imperceptibly and never fully stops
(`../MOTION.md`, rule 1). **Never a dark scene.**

## Components

**card** — white, `radii.card`, `shadow-card`, **no border**, `card-pad` inside. The container for
everything that is "the product".

**dashboard mock** — a card split into a left rail and a body. Rail: a small blue rounded-square
logo chip + wordmark, then nav rows; the active row is a `blue-soft` pill with blue text. Body: a
title, then a row of stat tiles — each tile a `micro-label` over a `stat-value`; a positive
delta uses `stat-accent` blue. **The brand name in any dashboard is "GoHighLevel", never "Studio"**
(the reference renders say Studio — that was corrected afterwards). A dashboard never overflows
the frame.

**inset panel** — inside a card, a 1.5px blue-bordered box on `blue-soft`, with a small green
status dot, a `micro-label`, a bold name and a grey quote line. This is the "new comment" object.

**lead card** — a circular blue avatar with white initials, name in `card-title`, role in `body`,
an `ACTIVE LEAD` pill top-right (`blue-soft` fill, blue text), and beneath it two labelled columns:
`micro-label` over `value`, where the temperature value is `value-green`.

**speech chip** — a green rounded chip with white 600 text and `shadow-chip`, used for a viewer's
line (`"How can I sign up?"`). It pops in near the card it belongs to.

**form card** — `card-lead` blue heading, a grey sub-line, then rows of `micro-label` over an
input: white, 1.5px `#e3e9f0` border, `radii.input`. Text types in character by character.
The primary button is **green**, full width, white 600 text.

**icon tile** — a white rounded square (`radii.tile`, `shadow-chip`) with a blue glyph, and a
`micro-label` centred beneath it. Two tiles connected by a drawing line is the canonical
"comment → revenue" pair; the second tile's glyph turns green.

**icon node** — a thin 2px circle (blue, or green once it resolves) with a glyph inside and a bold
label under it. Three of these in a row is the `Creator · YouTuber · Agency` set.

**result tile** — a white square card with a large ✗ (`red`) or ✓ (`green`) and an uppercase label
beneath. Always shown as a pair, negative left, positive right.

**bar pair** — two rounded bars side by side under a kicker: blue `Ad revenue` and green
`Real leads`, each with a bold value above (`0x` → `1x`, `0` → `100x`) that counts up as the bar
grows. The green one wins, visibly.

**line chart** — thin `label`-coloured axes, a 3px blue stroke that draws left to right, and a
green dot that lands at the end. No fill, no grid.

**progress rail** — a thin horizontal line with labelled stops: `Comment` → `Conversation` →
`Client`, a blue dot travelling along it, the final label in green.

**annotation** — a hand-drawn green ellipse, underline or swoosh that draws over the key phrase.
2–3px, slightly irregular, deliberately imperfect. **One per frame, never two.**

## Typography

**Sentence case for headings.** Uppercase is only for kickers, micro-labels and result-tile labels.
Keywords stay caps when they are literal keywords: YES · GUIDE · ACTION · TRIGGER · BUY.
**Never the word "CRM" on screen.**

**Keep the hero at 92px, secondary at 68px.** Recorded 2026-07-30 ("still too big at 150px+") and
again 2026-08-15. This is the channel's most repeated defect. In this pack the type is *smaller*
than instinct says, because the white cards and the air do the work.

**Emphasis: exactly one word or phrase per frame** — the green annotation, or a single green value.
Never a whole emphasised sentence. Solid colour only; never gradient-clipped, because per-letter
animation splits text into spans and a clipped gradient goes invisible.

## Layout

Centre-weighted. Kicker above, heading centred, the card or diagram beneath. Cards sit at roughly
45–65% of frame width — they are objects on a surface, not full-bleed panels.

**Safe margin 140px on every side**, shadows included. One idea per frame; if it needs two, it is
two frames, and `DESIGN.md` wants roughly 4× more frames than feels natural anyway.

## Do / Don't

**Do:** a quiet luminous ground · white cards with soft shadows · real UI · sentence-case headings ·
blue leads, green pays off · one hand-drawn green annotation · micro-labels in tracked uppercase
grey · generous air.

**Don't:** **orange, anywhere** · dark scenes · garish overload · oversized headings · anything
touching the edges · whole-sentence emphasis · outlines or ink borders · hard offset shadows ·
gradients on type · the word "CRM" · the word "Studio" in a dashboard · dashes ("-") in the script
or VO · a static hub-and-spoke diagram.

## ⚠️ No external Google Fonts `<link>`

On this machine the Google Fonts stylesheet never fires its load event and `check` / `render` hang
with a navigation timeout. Diagnosed in the C2C project, hit again 2026-08-15. Declare
`font-family: "Inter", sans-serif` and add **no** `<link>` and **no** `@import` — the compiler
injects Inter locally from its own cache.

## Companions

`DESIGN.md` — scene archetypes, motion vocabulary and its registry blocks, the AVOID list.
`brand.css` — the token bridge that re-skins any registry block to this pack.
`../MOTION.md` — the motion system, frame-independent.
`../BLOCKS.md` — which registry blocks we adopt, and how.

**Reference frames:** `C2C_style_demo.mp4` and `C2C_motion_demo.mp4` in
`Documents\Claude\Projects\C2C — Comment-To-Client\`. When in doubt, pull frames from these two
with ffmpeg and look — they are the ground truth for this pack.
