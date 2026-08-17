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

# MOTION — the motion system. Frame-independent, applies to every channel.

`FRAME.md` says how a video **looks**. It deliberately says nothing about movement.
This file says how a video **moves**. The two are orthogonal on purpose: whichever
frame pack is chosen — Capsule, Blue Professional, Creative Mode, navy, anything —
this motion system applies unchanged. Only colours, type and spacing come from
`FRAME.md`; timing, sequencing, camera and easing come from here.

**Sources.** This is a compression of the official material, not an invention:
`/hyperframes-animation` (atomic rules, blueprints, GSAP adapters),
`npx hyperframes catalog` (the registry blocks named below), and
https://hyperframes.heygen.com/prompting/motion (the eight premium-motion rules).
When this file and the official docs disagree, the official docs win — and this file
gets fixed.

**Why it exists.** The 2026-08-15 test video was rendered with no motion system, so the
composition fell back to a cautious "fade plus rise, staggered" default and read as
static. The verdict was: two to four times more motion. That is the gap this closes.

---

## Law 0 — registry before code

`npx hyperframes catalog` **before writing a single custom tween.** The catalogue is
~380 blocks and components; most of the motion below already exists as a component with
tokens. Custom GSAP is the last resort, not the first move. Writing a hand-rolled
timeline when `per-word-rise` and `push-in` exist is a violation of Law 1 of the
Canonical Guide, and it happened once already.

## Law 1 — every movement makes a claim

Movement means something whether or not it was intended. The question is never
"is this too static?" but **"what does this movement say, and is it true?"**

The test: name what a movement means in a sentence that ends.
*"The counter breathes because the number is still being received."*
If the sentence cannot be finished, cut the movement.

Four honest jobs cover almost everything:

| Job | Example |
|---|---|
| **Direct attention** | a highlight sweep lands on the word being spoken |
| **Carry continuity** | the camera travels from one idea to the next, one space |
| **Show change** | a value counts up; a diagram assembles; a route draws |
| **Express character** | the channel's temperament — calm, editorial, confident |

Anything doing none of these is decoration. **Decoration is what reads as cheap** —
smooth easing does not save it. Four decorative movements are worse than one motivated
one: they compete for the eye and none of them says anything.

**More motion is not the fix for a dead frame.** If a shot feels lifeless, find the one
thing that genuinely *is* changing and let that carry it. Do not set everything wobbling.

---

## 1. Entry and exit grammar

### Easing direction — non-negotiable

| Situation | Ease | Why |
|---|---|---|
| Entrance | `power2.out` / `power3.out` | it arrives: fast in, gentle settle |
| Exit | `power2.in` / `power3.in` | it departs: gentle start, decisive leave |
| On-screen move | `power2.inOut` | it travels between two rests |
| Impact (stamp, slam, hit) | `power4.in` / `expo.in` | an impact is an acceleration |
| Weighted arrival | `back.out(1.4–2.2)` | mass overshoots and settles back |
| Never | `linear` on an entrance | reads as a machine, not an object |

`ease: none` is correct in exactly one place: a continuous camera pass across a wide
world, where any easing would read as the world lurching.

### Compound properties — only when they tell one story

Two properties agreeing on one claim beat four properties each making a different one.
A card that **rises and fades in** says one thing: *this is arriving*. A card that rises,
rotates from 18°, scales from 0.8 and un-blurs from 14px makes four claims, and the
headline is an unreadable smear for most of its travel.

Default entrance for text and cards: **y + opacity only.** Add `scale` only when the
element genuinely has mass (a stamp, a pill, a badge). Add `blur` only when the idea is
literally focus — see `focus-blur-resolve`, `blur-in`.

Rotation on an entrance requires a reason that can be said out loud.

### Overshoot and follow-through

Overshoot is a claim about **mass**, and applies to **transforms only**.

- The thing overshoots and settles: `back.out(1.6)`, roughly 1.2–1.5× past target.
- The parts it drags — a shadow, a trailing panel, the housing — resolve **one frame
  later** (0.033s at 30fps), not with it. Perfectly synchronised follow-through is just
  a bigger single object.
- **A number never overshoots.** A counter that flies past its value and falls back has
  rendered a figure that was never true. On a real metric that is a lie with a frame
  count. `count-up`, `number-wheel`, `mk-progress-stat` all respect this.

### Exits

Most elements on a teaching channel should **not** exit individually. Either the camera
leaves them behind (better — see §2), or the whole scene hands over via one transition.
Individually fading out eight elements before a cut is eight movements that say nothing.

