---
version: 1.0
name: C2C Blue — Frame (video / frame layer) · Zoltan Gero
description: >
  The Comment-to-Client / Expansion Pack look, rebuilt from the reference footage on 2026-08-16.
  NOT a re-skin of Blue Professional — that pack is quiet and corporate; this one is bright,
  centred and kinetic. A near-white cool ground with soft blurred pastel blooms, thin grey corner
  crop marks as permanent chrome, one huge centred Inter 800 statement per frame with exactly ONE
  word in blue or green, solid rounded bars with soft shadows, and white cards for UI mocks.
  Motion is out of scope — see ../MOTION.md.
unit: the frame — 1920×1080 primary; 9:16 and 1:1 documented
principle: atoms are sacred · composition is free · numbers come from the script

colors:
  bg:          "#eef3f7"   # cool near-white; lifts almost to white at centre
  bg-white:    "#fbfdfe"   # the centre of the radial lift
  blue:        "#1a73e8"   # lead — emphasis words, kickers, the COLD bar, links
  blue-deep:   "#1557b0"   # pressed/darker states only
  navy:        "#0e2038"   # display type and the HOT bar
  green:       "#34a853"   # the single accent — ONE per frame
  muted:       "#5b6b86"   # sub-lines, captions, secondary labels
  card:        "#ffffff"   # UI mock cards
  bloom-blue:  "rgba(26,115,232,0.14)"
  bloom-green: "rgba(52,168,83,0.12)"
  crop-mark:   "rgba(91,107,134,0.34)"
  shadow-soft: "0 8px 28px rgba(14,32,56,0.10)"
  shadow-bar:  "0 6px 18px rgba(14,32,56,0.14)"

radii:
  bar:    "10px"
  card:   "12px"
  chip:   "8px"
  pill:   "100px"
  circle: "50%"

typography:
  # Inter only. 400 / 600 / 700 / 800. Never another family.
  kicker:     { fontFamily: "Inter", px: 44, weight: 800, tracking: "0.18em", upper: true, color: "blue" }
  hero:       { fontFamily: "Inter", px: 130, weight: 800, lineHeight: 1.02, tracking: "-0.02em", color: "navy" }
  hero-sm:    { fontFamily: "Inter", px: 92,  weight: 800, lineHeight: 1.05, tracking: "-0.02em", color: "navy" }
  statement:  { fontFamily: "Inter", px: 72,  weight: 700, lineHeight: 1.15, color: "navy" }
  subtitle:   { fontFamily: "Inter", px: 52,  weight: 600, lineHeight: 1.3,  color: "muted" }
  body:       { fontFamily: "Inter", px: 34,  weight: 400, lineHeight: 1.5,  color: "muted" }
  bar-label:  { fontFamily: "Inter", px: 46,  weight: 800, upper: true, color: "card" }
  bar-note:   { fontFamily: "Inter", px: 30,  weight: 500, color: "card" }
  card-label: { fontFamily: "Inter", px: 22,  weight: 600, tracking: "0.06em", upper: true, color: "muted" }
  card-value: { fontFamily: "Inter", px: 30,  weight: 500, color: "navy" }
  chip:       { fontFamily: "Inter", px: 30,  weight: 700, color: "card" }

spacing:
  safe:        "140px"     # NOTHING crosses this line, ever
  crop-inset:  "56px"      # the corner marks sit here
  stack-gap:   "36px"
  bar-gap:     "22px"
---

# C2C Blue — Frame

## What this pack is, and what it is not

Rebuilt on 2026-08-16 from frames of the Expansion Pack render — the look Zoltán asked to have
back. An earlier attempt re-based *Blue Professional* onto these hex values and it read as the
same pack in a new colour, because the bones were wrong. **Blue Professional is a quiet corporate
system of tinted cards; C2C is bright, centred and kinetic.** The palette was never the difference.

Five things carry the identity, in order of importance:

1. **A soft, luminous ground** — near-white in the centre, cool blue-grey at the edges, with two
   or three large, heavily blurred pastel blooms drifting behind everything. It is never flat.
2. **Corner crop marks** — thin grey L-brackets in all four corners, present on every frame.
   This is the permanent chrome and the thing that crosses every scene boundary.
3. **One huge centred statement per frame**, Inter 800, navy — with **exactly one word** in blue
   or green. Never two emphasised words, never a whole emphasised sentence.
4. **A blue kicker above it** — uppercase, wide tracking, bold, small.
5. **Solid rounded bars and white cards with soft shadows.** This pack *does* use shadows, softly.
   It has no outlines, no ink borders, no hard offsets.

## The ground

