# DESIGN — Zoltan Gero channel design language (C2C Blue)

The channel's design brief. Recovered 2026-08-16 from the Comment-to-Client / Expansion Pack
project and re-written for the official HyperFrames engine. The old engine is gone; **this
language survives it.**

Four files, no overlap:

| File | Owns |
|---|---|
| `FRAME.md` | the atoms — palette, type ramp, spacing, components |
| `DESIGN.md` (this file) | the language — scene archetypes, motion vocabulary, what to avoid |
| `../MOTION.md` | the motion grammar — entry/exit, camera, stagger, tempo, anti-slideshow |
| `../BLOCKS.md` | our block set — which registry blocks we adopt and how we re-skin them |

## 0. North star

**Reference to match:** "Comment-to-Client: The Ownership Formula". Bright, big kinetic type,
dense punchy motion. Minimalist over garish — the benchmark is the restrained "Comment … below"
pill animation, not a particle storm.

**#1 rule: roughly 4× more scenes than feels natural.** Many short, punchy scenes. Never linger.
Keep the energy up the whole way. This is the same instruction as `MOTION.md`'s density target
(one motivated movement every 2.5–4 seconds, 4–5 overlapping layers per beat).

## 1. Motion vocabulary → the block that delivers it

The old engine shipped ten named helpers. Each maps to a registry block we adopt and re-skin
(`BLOCKS.md`). **Never hand-roll one of these — the registry already has it.**

| Verb | What it does | Adopt |
|---|---|---|
| `RISE` | kinetic per-letter / per-word reveal | `per-word-rise`, `bottom-up-letters` |
| `POP` / `POPS` | scale-in, single or staggered | `badge-pop`, `stagger-cascade`, `grid-card-assemble` |
| `DRAW` | SVG stroke draw — arrows, underlines, connectors, line graphs | `chart-story`, `mk-usage-arc`, `hw-underline` |
| `COUNT` | a number counts up from 0 | `count-up`, `number-wheel` |
| `BARGROW` | a bar grows from 0, badge pops at the end | `mk-progress-stat`, `data-chart` |
| `ZOOM` | a magnifier glides over a detail while text appears | `focus-rack`, `pull-back-reveal` |
| `GLOW` | a pulsing emphasis on ONE key word | `inline-highlight`, `mk-callout-highlight` |
| `ORBIT` | persona icons circling a centre | `stagger-lattice`, `logo-wall` |
| `TYPE` | typing / fill animation in a form | `code-typing`, `notes-typing`, `typed-prompt` |
| `SEQ` | end-card elements in sequence, CTA pulsing **softly** | `cta-close`, `social-proof-card` |

**`BARGROW` carries a recorded defect** (2026-07-30): the badge must stay centred over its bar and
must **never overflow the frame or collide with the kicker.** Keep bars shorter and add top
spacing.

## 2. Scene archetypes

Keep, from the bright engine: the hero kinetic statement · "VIEWS → LEADS / OWN" (words fade in,
arrow motion, OWN glows) · YES pills · the **funnel** (COLD biggest, WARM mid, HOT smallest) ·
**counter bars with an end badge** · **orbiting personas** · the **sequential end card**
(app icon + title + pill + green button, softly pulsing).

Keep, from the earlier build he liked: the branch **"DIFFERENT PAGES"** · the split
**"NOT LIKE COLD EMAIL"** · the minimalist **"Comment … below" pill** · the **detailed lead card
with a moving ZOOM** · the **GoHighLevel form with typing**.

Naming rule inside a dashboard mock: the brand is **"GoHighLevel"**, never "Studio". Dashboards
stay fully on screen — no edge overflow. (Public *spoken* copy stays platform-independent; this
rule is about on-screen dashboard mocks only.)

## 3. AVOID — the list, unchanged

- **Dark scenes.** This is a bright channel.
- Garish or colourful overload.
- **Oversized title.** Recorded three times now: 2026-07-30, and again 2026-08-15. Max 128–132px.
- Elements touching the edges. Minimum ~140px safe margin.
- **Whole-sentence emphasis.** Exactly one word per sentence, bold + blue.
- The static hub-and-spoke "Unified Content Dashboard" — it felt static and disconnected from the VO.
- **The word "CRM"** on screen or in the script.
- **Dashes ("-") in the script or VO** — they read badly in TTS.
- **Orange**, anywhere. The accent is green.

## 4. HeyGen avatar — composited AS-IS

Added last, only after the motion graphics are approved.

**The clip is a transparent-background WebM, composited exactly as received, with ZERO
modification.** Never stretch it, never oval-ise it, never veil or fade it, never re-compress,
crop, or mask it. Overlay as-is.

**HeyGen Video Agent is banned** — the avatar clip is generated in the app and composited locally
with ffmpeg.

> ⚠️ This contradicts the current `create-video` skill, which still says "circular mask, corner
> placement". **The skill is wrong and must be corrected** — no mask, no crop, no oval.

## 5. Technical notes that keep renders working

- **Animate transforms only** — `x` / `y` / `scale` / `opacity`. Never layout properties
  (`width`, `letterSpacing`); use `scaleX` instead where a stretch is wanted.
- **Per-letter kinetic text needs solid colours.** Gradient-clipped text goes invisible the moment
  it is split into spans.
- **No external Google Fonts `<link>`.** On this machine it never fires the load event and
  `check` / `render` hang with a navigation timeout. The compiler injects Inter locally. This bit
  us again on 2026-08-15.
- **Always render to a NEW timestamped filename** — `<slug>_vN_YYYY-MM-DD_HHMM.mp4`. Overwriting
  the same name means the player serves a cached copy and you review the previous render.
- Run `npx hyperframes check` before every render, and fix what it reports.
- Scene timing follows the **word-count proportion of the voiceover**, from the Scribe word-level
  transcript. The audio is the clock.
