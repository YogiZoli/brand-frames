# BLOCKS — our own block set, built on the official registry

**The rule, corrected 2026-08-16.** We do not build an engine. We *do* build our own design
framework, and that includes our own block set. The HyperFrames registry has ~380 blocks and
components; we **adopt** the ones we want and **re-skin them to our tokens**. Overriding a block's
design tokens is the entire point — it is what turns a generic registry block into ours.

What remains forbidden:

- a custom render engine, build script, or motion runtime — always official HyperFrames
- inventing a look *per video* — within a video, `FRAME.md` is law
- shipping a block with its stock palette still in it

## The workflow, every time

```
npx hyperframes catalog > catalog.txt        # find it by name or tag
npx hyperframes add <block-name>             # pull it into the project
# 1. open what it added, find its CSS custom properties / hard-coded colours
# 2. map them onto our tokens (see the bridge below) — no stock colour survives
# 3. check the motion against MOTION.md; trim anything decorative
npx hyperframes lint && npx hyperframes check
```

A block that still contains a stock hex after step 2 has not been adopted. It has been pasted.

## The token bridge

Every project gets `brand.css`, loaded after the block's own styles. Registry blocks are
token-driven, so remapping the variables re-skins the block without touching its logic.

```css
/* brand.css — our face, over any registry block */
:root {
  /* our palette (Zoltan Gero — C2C Blue) */
  --zg-ground:  #eef3f7;
  --zg-blue:    #1a73e8;
  --zg-navy:    #0e2038;
  --zg-green:   #34a853;   /* ONE per scene */
  --zg-muted:   #5b6b86;
  --zg-grid:    rgba(26,115,232,0.09);

  /* the bridge: registry components read these */
  --hf-bg: var(--zg-ground);
  --hf-fg: var(--zg-navy);
  --hf-accent: var(--zg-blue);
  --hf-accent-2: var(--zg-green);
  --hf-muted: var(--zg-muted);
  --hf-border: rgba(26,115,232,0.20);
  --hf-surface: rgba(26,115,232,0.04);
  --hf-font-display: "Inter", sans-serif;
  --hf-font-body: "Inter", sans-serif;
  --hf-font-mono: "Inter", sans-serif;
  --hf-radius: 12px;
}
```

**Confirm the real variable names per block** — read what `hyperframes add` wrote before assuming.
Where a block hard-codes a hex instead of a variable, replace the hex and note it here so the next
session does not re-discover it.

**Absolute rule while re-skinning: NO ORANGE.** Several registry blocks ship an orange accent
(the whole Creative Mode hard-shadow family among them). Orange is out on this channel — map it
to blue, or to green if it is a single CTA emphasis.

## The adopted set — our blocks

Tiered by how often they earn their place. All are frame-independent once re-skinned.

### Tier A — the spine, in almost every video

| Block | Job | Re-skin notes |
|---|---|---|
| `push-in` | the mandatory camera move | no colour to change |
| `drift-hold` | ambient idle so nothing freezes | no colour |
| `grain-field` | living background texture | tint to `--zg-grid` |
| `dynamic-grid` | the drifting background grid | `rgba(26,115,232,0.09)` exactly |
| `per-word-rise` | headline entrance | strip any blur phase |
| `mk-callout-highlight` | word-by-word emphasis synced to the voiceover | highlight in blue; **one word per sentence** |
| `beat-timeline` | orchestration spine, beats pinned to labels | no colour |
| `count-up` | numbers land on their true value | numerals blue |
| `number-wheel` | rolling digits for metrics | numerals blue |
| `grid-card-assemble` | lists assemble instead of appearing | card fill `--hf-surface`, border `--hf-border` |
| `stagger-cascade` | ordered grid cascade | same card treatment |
| `cta-close` | the closing ask | CTA capsule green — the one green of the scene |

### Tier B — the explanation-strengtheners

`pan-stations` · `pull-back-reveal` · `focus-rack` · `scroll-camera-story` ·
`chart-story` · `data-chart` · `mk-progress-stat` · `conic-progress-ring` · `mk-usage-arc` ·
`mk-specs-list` · `before-after-wipe` · `comparison-split` · `modal-morph` ·
`icon-morph-beat` · `notification-stack` · `device-frame-stage` · `parallax-device-dive` ·
`press-ripple` · `gesture-tap` · `touch-indicator` ·
`code-highlight` · `code-scroll` · `code-typing` · `code-terminal-run`

Re-skin pattern for all of these: surface → `--hf-surface`, border → `--hf-border`,
every accent → blue, at most one green per scene, all type → Inter, radius → 12px.

### Tier C — accents, one or two per video

`char-slam-explode` · `split-flap-board` · `kinetic-type-swap` · `line-swap` ·
`matrix-decode` · `badge-pop` · `number-pop-in` · `logo-sting` · `inline-highlight` ·
`marker-highlight` · `caption-kinetic-slam`

### Tier D — seams. Pick ONE per video and repeat it

Preferred: `match-cut` · `iris-reveal` · `fade-through` · `directional-wipe` · `halftone-dissolve`
Available but loud — Shorts and stings only: the shader family (`cinematic-zoom`, `glitch`,
`swirl-vortex`, `ridged-burn`, `light-leak`, `sdf-iris`, `flash-through-white`) and
`beat-freeze-cut`.

### Tier E — closes

`cta-close` · `logo-brand-close` · `social-proof-card` · `logo-outro`

### Deliberately NOT adopted

Anything that carries a whole scene's art direction with it and would fight `FRAME.md` harder than
it helps: `gallery-tunnel`, `macos-tahoe-liquid-glass`, `rack-focus`, `code-3d-extrude`,
`code-particle-assemble`, `ascii-render-pass`, `ordered-dither-pass`, the ad-template family
(`ai-chat-reveal`, `chatgpt-exchange`, `message-thread-reveal`, `notes-reveal`,
`heygen-avatar-promo-card`), and `apple-money-count` (too loud for a teaching channel).
Revisit any of these deliberately, never by accident.

## Promotion — when a re-skin becomes ours

Once a block has been re-skinned and shipped in a video, promote it: copy the adapted version into
`_frames/blocks/<name>/`, commit it, and use that copy from then on. That folder is our block
library. It is derived from the official registry, it never replaces the engine, and it is exactly
what "our own design framework" means.
