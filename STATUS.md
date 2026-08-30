# STATUS — hol tartunk MOST

> **Ez az ÁLLAPOT. A módszer a `PIPELINE.md`-ben van.** A kettő nem versenyzik.
> Egy darab van belőle, és felülíródik — nem szaporodik, mint a handoverek.
> A napló a `git log`, nem ez a fájl.

**Frissítve:** 2026-08-30 (pipeline tooling kör: review lap 3 kocka + mondattábla-időzítés + kép/hang lint) · **commit:** lásd `git log -1`
**Elévülés-ellenőrzés:** ha `git log -1` dátuma KÉSŐBBI, mint a fenti, akkor ez a
fájl elavult — **mondd ki, ne menj tovább.** Minden session a végén frissíti.

---

## AVATAR COMPOSITE — MEGOLDVA (2026-08-24, Cowork)

Ez az ÉRVÉNYES igazság. A teljes, végleges recept mostantól a **`PIPELINE.md`**
„AVATAR COMPOSITE — a végleges recept" szekciójában él (a kánonban, mert az nem
íródik felül), és a wrapper `pipeline\avatar_composite.ps1` futtatja.

**Gyökérok megoldva:** a natív HeyGen webm alfa VÉGIG jó volt. A korábbi „100%
opaque" mérés hibás módszerből jött: egykockás PNG-kinyerés (image2/png muxer)
elveszti a VP9 alfa BlockAdditional adatát. FONTOS: a VP9 itt a webm codecje,
NEM az elhagyott exp-v9 motor. Helyes mérés explicit dekóderrel plusz
filtergráffal (`-c:v libvpx-vp9 ... alphaextract,signalstats`): kockánként
YMIN=0 (átlátszó háttér) és YMAX=255 (subject). Valódi alfa van.

**Következmény:** NINCS colorkey / chromakey / blur / denoise / median / maszk
lépés. Mind kidobva.

**MÓD-DÖNTÉS (Zoltán, 2026-08-24): B mód = Segments az ALAP.** Az avatar CSAK a
megszólalás-szigetekre kerül (nyitás, záró CTA, 1-2 kulcspillanat), nem végig.
Ez a olcsóbb, mert csak a valóban generált másodpercek fogyasztanak kreditet.
A Full mód (avatar végig a sarokban) marad opció, de csak külön kérésre.

**MOTOR-DÖNTÉS (Zoltán, 2026-08-24): avatar_iii MARAD minden videóhoz.** Mért
költség: III 3,42 mp = 1 kredit, render ~90 mp; V 8,62 mp = 8 kredit, render
7,5 perc. A V kb. háromszoros kredit/mp és ötszörös render, nem éri meg.
Avatar V-t nem használunk. (Kredit forrás: Creator előfizetés, most 760 kredit;
az API wallet külön ~5 USD, nem üres.)

**Zoltán SAJÁT avatarja:** csoport „Zoltan Gero"
`d713cb1c2fd9468daf21c129768c746c` (NEM a Bakkon2, az Mátéé). Lookok: Eye
Contact Correction `c26abf3b9a3e424d856cfa14533df6a8` (fekete póló) és
`48a6d85ff4a64c3e993c150dc465a5ee` (kék póló); sima Zoltan Gero
`cba5e2fdb31e4f48bb263e3d3b7a351d`. Zoltán a kék pólós Eye Contact Correction
lookot kedvelte.

**Bizonyító demók:** `assets\_preview_avatar_nativealpha_2026-08-24.mp4` (III,
fekete póló) és `assets\_preview_avatar_sync_V_2026-08-24.mp4` (V, kék póló,
tökéletes szinkron, csak referencia).

---

## MOST ÉPP

**BRAND KANON ÁTVEZETÉS A HR-BE (2026-08-29, Zoltán döntése).** A friss, up-to-date
igazság a `C:\Users\gdp\projects\design-system\tokens.css` + `README.md`. A HyperFrames
réteg innentől abból származik, nem fordítva.

