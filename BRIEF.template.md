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
- Track: `assets/bgm.mp3`
- Level: **−18 dB** under narration. Ducking on.

## Beats
| # | t (s) | Section | On screen | Frame atom |
|---|---|---|---|---|
| 1 | 0:00 | Hook | | title-pill |
| 2 | | Problem | | pill-card |
| 3 | | Teach 1 | | stat-pill |
| 4 | | Teach 2 | | |
| 5 | | Own / CTA | | closing-display |

## Avatar slots (composited AFTER render — not part of this project)
| Slot | t (s) | Length | Clip |
|---|---|---|---|
| opening | 0:00 | ~8s | |
| mid-1 | | ~6s | |
| close | | ~8s | |

## Negatives — do not do
- No stock-video montage. No slideshow cross-fades. No motion the frame doesn't define.
- No colour outside the FRAME.md palette. No font outside the FRAME.md ramp.
- No CRM/email tool names on screen.
- **Never** copy anything from `_DEPRECATED_exp-v9/`.