When an exit is needed: same direction as the entrance if the object is leaving the way
it came; upward with increasing blur (`blur-out-up`) for an airy hand-off; masked
line-swap (`line-swap`) when one line replaces another on the same beat.

### Registry first — entrances that already exist

`per-word-rise` · `staggered-fade-up` · `blur-in` · `bottom-up-letters` ·
`line-by-line-slide` · `per-word-crossfade` · `char-slam-explode` (impact) ·
`focus-blur-resolve` · `grid-card-assemble` · `stagger-cascade` · `stagger-lattice` ·
`text-stagger` · `logo-sting` · `badge-pop` · `number-pop-in`

---

## 2. The camera is an actor

**Every scene gets one continuous camera move.** Not because stillness looks cheap,
but because the move is what carries the **spatial relationship** between two moments.
Cut or cross-fade between two views and they read as two unrelated pictures; travel
between them and the viewer infers one continuous space for free.

### The default move

A **4–8% push-in** across the scene's full duration, eased gently, computed over a window
slightly **longer than the render** so it never decays to a dead stop at the scene end.
This is the cheapest premium signal available and it applies to every frame pack.

Registry: `push-in`, `drift-hold` (a card kept alive by loop-exact breathing and a slow
light sweep), `pull-back-reveal` (a tight detail that widens to recontextualise),
`pan-stations` (lateral travel with a dwell at each stop), `scroll-camera-story`,
`parallax-zoom` / `parallax-unzoom`, `focus-rack`.

### The trap

Translating the scene and translating the camera are the **same transform**. "The content
slid past a fixed frame" is not a static alternative — it is the same shot. If the brief
asks for stillness, the answer is genuine stillness plus ambient idle, not a slide.

### Depth planes

When there is a background, move each plane at a rate matching its distance:
far background ~0.2×, content 1.0×, foreground 3–6×.

The strongest depth cue is **not blur — it is occlusion.** One large, softly blurred
foreground element that actually crosses in front of the content proves there is space
between them. No amount of blur on an element that never overlaps can do that.
**Use exactly one such element.** A second stops reading as the room and starts reading
as decoration with a blur on it.

For a talking-head or screen-recording route, the footage is the content plane; the
frame's graphics sit in front of it and the texture (`grain-field`, `dynamic-grid`,
`yt-lcd-background`) sits behind.

---

## 3. Sequencing and stagger

### The ratio that matters

**Each offset must be clearly shorter than the animation it offsets.**
A small offset-to-duration ratio reads fluid; a large one reads deliberate; an offset
longer than the animation is no longer a stagger, it is a queue.

Working numbers for a 1920×1080 teaching video at 30fps:

| Element group | Item duration | Offset |
|---|---|---|
| Words in a headline | 0.45–0.60s | 0.05–0.09s |
| Bullet rows / list items | 0.50–0.70s | 0.10–0.16s |
| Cards in a grid | 0.55–0.75s | 0.08–0.14s |
| Diagram nodes along a path | 0.40–0.60s | 0.09–0.12s |
| Chapter title + subtitle | 0.6s / 0.5s | 0.18s |

### Overlapping action

**No two elements share a start time or an end time.** Begin the next element while the
last is still settling — at peak, several things should be in motion at once. A scene in
which every animation completes before the next begins is a slideshow inside one shot.

### Delay the supporting element, never the focal one

A focal element that waits reads as lag. The headline lands first; the rule, the chip,
the caption follow it.

### Stagger what is *happening*, not what is merely *present*

Things that **arrive in sequence** animate in sequence. Things that **already existed**
before the shot started appear together. Staggering the latter just makes the scene take
longer to assemble and says something untrue: a rollout propagates, so regions cannot go
live on the same frame — but the region *markers*, which were always there, all appear at
once.

Registry for orchestration: `beat-timeline` (pins titled beat rows to named labels on a
paused master timeline) — the natural spine for a narrated explainer whose beats come
from `BRIEF.md`.

---

## 4. Tempo

**Pace is a genre decision made before touching an ease.** A correctly animated scene at
the wrong tempo is the failure that most often survives review.

| Genre | Seconds per idea |
|---|---|
| Showreel / sting / Shorts | 1.1–2.0s, hard cuts, no dissolves |
| Product or feature tour | 2–4s |
| **Narrated teaching explainer (the channel default)** | **6–12s per beat, set by the audio** |
| Chapter or section title | 2.5–4s |
| Closing / CTA plate | 6–8s minimum, never clipped by the audio |

For a narrated video the **audio is the clock.** The approved mix defines every timestamp;
beats come from the word-level Scribe transcript, not from a designer's guess. Visuals
follow audio, never the reverse.