Megtörtént ebben a körben:
- `_frames/zoltan-gero/tokens.css` — a kánon tükre, video-réteggel (új).
- `_frames/zoltan-gero/fonts/` — Open Sans 400-800 helyi `.ttf` + `fonts.css` `@font-face` (új).
- `_frames/zoltan-gero/BRAND-BRIDGE.md` — token-leképezés + a szándékos eltérések regisztere (új).
- `_frames/zoltan-gero/brand.css` — a `--hf-*` híd rákötve a kánonra.
- `_frames/zg-frames/zg.css` — paletta, betű, radius, árnyék a kánon szerint; a régi
  "v1.7 TELJES DESIGN ALAPOZÁS" OKLCH + színvak-első blokk **törölve** (Zoltán: nem kánon),
  helyette kompakt video-strukturális blokk. 952 sor → 772 sor.
- `_frames/zoltan-gero/FRAME.md` v4.0, `DESIGN.md`, `DESIGN-FOUNDATION.md` fejléc: átvezetve.

Második kör (2026-08-29, sorrend 2-1-3):
- **2.** Az 5 `content_overlap` hiba javítva: `data-layout-allow-overlap` a jelzett
  leveleleken (`.lenstxt`, before/after `.bkey/.bval/.bnote`). Ezek a kánon előttről voltak.
- **1.** Palettamaradványok átvezetve: `README.md`, `BLOCKS.md`, `DESIGN.md`,
  `frame-showcase.html` (utóbbiból a VoxFlow `#ft-override` szennyeződés is kitörölve,
  Google Fonts `<link>` helyett helyi Open Sans). `SCALE.md` / `GLOSSARY.md` tiszta volt.
- **3.** `hyperframes check`: **PASSED**, 0 hiba, motion 0/0, kontraszt 58/58 WCAG AA,
  nincs Google Fonts fetch (helyi `@font-face` a `zg-frames/fonts/`-ból). `lint`: 0 hiba,
  2 figyelmeztetés (`composition_file_too_large`, `timeline_track_too_dense`) — ezek a
  samplernél SZÁNDÉKOSAK (egy fájl mind a 39 archetípus), éles videónál sub-kompokra bomlik.

Harmadik kör (2026-08-29 este, sampler feedback 10 kép, `_feedback/2026-08-29/`):
- Új sampler render a kánonon: `sampler_2026-08-29_final.mp4` (39 archetípus, 194 mp).
- zg26 verziószám kivéve: "ONE LIBRARY", nem tud elavulni.
- 7 feedback-javítás a könyvtáron, mind a `FEEDBACK-LOG.md` 2026-08-29 bejegyzésben:
  valódi kurzor-SVG, auto-pulzálás minden gombon, KEYWORD router (`kroute` + 3 pill,
  a gyenge "APPROVAL POINT 04" törölve), BRANCH korongok kontraszt, FUNNEL 4 lépcső
  kánonon belül elkülönítve, GAUGE ív/mutató szinkron (`* .5` hiba javítva), LENS
  felső unfold felirat (`unfold` mozgás).
- `check`: PASSED, 0 hiba, kontraszt 58/58, 2 ismert lint-warning (sampler méret).

Negyedik kör (2026-08-29 este, sampler feedback 10 kép, `_feedback/2026-08-29/` minor/mouse/router/arrow/flywheel/quote):
- 13 apró javítás 6 jelenetre: LENS feliratok a panel alá + lupe soha nem üres
  (a régi "blank while it travels" elv felülírva), FORM kurzor végigmegy a mezőkön
  mielőtt gépel + gomb-glow minden gombon (`btnPulse`), KEYWORD router valódi
  szétágazó lábakkal + ikon minden pill elé, ARROW végigfutó nyílhegy, CYCLE
  csomópont-szinkron (lineáris töltés), QUOTE dőlt + author jobbra + záró
  idézőjel csak a végén.
