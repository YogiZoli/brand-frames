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

# _frames — canonical design system per channel

**Git remote:** https://github.com/YogiZoli/brand-frames (private)
Clone anywhere: `git clone https://github.com/YogiZoli/brand-frames.git`
After changing a FRAME.md here, commit and push — every machine and every Claude
session inherits it.

**This folder is the single source of truth for how every video looks.**
Never invent a palette, font, or layout in a project. Copy from here.

| Channel | Folder | Frame pack | Character |
|---|---|---|---|
| Zoltan Gero (@ZoltanGero, EN) | `zoltan-gero/` | **Brand kanon** | Forras: `C:\Users\gdp\projects\design-system\tokens.css` + `README.md`. Ground `#F6F8FC`, azure `#1E7CE8` vezet, navy text `#1E2733`, zold akcentus `#12A150` (CTA `#0E8542`), Open Sans, no orange, no dark. Lasd `zoltan-gero/BRAND-BRIDGE.md`. |
| VoxFlow (Máté workflow) | `voxflow/` | **Blue Professional** | As delivered: warm cream #fdfae7, single saturated cobalt #1e2bfa, Space Grotesk display + Inter body, soft tinted cards, no shadows. |

## Files in each channel folder

- `FRAME.md` — the frame-layer design system (1920×1080). **Copy into every new project root.**
- `frame-showcase.html` — visual reference. Open in a browser to see the atoms.
- `CHANNEL.md` — channel binding: voice, avatar, aspect, output paths.
- `BRIEF.template.md` — copied to a new project as `BRIEF.md`, then filled from the approved script.
- `DESIGN.md` — the channel design language: scene archetypes, motion vocabulary, the AVOID list.
- `brand.css` — the token bridge that re-skins any registry block to this channel. Copy into every project.

## Motion

`MOTION.md` (this folder) is the companion to `FRAME.md` and is **frame-independent** —
it applies unchanged to whichever design is chosen. `FRAME.md` says how a video looks;
`MOTION.md` says how it moves. Copy both into every new project.

## Rule

> Atoms are sacred · composition is free · numbers come from the script.

Every video on a channel is visually unique in composition but identical in atoms.
Zoltan never decides design per video. If the look must change, change `FRAME.md` here —
all future videos inherit it.

## DEPRECATED

`../_DEPRECATED_exp-v9/` — the hand-built engine. **Never read, never use, never copy from.**
All motion comes from the official HeyGen skills (`/hyperframes-animation`) and the
registry (`hyperframes add`).

## The three laws (full guide in Drive)

**Canonical guide:** "★ VIDEO PIPELINE — Canonical Guide" in Drive/YT_Flywheel
https://docs.google.com/document/d/1gzF-bkUKmzc_UlIc2x9VqSYa93t74Aas-7o97hMnd-s

1. **Never build an ENGINE.** Rendering, build scripts, the motion runtime, the CLI — always the
   official HeyGen HyperFrames. `npx hyperframes catalog` before writing any custom code.
   **This law is about the engine ONLY.**
2. **DO build our own DESIGN framework — on top of an existing one, never from zero.**
   Corrected 2026-08-16. The design layer is ours: palette, type, components, and our own
   **re-skinned registry blocks** (`BLOCKS.md`). We start from a shipped HeyGen frame pack
   (Creative Mode, Blue Professional, …) and re-base it onto our palette. Registry blocks are
   **adopted and re-skinned to our tokens** — overriding their design tokens is the whole point,
   not a violation. What stays forbidden is inventing a look per video: within a video,
   `FRAME.md` is law.
3. **Never render to find out whether it works.** `check` + `snapshot` + `preview`
   answer that in seconds, for free.

## The chain

```
title → script → audio → BUILD → lint → check → snapshot + preview  ★GATE★
      → render ONCE → ffmpeg avatar composite → publish <URL>
```

Studio, the CLI and the agent share the same project files — Studio edits save to disk
automatically and the next render picks them up. Never edit the same file in Studio and
via the agent at the same time.
