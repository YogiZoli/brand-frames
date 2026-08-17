# BOOTSTRAP — új gép beüzemelése

Cél: egy új laptopon **egy óra alatt** működő videógyártás, kézi
újratanulás nélkül. Ha valami ebből nem működik, az itt hiányzik — javítsd
ezt a fájlt, ne a fejedben tartsd.

## Mi hordozható (git) és mi nem

| Hordozható — git | Nem hordozható — külön kell |
|---|---|
| `_frames/` teljes tartalma (kánon, design, mozgás, feedback-log) | API kulcsok, `.env`, tokenek |
| `zg-frames/` archetípus-registry | Node, Python, ffmpeg, Git |
| `PIPELINE.md`, `MOTION.md`, `FRAME.md`, `AUDIO.md` | Google Drive for Desktop (STREAM mód!) |
| `sampler.html` + baseline képek | Claude Desktop + MCP-k |
| `pipeline/*.ps1` (tts, stt, drive_upload) | HeyGen / ElevenLabs bejelentkezés |
| `CLAUDE.md` pointer-fájlok | avatar WebM-ek, `vo_bgm.mp3`-ok (Drive-on) |

**Következtetés:** minden, ami tudás, git-ben van. Minden, ami titok vagy
telepítés, listázva alább. Videó-nyersanyag a Drive-on.

## Telepítési sorrend

1. **Git** → `git clone https://github.com/YogiZoli/brand-frames C:\Users\gdp\HyperFrames\_frames`
2. **Node LTS** (a mérés v24.16 alatt készült) → `npx hyperframes --version`
   ellenőrzés. A HyperFrames CLI-t nem kell külön telepíteni, `npx` hozza.
3. **Python 3** (a segédszkriptekhez: mondattábla, pixel-diff)
4. **ffmpeg** PATH-ba (avatar composite, kockakinyerés, hangmix)
5. **Google Drive for Desktop**, **STREAM** módban — nem Mirror. A cloud fájlok
   így nem foglalnak lemezt.
6. **Claude Desktop** + MCP-k: Desktop Commander, Google Docs/Drive, GoHighLevel,
   vidIQ, HeyGen, YouTube. A kulcsokat a jelszókezelőből.
7. **`C:\Users\gdp\CLAUDE.md`** — a gép-szintű irányjelző. Ha nincs, másold a
   repóból: `_frames/machine-CLAUDE.md.example`.
8. **Skillek** — fiókhoz kötöttek, automatikusan jönnek a Claude-fiókkal.
   Nem kell másolni. Ha egy skill régi sorrendet mond, a `PIPELINE.md` nyer.
9. **Ellenőrzés:** `npx hyperframes render -c sampler.html` a `zg-frames`-ben.
   Ha a sampler lefut és egyezik a baseline-nal, a gép kész.

## Ha más a felhasználónév vagy az útvonal

A pointer-fájlokban absztolút útvonal van (`C:\Users\gdp\...`). Új gépen egy
keresés-csere elég a `CLAUDE.md` fájlokban és a `PIPELINE.md`-ben. Ezt a
`_frames/push.ps1` mellé tett szkript is elvégezheti.

## Amit soha nem kell újratelepíteni, mert nem a miénk

`render`, `check`, `lint`, `snapshot`, `preview`, `transcribe`, Studio — mind a
HeyGen HyperFrames része, `npx` hozza. **Nincs saját motorunk, és nem is lesz.**