- Új render: `sampler_2026-08-29_v6.mp4`. `check`: PASSED, 0 hiba, 58/58.

**JÓVÁHAGYVA (Zoltán, 2026-08-29 22:00).** A `sampler_2026-08-29_v6.mp4` az ÚJ
regressziós baseline (`regress.ps1 -Accept` lefutott, `baseline/APPROVED.txt`
frissítve, 39 archetípus). Drive tükör: `📺 YouTube & Content/zg-frames/`.
A `zg-frames` könyvtár mostantól a brand kánonon áll, jóváhagyott mozgással.
Minden éles videó erre a könyvtárra épülhet.

**KÖVETKEZŐ: a "One Sitting Workflow" videó újraépítése a könyvtárból** (lásd lent).
A `frame-showcase.html` teljes újratördelése: fejlesztési tétel.

VoxFlow: **nem nyúltunk hozzá** (Máté csatornája).

---

## PIPELINE TOOLING KÖR (2026-08-30, Zoltán jóváhagyta 3+4, 1+2 egyben)

Négy fejlesztés az éles videó előtt, mind 0 token (ffmpeg / szövegfeldolgozás):

- **3. Before/after review lap.** `regress.ps1`: minden CHANGED jelenethez 3x3
  tábla (BASELINE / THIS RENDER / WHAT MOVED sor, 25/55/85% oszlop) +
  `_move_<id>.mp4` (baseline a régi render mellett, szinkronban). Összefűzve
  `review-sheet.png` + `review-motion.mp4`. A `-Accept` mostantól elrakja a
  jóváhagyott rendert `baseline/baseline.mp4`-ként (a mozgás-oldalhoz).
- **4. Jelenet-időzítés a mondattáblából.** Új: `pipeline/sentences.ps1`
  (STT/SRT → `sentences.json` + `sentences.md` + `words.json`),
  `pipeline/stamp-timing.ps1` (a jelenet `data-sent="S12"` / `S12-S15` /
  `S20#1/3` horgonyt visz, a szkript tölti a `data-start`/`data-duration`-t),
  `pipeline/TIMING.md` (a kánon). `PIPELINE.md` 3-4-5-6 sor + `SCENE-TABLE.md`
  fejléc átvezetve. Egyetlen jelenet sem hordoz kézzel írt időzítést többé.
- **1. Regresszió 3 kocka.** `regress.ps1` jelenetenként 3 kockát vág (25/55/85%),
  mindhármat a baseline-hoz méri, a verdikt a legrosszabb. Elkapott egy mozgás-
  regressziót amit a régi 78%-os egykockás teszt elnézett (zg32 CYCLE: 25%-nál
  eltér, végén stimmel). A baseline formátuma `<id>_0/1/2.png`. Régi egykockás
  baseline-nal visszaesik 78%-os összevetésre és `-Accept`-et kér.
- **2. Kép kontra hang lint.** Új: `pipeline/image-audio-lint.ps1`. A jelenet
  képernyő-szavait összeveti a jelenet időablakában elhangzott szavakkal, jelzi
  a csúszást. NEM a 3. kapu, csak triviális szűrő. A régi monoliton próbálva:
  141 jelenetből 119 tiszta, 22 jelölt (nagyrészt paraphrase/CTA, pár valódi).

**A baseline NEM lett újra-elfogadva.** A `baseline/` a v6 egykockás marad
(commit 0e25522). Zoltán futtassa: `regress.ps1 -Video sampler_2026-08-29_v6.mp4
-Accept`, ha kész a 3 fázisú baseline-re, és azt külön commitolja.

`ai-video-workflow/SCENE-TABLE.md` szerkesztve (nem git repo, csak lemezen +
Drive tükör).

---