Two length rules learned the hard way: the closing plate must outlast the last spoken
word (3.2s was nearly clipped on the test video), and a beat that runs longer than about
12 seconds needs a second movement inside it — a count landing, a callout drawing, a
camera arriving — or the viewer's eye leaves.

---

## 5. Nothing ever fully stops

**A frozen final second is the single biggest cheap-motion tell**, and it is measurable:
the encoder produced 211KB for a frozen build against 2.5MB for the same content alive.

Never write "holds motionless". Write **"settles into a gentle ambient idle"**:

- 1–2% breathing scale on the hero element, loop-exact
- a slow drift on the background or grain field
- the camera's continuous push still running underneath
- one live element if the content justifies it — a cursor, a status dot on a 1s
  heartbeat, a caret

Registry: `drift-hold`, `grain-field`, `dynamic-grid`, `grain-overlay`.

**The exception is deliberate and named: a dwell.** During a hero moment the *camera*
may come to a genuine full stop for 1.5–2.5 seconds while the point lands. The camera
rests; the film does not. Counters keep ticking, labels keep stamping, ambient idle
continues. A dwell is a rest the piece resumes from — not a decayed settle, and not a
freeze.

---

## 6. When to reach for count-up and kinetic typography

Both are strong flavours. They earn their place when the **content is a number or a
word**, and they cheapen everything when used because a frame looked empty.

### Count-up — use when

- The number is the point of the beat and it is spoken out loud
- A comparison lands (before → after, cost → cost)
- A progress or share value is being explained

Rules: land exactly on the true value; never overshoot; ease `power2.out` over
0.8–1.4s; hold the landed value for at least 1.5s so it can be read and screenshotted;
one count per beat, never two competing.

Registry: `count-up`, `number-wheel`, `mk-progress-stat`, `conic-progress-ring`,
`mk-usage-arc`, `chart-story`, `data-chart`, `bar-chart-race`, `decline-chart`,
`apple-money-count` (loud — Shorts and stings only).

### Kinetic typography — use when

- **Word-level emphasis synced to the narration.** This is the highest-value use on a
  teaching channel: one scalar tweened against the transcript drives a highlight across
  the sentence being spoken. `mk-callout-highlight`, `caption-highlight`,
  `caption-pill-karaoke`, `inline-highlight`, `marker-highlight`.
- **A definition or a swap** — one word replaced by another on a beat:
  `kinetic-type-swap`, `line-swap`, `morph-text`.
- **A hook, a chapter card, or a sting** — full-screen single-word treatments:
  `caption-kinetic-slam`, `char-slam-explode`, `split-flap-board`, `matrix-decode`,
  `yt-prism-title`, `hw-title`.

### Do not reach for kinetic type when

- The narration is explaining a process — a diagram assembling carries it better
- Every scene already uses it; the effect is a contrast device and dies from repetition
- It would make the text unreadable while it is being spoken

**One flavour per beat.** A count-up *and* a scramble *and* a particle burst in the same
eight seconds is three claims competing for one idea.

---

## 7. Avoiding the slideshow

Applying every rule above inside each scene and cutting between scenes still produces a
slideshow. That is the most common note on multi-scene work, and it is two failures at
once: the scenes are **independent**, and they are **uniform in energy**.

Any fix must supply both properties:

1. **Something crosses the boundary** — a shared element, space, or motion vector the eye
   can follow through the transition. Otherwise the viewer re-orients at every seam.
2. **The energy varies** — the piece needs quiet against which a hero moment can register.
   Uniform motion is as flat as no motion. Emphasis is a *contrast* effect.

Methods, in rough order of cost:

| Method | Crosses the boundary via | Emphasis from |
|---|---|---|
| **Persistent frame** *(cheapest, recommended default)* | a chrome that never changes — a rule, a ruler, a chapter chip, a corner mark | let the chrome fall away for one beat; its absence is the accent |
| **Hero prop** | one object stays on screen while the environment changes | push in on the prop, still everything else |
| **Match cuts** | cut on a shared shape, colour or motion vector (`match-cut`, `iris-reveal`) | break the rhyme deliberately at the moment that matters |
| **Audio as the spine** | one unbroken sentence or phrase crosses the cut | a rest before the number lands |
| **Accumulation** | nothing exits; each scene adds to one canvas | everything but the newest element quiets to a low idle |
| **Continuous world-camera** *(expensive)* | one wide space the camera dollies across, no hard cuts | dwell-and-sweep: full stop 1.5–2.5s at each hero moment |

