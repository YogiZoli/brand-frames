# ★ VIDEO PIPELINE — a kánon

> **Ez az egyetlen érvényes leírás.** Ha bármely skill, Drive doksi, projekt-
> utasítás vagy korábbi chat ettől eltérőt mond, **ez nyer**, és a másikat
> javítani kell. Verzió: 2.0 · 2026-08-17

## A HATÁR — egyetlen mondat

**Mi szöveget írunk. A HyperFrames gyárt kockát.**

Amint egy szkriptünk képkockát, videót vagy hangot állít elő, átléptük a
határt — az volt az `exp-v9`, és soha nem tér vissza.

| Soha nem írjuk újra (HeyGen HyperFrames) | Mi birtokoljuk |
|---|---|
| `render` · `check` · `lint` · `snapshot` · `preview` | design tokenek (`FRAME.md`, `brand.css`) |
| `transcribe` · Studio · GSAP · ffmpeg-hívás | archetípus-könyvtár (`zg-frames/`) |
| a registry mechanizmusa (`data-composition-src`) | mozgás-szabályok (`MOTION.md`) |
| | a videó jelenet-táblája |

## A MENET

| # | Lépés | Ki | Kapu |
|---|---|---|---|
| 1 | Kutatás + cím + **script** | Opus | ✅ **1. kapu** |
| 2 | **VO + zene** (ElevenLabs · ducking · −14 LUFS) | szkript | ✅ **2. kapu** |
| 3 | **Mondattábla** (SRT → mondathatárok + időpontok) | szkript | ❌ |
| 4 | **Jelenet-tábla** (archetípus + max 6 szó / mondat) | Opus | ✅ **3. kapu** |
| 5 | **Build** (tábla + registry → `index.html`) | Sonnet / szkript | ❌ |
| 6 | **lint → check** | HyperFrames | ❌ (0 hiba a feltétel) |
| 7 | **Kontakt lap** (állókép jelenetenként) | HyperFrames | ✅ **4. kapu** |
| 8 | **Render**, egyszer | HyperFrames | ❌ |
| 9 | **Avatar composite** (kör-maszk, jobb alul) | ffmpeg | ✅ **5. kapu** |

### Miért nincs kapu a 3. és az 5. lépésen

A **mondattábla nem döntés, hanem mérés** — a zárt hangból olvassa ki a
határokat. Ha hibás, a hang hibás, azt viszont a 2. kapu már jóváhagyta.
A **build sablonbehelyettesítés** — ha hibás, a jelenet-tábla hibás, és a
`check` amúgy is elkapja.

### A 4. lépés a legfontosabb újítás

A jóváhagyás a lassú lépés ELÉ kerül — Zoltán saját elve, egy fokkal
korábbra tolva, mint a preview. A jelenet-tábla sima szöveg:

```
t=1.71   7.3s  arrow       ONE IDEA → PUBLISHED      sub: "Not a draft…"
t=9.05   5.3s  tiles-4     Title · Description · Chapters · 25 languages
t=14.38  2.6s  statement   "Let me be" / PRECISE
```

Két perc alatt átfutható, és pontosan azt dönti el, ami a videót eldönti:
**jó szó van-e a jó mondaton, és nem tér-e el a kép a hangtól.** Egy javítás
itt egy sor. Ugyanaz a javítás a preview után 40 perc.

### A 7. lépés NEM tartalmi kapu

A kontakt lap a build után kézműves ellenőrzés: kifér a szöveg, nem
ütközik, kiegyensúlyozott-e a kép. A tartalom a 4. kapun ment át.
**A kontakt lap soha nem mutat mozgást** — a mozgást a motion sampler
hagyja jóvá, nem ez. Ezt minden alkalommal ki kell mondani Zoltánnak.

### A négy jóváhagyási pont a videó narratívájában

A publikus történet négy pontot mond (script · voice · visuals · face).
A fenti öt kapu nem mond ellent: a „visuals" kapu kettéválik **tartalmira**
(4. — olcsó, szöveg) és **tördelésire** (7. — kontakt lap).

