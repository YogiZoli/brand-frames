# AUDIO — the recipe. Follow it exactly.

**Rule 1 — Narration and background music are produced TOGETHER, in one step, and
approved as ONE artifact.** Never hand over a bare voiceover and add music later. The
approved mix is what defines the video's final length, so every beat timestamp downstream
depends on it. Deliver both files: the mix (for approval and for the build) and the
narration alone (so the voice can be judged separately). Do not split this into two
approval points unless Zoltan explicitly asks.

**Cost note:** mixing costs nothing. TTS runs on the ElevenLabs API (negligible against
the 32.9M credit balance); the mix is ffmpeg running locally. There is no reason to skip it.

---

## Rule 2 — NEVER set music level with a relative dB value. Measure first.

This mistake was made on 2026-08-15 and must not be repeated. Applying `volume=-18dB`
to the music sounded correct in theory and was catastrophically loud in practice, because
the source music was already 16 LU hotter than the narration.

**Always measure both sources, then compute an absolute target.**

```powershell
ffmpeg -hide_banner -nostats -i <vo>.mp3  -af ebur128=framelog=quiet -f null -
ffmpeg -hide_banner -nostats -t 60 -i <bgm>.wav -af ebur128=framelog=quiet -f null -
```

Reference measurements (2026-08-15):
- ElevenLabs narration output: **−27.2 LUFS**
- `pipeline\bgm_v3.wav`: **−11.5 LUFS**

**Target: music sits 24 LU below the narration.** This is a tutorial channel, not an ad.
The music must be felt, not heard. Compute the gain from the measurement, never assume it.

## Rule 3 — Normalise the FINAL MIX to −14 LUFS

YouTube normalises to about −14 LUFS. A −27 LUFS master plays quieter than every other
video on the platform and the viewer reaches for the volume. Apply `loudnorm` to the mix,
after the music is blended, so the voice-to-music ratio is preserved.

---

## The working command

```
ffmpeg -y -i <vo>.mp3 -stream_loop -1 -i bgm_v3.wav \
 -filter_complex "[1:a]atrim=0:<dur>,asetpts=N/SR/TB,volume=<computed>dB,\
   afade=t=in:st=0:d=3,afade=t=out:st=<dur-5>:d=5[bg];\
   [bg][0:a]sidechaincompress=threshold=0.02:ratio=6:attack=20:release=500[duck];\
   [duck][0:a]amix=inputs=2:duration=first:normalize=0[mix];\
   [mix]loudnorm=I=-14:TP=-1.5:LRA=11[out]" \
 -map "[out]" -c:a libmp3lame -b:a 192k -ar 44100 <out>_bgm.mp3
```

Ducking: gentle. The music is already tiny; the sidechain only keeps it out of the way
during speech and lets it breathe back in the pauses.

---

## Voice settings — Zoltan Gero channel

Script: `pipeline\tts2.ps1` (supports voice_settings; `tts.ps1` does not).

```
voice        Z HU mic 06   (channels.json → zoltan-gero.eleven_voice_id)
model        eleven_multilingual_v2
stability    0.62     # calm, even delivery for teaching content
similarity   0.80
style        0.0
speed        0.96     # 1.00 reads ~186 wpm, too fast to follow
```

**Pauses belong in the script, not in the settings.** Use SSML breaks in the text:
`<break time="1.2s" />` before each major section, `<break time="0.3s" />` between items
in a spoken list. Roughly 45 breaks in a nine-minute script. This is what lets a viewer
follow a process rather than being flooded.

**Length calibration:** at speed 0.96 with breaks, ~1350 spoken words lands at about 9:20.
Adjust the speed, not the script, to hit a target length.

## Delivery

Copy both files to the Cowork outputs folder and call `present_files`:
- `<name>_WITH_MUSIC.mp3` — the artifact under approval
- `<name>_NARRATION_ONLY.mp3` — so the voice can be judged without the music

Then state: length, music level relative to voice, final LUFS, speed and stability.