For a nine-minute narrated explainer, **persistent frame + hero prop + audio spine** is
the right combination. The continuous world-camera is a capstone technique; it only pays
on a piece with a through-line worth following, and it is far more work to author.

Whichever is chosen, put both properties in the composition brief in plain words, and
name the tell being forbidden: *"no scene may fade up centred, sit, and fade out."*

---

## 8. Handmade imperfection — only if it stays reproducible

If a brief wants a hand-animated or stop-motion texture (paper cutouts, a wobbly drawn
line), continuous easing is the wrong material — it reads digital however organic the
curve. What is wanted is irregular but reproducible:

- **Seed a PRNG once** at composition start (mulberry32). `Math.random()` is banned by
  the core contract and breaks every re-render and resume.
- **Step between held positions**, do not tween. "Two-frame hold" = land, hold two
  frames, jump.
- **Quantize on the integer frame index**, not on time:
  `Math.floor(Math.round(t * fps) / 2)`. Time-domain quantizing
  (`Math.floor(t / 0.0667)`) drifts across step boundaries because seek times do not land
  on exact 1/30s doubles — the symptom is a stutter instead of a tick.

Registry: `hw-title`, `hw-underline`, `hw-path-text`, `hw-scribble-transition`,
`marker-checklist-card`, `ink-bleed-reveal`.

---

## 9. Determinism — the constraints motion must never break

From `hyperframes-core`, restated because they are motion-shaped:

- One **paused** GSAP timeline; `data-duration` governs length
- No `Math.random()`, `Date.now()`, `performance.now()`, no `repeat: -1`
- No timeline construction inside `async` / `setTimeout` / `Promise`
- No `display` or raw `visibility` tweens; use `autoAlpha`
- **Spatial motion uses transform aliases only** — `x`, `y`, `scale`, `rotation`.
  Never `width` / `height` / `top` / `left`
- **Pre-calculate layout constants at setup.** Never derive a position from
  `getBoundingClientRect()` at tween time — the renderer samples frames in parallel and
  the measurement desyncs
- Lint flags to respect: relative tweens colliding with another writer, `repeatRefresh`
  with a relative value, function-valued tween vars, DOM measurement in timeline callbacks

Audit an authored composition with:
`node skills/hyperframes-animation/scripts/animation-map.mjs <dir> --out <dir>/.hyperframes/anim-map`
It enumerates every tween, samples bounding boxes, and reports dead zones and stagger
inconsistencies — cheaper than a render, and it answers "is this static?" with numbers.

---

## 10. What NOT to do — the checklist

1. **No frozen holds.** Every scene ends on ambient idle, never on a dead frame.
2. **No camera-less scene.** One continuous move per scene, minimum 4%.
3. **No simultaneous identical entrances.** Nothing shares a start or an end time.
4. **No decorative motion.** If the sentence "this moves because…" cannot be finished, cut it.
5. **No four-property entrances.** Two agreeing properties, not four arguing ones.
6. **No overshooting numbers.** Transforms overshoot; values never do.
7. **No motion added to fill an empty frame.** Fix the composition, not the amplitude.
8. **No `Math.random()`, ever.** Seed it or drop it.
9. **No layout-property tweens** (`width`, `height`, `top`, `left`).
10. **No slideshow.** Something crosses every boundary, and the energy varies.
11. **No custom GSAP before `npx hyperframes catalog`.**
12. **No stagger longer than the animation it offsets.**
13. **No two kinetic flavours in one beat.**
14. **No closing plate shorter than the audio tail.**

---

## 11. How this is used in the pipeline

At build time, after `FRAME.md` is copied into the project:

1. Read `FRAME.md` (atoms) **and this file** (motion). They do not overlap.
2. Run `npx hyperframes catalog`; pick blocks and components by name for each beat.
3. Choose the anti-slideshow method for the whole video **before** composing scene one,
   and write it at the top of `BRIEF.md`.
4. Compose. Registry blocks first; custom GSAP only for what the registry lacks.
5. `lint` → `check` → `snapshot` → live preview. The contact sheet shows composition;
   **only the live preview shows motion.** A still frame cannot fail rule 1, 2 or 3 —
   so motion is judged in the Studio preview, never on the sheet.
6. Optionally run `animation-map.mjs` and read the dead-zone report before the gate.

**Motion is approved at Gate 4, in the live preview, before any render.**

---

## 12. The house palette — the blocks this channel uses by default

