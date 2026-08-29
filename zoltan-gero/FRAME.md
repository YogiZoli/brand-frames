<!-- ZG-CANON -->
> ## ⚠️ ELOSZOR OLVASD: a kanon
> A videogyartas egyetlen ervenyes leirasa:
> **`C:\Users\gdp\HyperFrames\_frames\PIPELINE.md`**
> (repo: github.com/YogiZoli/brand-frames)
>
> Mellette: `FEEDBACK-LOG.md` (Zoltan altalanos szabalyai, MINDEN videora),
> `MOTION.md`, `<csatorna>/FRAME.md`, `AUDIO.md`, `_feedback/` (a feedback
> egyetlen helye).
>
> **Ket szabaly mindent felulir:** (1) mi szoveget irunk, a HyperFrames gyart
> kockat - sajat motor TILOS; (2) a kep azt mutatja, amirol a hang beszel.
>
> Utkozes eseten: PIPELINE.md > skill > Drive doksi > projekt-utasitas > chat.
<!-- /ZG-CANON -->

---
version: 4.0
name: C2C Ownership — Frame (video / frame layer) · Zoltan Gero
description: >
  v4.0 (2026-08-29): a paletta es a betu mostantol a BRAND KANONBOL jon
  (C:\Users\gdp\projects\design-system\tokens.css + README.md). Azure #1E7CE8 vezet,
  zold #12A150 az akcentus, CTA #0E8542, betu Open Sans. Reszletek: BRAND-BRIDGE.md.
  Vilagos, majdnem feher ground halvany raccsal, sentence-case cimek, vekony rajzolt
  vonaldiagramok, dontott 3D eszkozkartyak, epulo tablak, annotacios gyuruk, app-stilusu
  vegkartya. 100% vilagos ground, nulla sotet jelenet. Mozgas kulon: ../MOTION.md.
unit: the frame — 1920×1080 primary; 9:16 and 1:1 documented
principle: atoms are sacred · composition is free · numbers come from the script

colors:
  # PALETTA = brand kanon. C:\Users\gdp\projects\design-system\tokens.css . tukor: ./tokens.css
  bg:          "#F6F8FC"   # --neutral-50, nem tiszta feher
  bg-white:    "#FFFFFF"
  grid:        "rgba(30,124,232,0.06)"
  blue:        "#1E7CE8"   # --brand-500  VEZET: cim, wordmark, ikon, sav, link
  green:       "#12A150"   # --accent-500 AKCENTUS: vonal, gyuru, kitoltes
  cta:         "#0E8542"   # --primary    gomb / CTA, feher szoveg ~4.7:1
  navy:        "#1E2733"   # --neutral-800 display + torzsszoveg
  label:       "#97A3B8"   # --neutral-400 micro-label, tengelyfelirat
  muted:       "#6A7688"   # --neutral-500
  card:        "#FFFFFF"    # --surface
  ok:          "#0B7A3E"   # --success  "Verified" pill
  shadow-card: "0 4px 10px rgba(14,32,56,.07), 0 26px 50px -18px rgba(14,32,56,.16)"
  shadow-btn:  "0 6px 20px rgba(18,161,80,0.30)"

radii:
  # kanon skala (6/10/12/16/24), video-kartya = egy lepes feljebb
  card:   "16px"
  tile:   "12px"
  btn:    "12px"
  badge:  "6px"
  pill:   "999px"
  circle: "50%"

typography:
  # Open Sans only — 400 / 500 / 600 / 700 / 800. Helyi @font-face (fonts/fonts.css), nincs <link>.
  kicker:      { fontFamily: "Open Sans", px: 26, weight: 700, tracking: "0.22em", upper: true, color: "label" }
  hero:        { fontFamily: "Open Sans", px: 96,  weight: 700, lineHeight: 1.12, tracking: "-0.02em", color: "navy", case: "sentence" }
  hero-caps:   { fontFamily: "Open Sans", px: 104, weight: 800, tracking: "0.01em", upper: true, color: "blue" }
  display-word:   { fontFamily: "Open Sans", px: 132, weight: 800, upper: true, color: "green" }
  card-title:  { fontFamily: "Open Sans", px: 34,  weight: 700, color: "navy" }
  wordmark:    { fontFamily: "Open Sans", px: 62,  weight: 700, color: "blue" }
  domain:      { fontFamily: "Open Sans", px: 30,  weight: 600, color: "blue" }
  micro-label: { fontFamily: "Open Sans", px: 18,  weight: 600, tracking: "0.16em", upper: true, color: "label" }
  row:         { fontFamily: "Open Sans", px: 24,  weight: 500, color: "navy" }
  body:        { fontFamily: "Open Sans", px: 24,  weight: 400, lineHeight: 1.5, color: "muted" }
  btn:         { fontFamily: "Open Sans", px: 26,  weight: 700, color: "card" }

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
becomes **green** (`#12A150` akcentus, `#0E8542` ha gomb). Nothing else about the reference changes.

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

**NO shape treatment. Corrected 2026-08-24** (supersedes the old "CIRCLE" rule). The HeyGen
transparent-background WebM has a REAL native VP9 alpha channel that works; no colorkey is
needed (colorkey would eat into the black shirt). Decode with `-c:v libvpx-vp9` or the alpha
is lost.

BANNED: circular mask, crop, background swap, aspect distortion (stretch/oval), veil/fade,
re-compress. ALLOWED and REQUIRED: proportional downscale (`scale=800:-2`) because HeyGen's
smallest output is 720p, and fixed corner placement (`overlay=W-w-40:H-h-40`). Placement into
a fixed corner is positioning, not distortion. The composite maps the avatar's own audio; in
production the avatar is generated from the real VO, so lip-sync is automatic. Full recipe:
STATUS.md "AVATAR COMPOSITE — MEGOLDVA". HeyGen Video Agent stays banned (expensive
auto-composer); plain API avatar generation is the automated path — Claude generates, Zoltán
approves. (Corrected 2026-08-24: the old "no resize / size set at generation" claim was also
wrong — it is impossible below 720p.)

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

## Betu: Open Sans, helyi @font-face, NINCS Google Fonts `<link>`

A brand kanon betuje az Open Sans (`projects/design-system/FONTS.md`). Ezen a gepen a Google
Fonts stylesheet sosem tuzeli a load eventet, a `check` / `render` navigation timeouttal lefagy.
Ezert az 5 sulyu Open Sans .ttf a `fonts/` mappaban van, `fonts/fonts.css` `@font-face`-szel;
a `tokens.css` importalja. Declare `font-family: "Open Sans", sans-serif`, **NINCS** `<link>` es
**NINCS** kulso `@import` — a compiler build-idoben woff2-re tomoriti es beagyazza.

## Reference frames — the ground truth

`C:\Users\gdp\Downloads\Comment-to-Client_ The Ownership Formula.mp4` (the HeyGen render, 2:46) —
**this is the target.** Plus `C2C_style_demo.mp4` and `C2C_motion_demo.mp4` in
`Documents\Claude\Projects\C2C — Comment-To-Client\`. When in doubt, pull frames with ffmpeg and
look, rather than guessing.

## Companions

`DESIGN.md` · `brand.css` · `../MOTION.md` · `../BLOCKS.md`
