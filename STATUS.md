# STATUS — hol tartunk MOST

> **Ez az ÁLLAPOT. A módszer a `PIPELINE.md`-ben van.** A kettő nem versenyzik.
> Egy darab van belőle, és felülíródik — nem szaporodik, mint a handoverek.
> A napló a `git log`, nem ez a fájl.

**Frissítve:** 2026-08-18 16:52 · **commit:** lásd `git log -1`
**Elévülés-ellenőrzés:** ha `git log -1` dátuma KÉSŐBBI, mint a fenti, akkor ez a
fájl elavult — **mondd ki, ne menj tovább.** Minden session a végén frissíti.

---

## MOST ÉPP

**A `zg-frames v1.7` DESIGN ALAPOZÁS kész a KÓDBAN, a render ÚJRA FUT.**
A v1.6 render 8p46mp gépidővel elkészült és Zoltán JÓVÁHAGYTA a mozgást — DE a
v1.6 még a design alapozás ELŐTTI verzió. A v1.7-ben minden design-réteg bekerült
(lásd lent). A v1.7 első rendere elhasalt egy gép-újraindítás miatt (a napló
navigation timeout + AudioContext hibát mutat); 16:51-kor újraindítva.

**Amikor a v1.7 render kész** (`_go.bat` mindent lefuttat): `sampler_v1.7.mp4` +
`_sheet17.jpg` + `_split17.jpg` + `_ring17.jpg` + `_skitch17.jpg` +
`_regress/regress-report.md`. A `check` már 0 hiba, a snapshotok jók, a
színvak-bizonyítékok (`_gray_*.png`, `_cvd_*17.png`) jók.

**A baseline MÉG a v1.6.** A v1.7 elfogadása külön lépés, ha Zoltán jóváhagyja a
v1.7 samplert: `regress.ps1 -Video sampler_v1.7.mp4 -Accept`. A regressziós teszt
a v1.7-en SOK változást fog mutatni a v1.6-hoz képest — ez VÁRT, a design
alapozás mindent érintett.

---

## A KÉT KREATÍV KÉRDÉS — LEZÁRVA (2026-08-18)

1. **A bezáruló gyűrű mint kötelező szakaszzáró: MEGVALÓSÍTVA.** A jelenet-tábla
   `data-section-end` jelölésére a `motion.js` magától leteszi a gyűrűt a jobb
   alsó sarokba (a bal alsó az avataré). Lásd `MOTION.md` v1.7.
2. **A hangkészlet: SPECIFIKÁLVA.** `SOUND.md` — hat minta, F dúr pentaton,
   −30 dB a narráció alatt. A `motion.js` kiírja a cue-táblát `window.__zgCues`-ba.
   A hat wav még nincs legyártva; az a `sfx/` mappába kerül majd. Hangmotort NEM
   írunk, csak a táblát + egy ffmpeg receptet (`pipeline\sound.ps1`, még nincs).

---

## A KÖVETKEZŐ MUNKA: "One Sitting Workflow" videó — MÉG NEM KEZDŐDÖTT EL