**A régi állapot (elavult): `zg-frames v1.7` JÓVÁHAGYVA ÉS BASELINE (2026-08-18).**
A v1.7 baseline-t a fenti paletta-csere felülírja. Új sampler kell, mielőtt bármelyik
éles videó erre a könyvtárra épül.

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

Ez a 2. lépés lent, és a következő session dolga. NINCS elkezdve.
- A hang és a script MEGVAN: `C:\Users\gdp\HyperFrames\ai-video-workflow\assets\`
  (`vo.mp3`, `vo.srt`, `vo_bgm.mp3`, `transcript.json`). Zoltán a MEGLÉVŐ hangot
  és scriptet akarja, nem újat.
- A régi `ai-video-workflow\index.html` a monolit, 141 jelenetes, NEM a
  könyvtárból épült verzió. Ezt kell lecserélni: mondattábla → jelenet-tábla
  (Opus, archetípus + max 6 szó / mondat) → build a `zg-frames` könyvtárból →
  check → kontakt lap → render → avatar composite (B mód, Segments).

---

## KORÁBBAN ITT ÁLLT

**A `zg-frames v1.6` JÓVÁHAGYVA.** 5760 kocka, 8p46mp, 192 mp videó. A regressziós
teszt bizonyítottan mér: v1.6-ra 39/39 "same", a régi v1.5-re 29 változott.
Új doksi: `GLOSSARY.md`.

---

## AMI KÉSZ

### A rendszer (git: github.com/YogiZoli/brand-frames)
- **`PIPELINE.md`** — a kánon: 9 lépés, 5 kapu, a határ, négy bázis-réteg,
  költség-politika, mért tények, ÉS a végleges avatar composite recept.
- **`SCALE.md`** — betűméret-skála (32·40·50·62·78·98·122), 8-pontos térköz-rács.
- **`DESIGN-FOUNDATION.md` v3.0** — a teljes alapozás. v3.0: OKLCH rampák,
  SZÍNVAK-ELSŐ szemantika (világosság+alak+szó), semleges hőmérséklet-egység,
  egyidejű kontraszt, 60/30/10, kiegyensúlyozott sortörés, két betűvastagság,
  optikai igazítás és méretkiegyenlítés, valódi 12 oszlopos rács, olvasási idő +
  hossz-tűrés mint MÉRT ellenőrzés, villogás-korlát.
- **`MOTION.md` v1.7** — négy easing, tömeg-arányos időzítés, sebesség-plafon
  (1800 px/mp), irány-szemantika, mozgás-hierarchia (`data-hero`), a
  VÉDJEGY-GYŰRŰ.
- **`SOUND.md`** — a hangkészlet spec (hat minta).
- **`GLOSSARY.md`** — szakszavak példákkal + a teljes end-to-end folyamat.
- **`FEEDBACK-LOG.md`** — Zoltán általános szabályai dátumozva.
- **`BOOTSTRAP.md`** + Drive „Laptopcsere" doksi.
- **`_feedback/`** — a feedback egyetlen helye.
- **`pipeline\avatar_composite.ps1`** — a kánon avatar composite wrapper
  (B mód = Segments alap, Full mód opció, beépített alfa-ellenőrzés). ÚJ.

### A könyvtár (`zg-frames/`) — **v1.7, TELJES**
- `zg.css` · `motion.js` · `icons.js` (16 ikon + 5 rajzolt marker-glyph)
- `type.js` — írásjel-kultúra (nbsp, hármaspont, idézőjel, szorzójel),
  a build ELŐTT fut, kódot sosem érint.
- `index.html` — a motion sampler, **39 jelenet, 194 mp**.
- **A tervezett ~38 archetípus mind megvan.**
- `regress.ps1` — a regressziós teszt. Kiolvassa a jelenet-táblát az
  `index.html`-ből, jelenetenként egy reprezentatív kockát vág, RMSE-vel
  összehasonlítja a `baseline/`-nal, kiírja MELYIK archetípus változott, és a
  változottakról deuteranópia-szimulációt is renderel. 0 token, csak ffmpeg.
- Állapot: **`lint` 0 hiba · `check` 0 hiba · kontraszt 57/57 WCAG AA.**

### Belépési pontok — mindenhol pointer, sehol másolat
`C:\Users\gdp\CLAUDE.md` · `HyperFrames\CLAUDE.md` · `ai-video-workflow\CLAUDE.md`
+ `AGENTS.md` · `_frames` összes .md-je · két skill · két projekt-utasítás · Drive.

---

## A KÖVETKEZŐ LÉPÉS

1. **A „One Sitting Workflow" videó újraépítése** a könyvtárból, jelenet-táblával.
   A hang és a script megvan (`ai-video-workflow\assets\`). Ez a következő session
   nagy feladata. Ez zárja a kört és bizonyítja, hogy a rendszer működik.
2. Végső render + avatar composite (B mód, `avatar_composite.ps1`) + publikálás.

---

## FÉLBEHAGYVA / NYITOTT

- **A `HF-v4-feedback` képekből 5 nincs beolvasva** (02, 03, 05, 06, 08).
- A hat hang-wav legyártása maradt hátra (`sfx/` mappa).
- A `lint` két figyelmeztetése (`composition_file_too_large`,
  `timeline_track_too_dense`) **szándékos** a samplernél. Igazi videóknál viszont
  komolyan veendő.
- Az `ai-video-workflow/index.html` a RÉGI, monolit videó. Nem hibás, de nem a
  könyvtárból épül — a következő lépésben cseréljük.

---

## AMIT SOHA

Saját render-/videó-/hangmotor (`exp-v9`) · narancs · sötét háttér · `filter:blur` ·
Google Fonts `<link>` · nevesített betűcsalád `@font-face` nélkül · kitalált szám ·
jelentés csak színen · font karakter ikon helyett · `pathLength` körön ·
tartalom összenyomása, hogy beférjen · feedback a chatben, könyvtár helyett ·
avatar composite-nál: colorkey / chromakey / blur / denoise / median / kör-maszk /
képarány-torzítás (stretch) · avatar_v (túl drága) · zöldháttér.

---

## E2E TESZT — BUILD ÉS RENDER MŰKÖDIK (2026-08-24, "One Sitting Workflow")

**Ezt ne kérdőjelezd meg újra:**
- A "csak sc001 renderel" gyanú HAMIS RIASZTÁS volt. A snapshot mintavételi
  időpontjai korábban túl közel estek az egyes jelenetek kezdetéhez, mielőtt a
  GSAP belépő animáció lefutott volna (az elemek opacity:0-ról indulnak).
  Jelenet-kezdet + 2 mp-cel mintavételezve mind a nyolc ellenőrzött archetípus
  helyesen renderel. **Nem kell stock opening sub-kompot építeni.**
- Teljes render lefutott hiba nélkül: `aivw_onesitting_e2e_2026-08-24_1803.mp4`,
  109.7 MB, 9m22.5s, 21 perc gépidő (30fps, 16875 kocka, 3 worker).
- `hyperframes check`: 0 error, csak lint/olvashatóság-figyelmeztetések (ismertek).
- GSAP: CDN-re visszaállítva (utolsó ismert működő állapot). Nyitott: vagy CDN
  marad, vagy HF injektálja a gsap-ot és a tag törölhető (tesztelendő snapshottal).

**MI TÖRTÉNT PUBLIKÁLÁSSAL: SEMMI.** Nem futott YouTube feltöltés, nem futott
publish-yt-url skill. A publikálás továbbra sem történt meg.

**KÖVETKEZŐ ÚJ E2E TESZT (Zoltán bejelentette): teljesen 0-ról, a
video-script lépéstől indul.** Az avatar composite immár megoldott (B mód,
`avatar_composite.ps1`), tehát a korábbi avatar-blokkoló megszűnt.
