# BRIEF — <VIDEO TITLE>

> This file is the artifact, not the chat. A later session resumes from here and asks nothing again.
> To change an answer, edit this file — do not re-explain in the prompt.

```yaml
channel:        # zoltan-gero | voxflow
frame:          ./FRAME.md        # copied from _frames/<channel>/FRAME.md — do not edit per video
route:          /faceless-explainer   # or /general-video, /motion-graphics, /product-launch-video
run_mode:       automation        # automation | companion
storyboard:     no                # the script is already approved; nothing to storyboard
aspect:         1920x1080
duration_target: # seconds, from the approved voiceover length
keyword:        # from SEO step
```

## Narration
- Audio file: `assets/vo.mp3`  (ElevenLabs voice clone, already approved)
- Transcript: `assets/vo.srt`  (word-level, from `hyperframes transcribe`)
- **Visuals follow the audio.** Never re-time the audio to fit the visuals.

## BGM
- Delivered inside the approved mix `assets/vo_bgm.mp3` — narration and music are ONE artifact.
- Level: **measured, not assumed.** Music sits 24 LU below the narration; final mix normalised
  to −14 LUFS. **Never a relative dB value.** Full recipe: `_frames/AUDIO.md`.

## Motion plan  (from `./MOTION.md` — copied alongside FRAME.md, frame-independent)
```yaml
anti_slideshow_method:   # persistent-frame | hero-prop | audio-spine | match-cuts | accumulation | world-camera
                         # default for a narrated explainer: persistent-frame + hero-prop + audio-spine
persistent_element:      # what crosses EVERY scene boundary — name it
camera_default:          # push-in 4-8%, or the per-scene move
density_target:          # one motivated movement per 2.5-4s, 4-5 overlapping layers per beat
forbidden_tell:          # e.g. "no scene may fade up centred, sit, and fade out"
```

## Beats
| # | t (s) | Section | On screen | Frame atom | Motion (registry block) |
|---|---|---|---|---|---|
| 1 | 0:00 | Hook | | display-hero wordmark | char-slam-explode + push-in |
| 2 | | Problem | | big-claim on accent | per-word-rise + mk-callout-highlight |
| 3 | | Teach 1 | | stat-grid | count-up + grid-card-assemble |
| 4 | | Teach 2 | | marker-block | marker-highlight + focus-rack |
| 5 | | Own / CTA | | closing plate (green) | cta-close + drift-hold |

## Avatar slots (composited AFTER render — not part of this project)
| Slot | t (s) | Length | Clip |
|---|---|---|---|
| opening | 0:00 | ~8s | |
| mid-1 | | ~6s | |
| close | | ~8s | |

## Negatives — do not do
- No stock-video montage. No slideshow cross-fades. No decorative motion — every movement must
  finish the sentence "this moves because…". No frozen final second, ever.
- No colour outside the FRAME.md palette. No font outside the FRAME.md ramp.
- No CRM/email tool names on screen.
- **Never** copy anything from `_DEPRECATED_exp-v9/`.