Ez a 4. lépés lent, és a következő session dolga. NINCS elkezdve.
- A hang és a script MEGVAN: `C:\Users\gdp\HyperFrames\ai-video-workflow\assets\`
  (`vo.mp3`, `vo.srt`, `vo_bgm.mp3`, `transcript.json`). Zoltán a MEGLÉVŐ hangot
  és scriptet akarja, nem újat.
- A régi `ai-video-workflow\index.html` a monolit, 141 jelenetes, NEM a
  könyvtárból épült verzió. Ezt kell lecserélni: mondattábla → jelenet-tábla
  (Opus, archetípus + max 6 szó / mondat) → build a `zg-frames` könyvtárból →
  check → kontakt lap → render → avatar composite.
- Előbb a v1.7 samplert kell jóváhagyni, hogy a videó jóváhagyott könyvtárból
  épüljön.

---

## KORÁBBAN ITT ÁLLT

**A `zg-frames v1.6` JÓVÁHAGYVA.** 5760 kocka, 8p46mp, 192 mp videó. A regressziós
teszt bizonyítottan mér: v1.6-ra 39/39 "same", a régi v1.5-re 29 változott.
Új doksi: `GLOSSARY.md`.

---

## AMI KÉSZ

### A rendszer (git: github.com/YogiZoli/brand-frames)
- **`PIPELINE.md`** — a kánon: 9 lépés, 5 kapu, a határ, négy bázis-réteg,
  költség-politika, mért tények.
- **`SCALE.md`** — betűméret-skála (32·40·50·62·78·98·122), 8-pontos térköz-rács.
- **`DESIGN-FOUNDATION.md` v3.0** — a teljes alapozás. v2.1: biztonsági sáv,
  ikon-nem-betű, mérj-ne-feltételezz, kontraszt-padló. **v3.0 (a legutolsó):**
  OKLCH rampák, SZÍNVAK-ELSŐ szemantika (világosság+alak+szó), semleges
  hőmérséklet-egység, egyidejű kontraszt, 60/30/10, kiegyensúlyozott sortörés,
  két betűvastagság, optikai igazítás és méretkiegyenlítés, valódi 12 oszlopos rács,
  olvasási idő + hossz-tűrés mint MÉRT ellenőrzés, villogás-korlát.
- **`MOTION.md` v1.7** — v1.6: kitöltés mérésből, üres üveg, popin, öt új család.
  **v1.7:** négy easing, tömeg-arányos időzítés, sebesség-plafon (1800 px/mp),
  irány-szemantika, mozgás-hierarchia (`data-hero`), a VÉDJEGY-GYŰRŰ.
- **`SOUND.md`** — a hangkészlet spec (hat minta). ÚJ.
- **`GLOSSARY.md`** — szakszavak példákkal + a teljes end-to-end folyamat. ÚJ.
- **`FEEDBACK-LOG.md`** — Zoltán általános szabályai dátumozva (4 adag, a legutolsó
  a HF-v6 öt képe).
- **`BOOTSTRAP.md`** + Drive „Laptopcsere" doksi.
- **`_feedback/`** — a feedback egyetlen helye.

### A könyvtár (`zg-frames/`) — **v1.7, TELJES**
- `zg.css` · `motion.js` · `icons.js` (16 ikon + 5 rajzolt marker-glyph)
- `type.js` — **ÚJ**, írásjel-kultúra (nbsp, hármaspont, idézőjel, szorzójel),
  a build ELŐTT fut, kódot sosem érint.
- `index.html` — a motion sampler, **39 jelenet, 194 mp** (a v1.7-ben pár jelenet
  fél mp-cel hosszabb, mert az olvasási idő audit ezt követelte)
- **A tervezett ~38 archetípus mind megvan.** A v1.6-ban került be az utolsó tíz:
  elágazás · tölcsér · ciklus · mérőóra · idézet · kérdés · előtte/utána · grid ·
  parancs · lead-kártya.
- `regress.ps1` — **a regressziós teszt.** Kiolvassa a jelenet-táblát az
  `index.html`-ből, jelenetenként egy reprezentatív kockát vág, RMSE-vel
  összehasonlítja a `baseline/`-nal, kiírja MELYIK archetípus változott, és a
  változottakról deuteranópia-szimulációt is renderel. 0 token, csak ffmpeg.
  `-Accept` kapcsolóval a mostani render lesz az új igazság.
- Állapot: **`lint` 0 hiba · `check` 0 hiba · kontraszt 57/57 WCAG AA.**

### Belépési pontok — mindenhol pointer, sehol másolat
`C:\Users\gdp\CLAUDE.md` · `HyperFrames\CLAUDE.md` · `ai-video-workflow\CLAUDE.md`
+ `AGENTS.md` · `_frames` összes .md-je · két skill · két projekt-utasítás · Drive.

---

## A KÖVETKEZŐ LÉPÉS

1. **v1.7 sampler megnézése** (`sampler_v1.7.mp4`, 16:51-kor újraindított render).
   Ha jó: `zg-frames v1.7 jóváhagyva` — és egyszer lefut a
   `.\regress.ps1 -Video sampler_v1.7.mp4 -Accept`, ami baseline-ná teszi.
2. **A „One Sitting Workflow" videó újraépítése** a könyvtárból, jelenet-táblával.
   A hang és a script megvan (`ai-video-workflow\assets\`). Ez a következő session
   nagy feladata. Ez zárja a kört és bizonyítja, hogy a rendszer működik.
3. Végső render + avatar composite + publikálás.

---

## FÉLBEHAGYVA / NYITOTT

- **A `HF-v4-feedback` képekből 5 nincs beolvasva** (02, 03, 05, 06, 08).
- **A két kreatív javaslat LEZÁRVA** (2026-08-18): a bezáruló gyűrű mint kötelező
  szakaszzáró MEGVALÓSÍTVA (`data-section-end`), a hangkészlet SPECIFIKÁLVA
  (`SOUND.md`). A hat wav legyártása maradt hátra (`sfx/` mappa).
- A `lint` két figyelmeztetése (`composition_file_too_large`,
  `timeline_track_too_dense`) **szándékos** a samplernél: az egész értelme, hogy
  minden archetípus egy fájlban, egy idővonalon legyen. Igazi videóknál ez a két
  figyelmeztetés viszont komolyan veendő.
- Az `ai-video-workflow/index.html` a RÉGI, monolit videó. Nem hibás, de nem a
  könyvtárból épül — a 2. lépésben cseréljük.

---

## AMIT SOHA

Saját render-/videó-/hangmotor (`exp-v9`) · narancs · sötét háttér · `filter:blur` ·
Google Fonts `<link>` · nevesített betűcsalád `@font-face` nélkül · kitalált szám ·
jelentés csak színen · font karakter ikon helyett · `pathLength` körön ·
tartalom összenyomása, hogy beférjen · feedback a chatben, könyvtár helyett.
