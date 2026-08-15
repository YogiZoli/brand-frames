# _frames — canonical design system per channel

**Git remote:** https://github.com/YogiZoli/brand-frames (private)
Clone anywhere: `git clone https://github.com/YogiZoli/brand-frames.git`
After changing a FRAME.md here, commit and push — every machine and every Claude
session inherits it.

**This folder is the single source of truth for how every video looks.**
Never invent a palette, font, or layout in a project. Copy from here.

| Channel | Folder | Frame pack | Character |
|---|---|---|---|
| Zoltan Gero (@ZoltanGero, EN) | `zoltan-gero/` | **Capsule** | Cream canvas, 2px ink outline pills, nine-colour candy palette, Bodoni Moda + Space Grotesk |
| VoxFlow (Máté workflow) | `voxflow/` | **Blue Professional** | Corporate parchment + cobalt primary, Space Grotesk display, Inter body |

## Files in each channel folder

- `FRAME.md` — the frame-layer design system (1920×1080). **Copy into every new project root.**
- `frame-showcase.html` — visual reference. Open in a browser to see the atoms.
- `CHANNEL.md` — channel binding: voice, avatar, aspect, output paths.
- `BRIEF.template.md` — copied to a new project as `BRIEF.md`, then filled from the approved script.

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

1. **Never build an engine.** Official HeyGen HyperFrames skills + registry only.
   `npx hyperframes catalog` before writing any custom code.
2. **Never invent design.** FRAME.md is the palette, type ramp, spacing, components.
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
