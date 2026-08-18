# STATUS — hol tartunk MOST

> **Ez az ÁLLAPOT. A módszer a `PIPELINE.md`-ben van.** A kettő nem versenyzik.
> Egy darab van belőle, és felülíródik — nem szaporodik, mint a handoverek.
> A napló a `git log`, nem ez a fájl.

**Frissítve:** 2026-08-18 11:20 · **commit:** lásd `git log -1`
**Elévülés-ellenőrzés:** ha `git log -1` dátuma KÉSŐBBI, mint a fenti, akkor ez a
fájl elavult — **mondd ki, ne menj tovább.** Minden session a végén frissíti.

---

## MOST ÉPP

**A `zg-frames v1.6` JÓVÁHAGYVA (2026-08-18).** A render kész: 5760 kocka,
8 perc 46 másodperc, 192 másodperc videó. A `baseline/` mappa mostantól a v1.6
39 referenciakockáját tartalmazza, a régi v1.0 a `baseline_v1.0_archiv/`-ban van.

**A regressziós teszt él és bizonyítottan mér.** A v1.6-ra 39 jelenetből 39
"same", nulla eltérés. A régi v1.5-re ráeresztve 29 változott jelenetet talált,
tízet pedig helyesen jelölt "NINCS A RENDERBEN"-nek. Egy teszt, ami mindig zöld,
nem teszt. Ez nem az.

**Új doksi:** `GLOSSARY.md`, a szakszavak példákkal és a teljes end-to-end
folyamat, a stratégiától a publikálásig. Ez Zoltánnak szól, nem a gépnek.

**A következő munka a 4. lépés lent:** a "One Sitting Workflow" videó
újraépítése a könyvtárból, jelenet-táblával.

---

## KORÁBBAN ITT ÁLLT

**A `zg-frames v1.6` rendere fut** — 39 archetípus, 192 mp, kb. 8–12 perc gépidő.
Ez az első verzió, ami a **teljes** könyvtárat tartalmazza, és az első, amit
a `regress.ps1` automatikusan összehasonlít a baseline-nal.

Ha a render kész (a `_go.bat` magától lefuttatja mindet):
`sampler_v1.6.mp4` · `_sheet16.jpg` (8×5 kontakt lap) · `_ring16.jpg` ·
`_skitch16.jpg` · `_lens16.jpg` · `_regress/regress-report.md`.

---

## AMI KÉSZ

### A rendszer (git: github.com/YogiZoli/brand-frames)
- **`PIPELINE.md`** — a kánon: 9 lépés, 5 kapu, a határ, négy bázis-réteg,
  költség-politika, mért tények.
- **`SCALE.md`** — betűméret-skála (32·40·50·62·78·98·122), 8-pontos térköz-rács.
- **`DESIGN-FOUNDATION.md` v2.1** — a teljes alapozás + a HF-v6 kör négy új szabálya:
  biztonsági sáv (`flex:0 0 auto`), ikon-nem-betű a jelekre is, mérj-ne-feltételezz
  (`pathLength`), kontraszt-padló (a `-500` fokozat nem hordoz fehér szöveget).
- **`MOTION.md` v1.6** — kitöltés mérésből, üres üveg repülés közben, `popin`,
  az öt új család mozgása.
- **`FEEDBACK-LOG.md`** — Zoltán általános szabályai dátumozva (4 adag, a legutolsó
  a HF-v6 öt képe).
- **`BOOTSTRAP.md`** + Drive „Laptopcsere" doksi.
- **`_feedback/`** — a feedback egyetlen helye.

### A könyvtár (`zg-frames/`) — **v1.6, TELJES**
- `zg.css` · `motion.js` · `icons.js` (16 ikon + 5 rajzolt marker-glyph)
- `index.html` — a motion sampler, **39 jelenet, 192 mp**
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

1. **v1.6 sampler megnézése.** Ha jó: `zg-frames v1.6 jóváhagyva` — és
   **egyszer** lefut a `.\regress.ps1 -Video sampler_v1.6.mp4 -Accept`, ami ezt a
   rendert teszi baseline-ná. Innentől minden könyvtár-változás után csak a szkript
   fut, és megmondja, mi változott.
2. **A „One Sitting Workflow" videó újraépítése** a könyvtárból, jelenet-táblával.
   Ez zárja a kört és bizonyítja, hogy a rendszer működik.
3. Végső render + avatar composite + publikálás.

---

## FÉLBEHAGYVA / NYITOTT

- **A `HF-v4-feedback` képekből 5 nincs beolvasva** (02, 03, 05, 06, 08).
- **Két kreatív javaslat, döntésre vár:** a „bezáruló gyűrű" mint védjegy-mozdulat
  MINDEN szakaszzáró jeleneten (a mozgás megvan, a *policy* hiányzik); és egy
  5-6 mintás halk hangkészlet a mozgáshoz.
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
