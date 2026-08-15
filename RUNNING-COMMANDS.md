# LONG-RUNNING COMMANDS — do not poll

**Polling is the second most expensive habit in this system, after re-rendering.**
Every status check is a round trip: a tool call, a result, and a slice of context. Checking
a ten-minute render every thirty seconds costs more than the render does.

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
| **`hyperframes render`** | **~2.5 minutes per minute of finished video** — a 9-minute video is roughly 22 minutes |
| ffmpeg avatar compositing | 2–5 minutes |

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
