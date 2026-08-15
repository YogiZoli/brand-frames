# LONG-RUNNING COMMANDS — do not poll

**Polling is the second most expensive habit in this system, after re-rendering.**
Every status check is a round trip: a tool call, a result, and a slice of context. Checking
a ten-minute render every thirty seconds costs more than the render does.

## Rule zero — ALWAYS give Zoltán a time estimate before he waits

This applies to **both kinds of waiting**, and it is not optional:

**A. Machine time** — a render, a transcription, a TTS call, a batch upload.
**B. Claude's own working time** — writing a composition, filling a beats table, drafting
a long script. There is no background process here, but Zoltán is still waiting, and he
still needs to know for how long.

Every time either kind of wait begins, say three things explicitly:

1. **What is happening** — one line.
2. **Roughly how long** — a number, in minutes. Never "shortly", never "soon".
3. **When to write back, and what to do meanwhile** — e.g. *"Írj rám kb. 25 perc múlva.
   Addig ne csukd be a gépet, és ne altasd el — a render helyben fut."*

**Never leave him guessing when to come back.** A wait without a stated return time is a
failure of the instruction, even if the work itself is perfect.

For Claude's own working time, say so plainly: *"Ez az én munkám, nem gépidő — kb. 12
perc. Addig ne csukd be a gépet."* He then knows the difference between "go and do
something else" and "stay available".

## The rule

For anything that takes longer than about a minute — a render, a transcription, a long
TTS call, a batch upload — do this:

1. **Start it.** One command. Do not wait on it in a loop.
2. **Tell Zoltán the estimate in one line**, in the form: what is running, how long it
   should take, and what he should do (leave the machine on, come back later).
3. **Stop. End the turn.** Do not check, do not poll, do not "just confirm it started."
4. **Wait for Zoltán to write back.** When he does, check the result once and continue.

Zoltán will come back to the chat. That is the trigger, not a timer.

## Estimates to quote

| Step | Estimate |
|---|---|
| ElevenLabs TTS, ~1400 words | 2–4 minutes |
| ElevenLabs Scribe transcription, 10 min audio | 1–2 minutes |
| ffmpeg audio mix | under 1 minute |
| `hyperframes check` | 20–60 seconds |
| `hyperframes snapshot`, 8 frames | 1–2 minutes |
| **`hyperframes render`** | **~3.5 minutes per minute of finished video** on this machine — a 9-minute video is roughly 32 minutes. Measured 2026-08-15: 9m22s rendered in 31m58s (16,875 frames, 3 workers, Intel UHD 620). The docs' "2.5×" figure assumes faster hardware; quote the measured number. |
| ffmpeg avatar compositing | 2–5 minutes |
| **Claude writing a composition** (own working time) | 10–15 minutes |
| **Claude writing a full script** (own working time) | 5–10 minutes |
| **Claude filling a beats table** from a transcript | 3–5 minutes |

Quote the number. If it finishes early, no harm. If a step has no estimate, say so
honestly rather than guessing silently.

## What counts as polling (all banned)

- Repeated `Get-Item` / `ffprobe` calls to watch a file grow
- `Start-Sleep` inside a command purely to wait for something else
- Re-listing a directory to see whether an output appeared
- Re-running a status flag such as `preview --status` more than once
- Any "let me just check whether that finished" between two turns

## Acceptable

- **One** check after Zoltán says it should be done, or after he writes back
- A check that is genuinely part of the work, for example reading a `check.json` in
  order to fix the failures it reports
- Building the estimate into the command itself, so one call does the work and reports
  the result at the end

## The wider principle

This is the same principle as the preview gate. Do the expensive thing once, deliberately,
and put the human decision around it — rather than paying repeatedly to ask whether the
expensive thing is done yet.