Chosen 2026-08-15 for a narrated teaching explainer: **dense but quiet, modern,
elegant, and always in service of the explanation.** Every item below is a registry
block or component — `npx hyperframes add <name>` — so it costs **zero credits** and
renders locally. The only budget line in the whole system is HeyGen avatar clips.

**All of these are frame-independent.** They read their colours and type from tokens,
so the same palette works on Capsule, Blue Professional, Creative Mode or a navy base.

### Tier A — used in almost every video (the workhorses)

| Block | Job | Where |
|---|---|---|
| `push-in` | the mandatory camera move | every scene |
| `drift-hold` | ambient idle so nothing freezes | every hold, every closing plate |
| `grain-field` | living background texture, loop-exact | behind everything |
| `per-word-rise` | headline entrance, blur-to-sharp cascade | every title |
| `mk-callout-highlight` | **word-by-word emphasis driven by one scalar, synced to the voiceover** | the single highest-value block for a teaching channel — the sentence being spoken lights up as it is spoken |
| `beat-timeline` | orchestration spine, beats pinned to named labels | the whole composition |
| `count-up` | numbers land on their true value | every stat |
| `grid-card-assemble` | 3–5 point lists assemble instead of appearing | every enumeration |
| `marker-highlight` | one hand-drawn stroke over the emphasised word | 2–4 times per video, never more |

### Tier B — the explanation-strengtheners (this is where the density comes from)

| Block | What it makes visible |
|---|---|
| `pan-stations` | a process with stops — the camera travels the steps and dwells at each |
| `scroll-camera-story` | a long argument as one vertical world with parallax depth |
| `pull-back-reveal` | a detail that widens to show what it belongs to — the "aha" move |
| `focus-rack` | attention shifts between two ideas at different depths, not a cut |
| `chart-story` | data builds in reading order and lands the exact supplied values |
| `mk-progress-stat` · `conic-progress-ring` · `mk-usage-arc` | one number, three registers |
| `mk-specs-list` | staggered checklist rows with an accent underline sweep |
| `code-highlight` · `code-scroll` · `code-typing` · `code-terminal-run` | anything technical shown honestly |
| `before-after-wipe` / `comparison-split` | the old way vs the new way, one divider |
| `modal-morph` | a small card becomes a full panel — shared-element, no cut |
| `icon-morph-beat` | a state change marked by one restrained pulse |
| `notification-stack` | messages, alerts, results arriving in order |
| `device-frame-stage` · `parallax-device-dive` | a phone or app shown as a real object |
| `press-ripple` · `gesture-tap` · `touch-indicator` | a UI being *used*, not described |

### Tier C — accents. One or two per video, never more

`char-slam-explode` (the hook) · `split-flap-board` (a mechanical reveal) ·
`matrix-decode` · `kinetic-type-swap` · `line-swap` · `morph-text` ·
`hw-title` · `hw-underline` · `marker-checklist-card` · `logo-sting` ·
`badge-pop` · `number-wheel` · `caption-kinetic-slam` · `yt-prism-title`

### Tier D — seams. Pick ONE and repeat it; do not shuffle transitions

Preferred (quiet and modern): `match-cut` · `iris-reveal` · `fade-through` ·
`halftone-dissolve` · `directional-wipe`
Available but loud — Shorts and stings only: the shader family
(`cinematic-zoom`, `glitch`, `swirl-vortex`, `ridged-burn`, `light-leak`,
`sdf-iris`, `flash-through-white`, `chromatic-radial-split`) and `beat-freeze-cut`.

### Tier E — closes

`cta-close` · `logo-brand-close` · `social-proof-card` · `logo-outro`

### The density target

The 2026-08-15 test video ran roughly **one motivated movement per 10–12 seconds.**
The target is **one every 2.5–4 seconds**, which is the 3–5× increase asked for. In
practice, per 8-second beat:

1. the camera move, running underneath the whole beat (1)
2. the headline or line entrance (1)
3. the word-level highlight tracking the narration (continuous)
4. one content movement — a count landing, a card assembling, a callout drawing (1–2)
5. ambient idle on everything at rest (continuous)

That is four to five *simultaneous* layers, not four movements in a row. **Density comes
from overlap, not from amplitude.** Every one of them still has to finish the sentence
*"this moves because…"* — a busy frame of decoration is worse than the static version.

### Cost

Registry blocks: **0 credits.** Local render: **0 credits**, 3.5 minutes per minute of
finished video. ElevenLabs TTS: negligible. The only paid element in the pipeline is
HeyGen avatar clips, and those are app credits, composited after the render.
More motion costs render time, not money — and denser motion barely moves the render
clock, because the frame count is fixed by the audio length.