## MOTION SAMPLER — a mozgás egyszeri jóváhagyása

`_frames/zg-frames/sampler.html` — kb. 90 mp, mind a 38 archetípus,
2–3 mp-enként, valódi mozgással.

- A mozgást a **könyvtár verziójára** hagyjuk jóvá, nem videónként.
  („`zg-frames v1.0` jóváhagyva.")
- Innentől videónként **csak tartalmi** jóváhagyás van.
- **Regressziós teszt:** a jóváhagyott render a baseline. Minden könyvtár-
  változás után újrarender (~3 perc, 0 token) → ffmpeg kockák → pixel-
  összehasonlítás → **lista arról, melyik archetípus változott.** Ha olyan is
  a listán van, amit nem akartunk, még egyetlen videó előtt kiderül.
- **Zoltán soha többé nem regressziós teszt.** Ez a gép munkája.

## FEEDBACK — egyetlen hely

`_frames/_feedback/<YYYY-MM-DD>/` — screenshotok ide, a chatben csak
annyi: **„feedback"**.

**Minden feedback a KÖNYVTÁRBA megy, nem egy videóba.** A szabály három
helyre kerül: `FEEDBACK-LOG.md` + `MOTION.md` (vagy `FRAME.md`) + a
komponens. Ez a ratchet: a 3. videó ott kezd, ahol a 2. befejezte.

## A NULLADIK SZABÁLY

> **A kép azt mutatja, amiről a hang beszél.** Megerősíti, láthatóvá teszi,
> kihangsúlyozza. Soha nem tér el tőle, soha nem dekoráció. Ha egy effekt
> csak azért kerül be, mert tudjuk vagy kíváncsiak vagyunk rá — kimarad.

## ARCHETÍPUS-CSALÁDOK

A könyvtár **mondattípus szerint** indexelt, nem látvány szerint — így a
nulladik szabály nem fegyelem kérdése, hanem automatikus.

| Család | Db | Példák |
|---|---|---|
| Kijelent | 7 | statement · kicker+statement · display word · hero · step-card · quote · question |
| Szembeállít | 5 | split ✗/✓ · before/after · két sáv · két görbe · átváltás |
| Felsorol | 6 | tiles 2/3/4 · panel-lista kiemelt sorral · sorok egyenként · grid |
| Sorba rendez | 5 | arrow A→B · progress rail · elágazás · tölcsér · ciklus |
| Számol | 5 | count-up · sávpár badge-dzsel · arányos sávok · vonaldiagram · mérőóra |
| Megmutat | 5 | panel-mock · lupés kártya · kontakt-lap · gépelődő mező · kód/parancs |
| Emberré tesz | 3 | personák · avatar-panel · lead-kártya |
| Meghív | 2 | keyword-pill · végkártya |

## KÖLTSÉG-POLITIKA

- **Opus**: script (1. lépés) és jelenet-tábla (4. lépés). Csak ez a kettő.
- **Sonnet / szkript**: minden más — build, javítás, publikálás.
- **0 token**: render, check, snapshot, composite.
- Böngésző-automatizálás (Claude in Chrome) csak kifejezett kérésre.
- Lokális render ingyen van — batch-elhető, éjszakára tehető.

## MÉRT TÉNYEK — ne mérd újra

- Render: `filter:blur` NÉLKÜL a HF gyors `drawElement` capture-re vált:
  **30 mp videó = 54 mp gépidő** (mérve 2026-08-17). Blurral 2× lassabb.
  Ezért a háttér-glow lágy radiális gradiens, nem blur.
- **Soha ne tegyél Google Fonts `<link>`-et a kompozícióba** — ezen a gépen
  nem tüzel a load event, a check/render navigation timeouttal lefagy.
  A compiler helyben injektálja az Intert.
- Hang: narráció + zene EGY artifact. Soha ne relatív dB-vel. → `AUDIO.md`
- Minden render új, időbélyeges fájlnévre.
- Avatar: kör, átlátszó WebM, render UTÁN ffmpeg-gel, **HeyGen méretén** —
  átméretezés tilos. A kompozíció alsó sávja üresen marad neki.
