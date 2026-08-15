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