```css
background:
  radial-gradient(58% 46% at 50% 34%, #fbfdfe 0%, #eef3f7 62%),
  #eef3f7;
```

Over it, two or three blurred blooms — `filter: blur(90px)`, 30–46cqw across, one
`bloom-blue`, one `bloom-green`, optionally a third blue at low opacity. They drift slowly and
never stop (see `../MOTION.md`, rule 1). No hard-edged shape ever touches the background.

**Never a dark scene.** This is a bright channel, always.

## Corner crop marks — the permanent chrome

Four L-shaped brackets, `crop-mark` colour, 2px stroke, arms ~64px, inset `crop-inset` (56px) from
each corner. They appear once at the start of the film and **never leave**. Nothing else is
permanent chrome — no topbar, no footer, no counter. The marks alone say "this is one film".

## Typography — Inter only

Sentence case for sentences. **Keywords always caps:** YES · GUIDE · ACTION · TRIGGER · BUY.
**Never the word "CRM" on screen.**

**KEEP THE TITLE SMALL — 130px hero, 92px secondary.** Recorded 2026-07-30 ("still too big at
150px+") and again 2026-08-15 on a test build ("kilóg és túl nagy"). This is the channel's single
most repeated defect. A headline that reaches the safe margin is already too big; step down.

**Emphasis: exactly ONE word per sentence.** Blue for an idea (`COLD EMAIL`, `CLIENT`), green for
an action or a payoff (`ACTION`, `NOTHING`). Solid colour only — never gradient-clipped, because
per-letter animation splits the text into spans and a clipped gradient goes invisible.

Kickers must be **clearly readable** — 44px, 800, 0.18em tracking, blue. Earlier versions were too
small.

Sub-lines are muted navy at 52px and **must never overlap or slide onto another element.**

## Components

**bar** — a solid rounded rectangle, `radii.bar`, `shadow-bar`, label left in white 800, note right
in white 500. Used for the funnel: **COLD widest (blue) · WARM middle (green) · HOT narrowest
(navy)**. Bars are centred as a stack, each narrower than the one above.

**card** — white, `radii.card`, `shadow-soft`, no border. Holds UI mocks: a small blue square +
`GoHighLevel · Contact Details` label, then field rows (uppercase muted label above a bordered
input), and a green primary button. **Any dashboard brand name is "GoHighLevel", never "Studio",**
and a dashboard is never allowed to overflow the frame.

**chip** — near-black rounded rectangle, white 700 text, `radii.chip`. The `Comment` chip is the
canonical one; it is the origin point that connectors draw from.

**connector** — a 2px curved SVG path that draws on, blue on one branch and green on the other.
Used for the `Comment → GUIDE / ACTION` split.

**arrow** — a green horizontal arrow between two words (`COMMENT → CLIENT`), drawn, never faded in.

**ring** — a thin green circle drawn around a word to mark it, hand-annotation style.

## Layout

**Centre-weighted, always.** Kicker above, hero centred, sub-line below. Bars and cards centre as
a group. Left-alignment is the exception, not the default.

**Safe margin 140px on every side.** No element may cross it — not a bar, not a badge, not a
shadow. `BARGROW` badges must stay centred over their bar and must never collide with the kicker
(recorded defect, 2026-07-30): keep bars shorter and add top spacing.

**One idea per frame.** No clutter. If a frame needs two ideas, it needs to be two frames — and
per `DESIGN.md` the pace wants roughly 4× more frames than feels natural anyway.

## Do / Don't

**Do:** one centred statement · one emphasised word · a blue kicker · a soft luminous ground ·
crop marks on every frame · solid bars with soft shadows · white cards for UI · generous air.

**Don't:** dark scenes · garish overload · oversized titles · anything touching the edges ·
whole-sentence emphasis · **orange, anywhere** · gradients on type · hard outlines or ink borders ·
the word "CRM" · dashes ("-") in the script or VO · a static hub-and-spoke diagram.

## ⚠️ No external Google Fonts `<link>`

On this machine the Google Fonts stylesheet never fires its load event and `check` / `render` hang
with a navigation timeout. Diagnosed in the C2C project, hit again 2026-08-15. Declare
`font-family: "Inter", sans-serif` and add **no** `<link>` and **no** `@import` — the HyperFrames
compiler injects Inter locally from its own cache.

## Companions

`DESIGN.md` — scene archetypes, the motion vocabulary and its registry blocks, the AVOID list.
`brand.css` — the token bridge that re-skins any registry block to this pack.
`../MOTION.md` — the motion system, frame-independent.
`../BLOCKS.md` — which registry blocks we adopt, and how.
