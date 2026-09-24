# STATUS — hol tartunk MOST

> **Ez az ÁLLAPOT. A módszer a `PIPELINE.md`-ben van.** A kettő nem versenyzik.
> Egy darab van belőle, és felülíródik — nem szaporodik, mint a handoverek.
> A napló a `git log`, nem ez a fájl.

**Frissítve:** 2026-09-24 (a pipeline Node-on, tiszta környezetben tesztelve) · **commit:** lásd `git log -1`
**Elévülés-ellenőrzés:** ha `git log -1` dátuma KÉSŐBBI, mint a fenti, akkor ez a
fájl elavult — **mondd ki, ne menj tovább.** Minden session a végén frissíti.

---

## A PIPELINE NODE-ON (2026-09-24, packaged-video-creator 0. fázis)

A 9 PowerShell szkript `.mjs` párt kapott (`7997877`), a kimenetük bájtra
azonos. A dokumentáció (PIPELINE, TIMING, GLOSSARY) mostantól a Node
parancsokat mutatja. A `.ps1` fájlok tartalékként maradnak, a törlésükről
Zoltán dönt.

**Éles próba tiszta környezetben:** a C2C videó végigment a Node láncon egy
friss klónból, üres felhasználói profillal, csak Node-dal a PATH-ban. A
mondattábla bájtra egyezik a jóváhagyottal, `check` PASSED, render 72,27 mp,
-14,4 LUFS, az avatar composite után a kép a jóváhagyott v4-hez mérve
átlagosan 43,8 dB PSNR (szemre azonos). Részletek és mérések:
`packaged-video-creator/docs/phase-0.md`.

Ebben a körben a kánonban:
- `package-lock.json` a repóba (friss klónnál eddig más alcsomag-verziók jöttek).
- PIPELINE avatar hang: az `--audio` csak néma háttér-rendernél kell, különben
  a `-shortest` levágja a végkártya kitartását.

**Nincs portolva, a repón kívül él:** `HyperFrames/pipeline/tts*.ps1` (ElevenLabs
TTS). Az appban ez a `runner/providers` része lesz, nem a kánoné.

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

**A baseline újra-elfogadva 3 fázisúra** (Zoltán, 2026-08-30, commit aae25d4).
Ugyanaz a jóváhagyott v6 render, most `baseline/<id>_0/1/2.png` (25/55/85%),
a `baseline.mp4` gitignore-olt referencia. `regress.ps1 -Video v6` = 39/39
változatlan.

`ai-video-workflow/SCENE-TABLE.md` szerkesztve (nem git repo). Drive tükör:
`📺 YouTube & Content/One Sitting Workflow/` (SCENE-TABLE.md + TIMING.md).

---

## ARCHETÍPUS BLOKKOK — MIND A 39 KINYERVE, SAMPLER = MOUNT HOST (2026-08-30)

Cél: minden archetípus markupjának EGY forrása legyen, ne kézi másolat minden
videóban. Mechanizmus: HyperFrames sub-kompozíciók, `data-composition-src`.

**Kész:**
- `blocks/<name>/<name>.src.html` — mind a 39 archetípus kanoni markupja, egy-egy
  forrásfájlban. `blocks/extract.ps1` egyszer lefutott (a monolit `<section>`-jeiből).
- `blocks/build.ps1` — generátor: a `.src.html` köré inlineolja a közös `zg.css` +
  `type.js` + `icons.js` + `motion.js` fájlokat, kiad egy mountolható sub-kompot
  (`<name>.html`, `<template>` transport-alak). Tükröz a `_frames/blocks/<name>/`
  promoted könyvtárba is. `blocks/make-fontface.ps1` → `_fontface.css` (Open Sans
  base64, mert a sub-kompba se host `@font-face`, se relatív út nem jut be megbízhatóan).
- `blocks/assemble-sampler.ps1` — az `index.html`-t 39 mount slotra írja át (a
  monolit 471 sora helyett). Az időzítés a blokkok saját `duration`-jából jön (194 mp).
- `motion.js`: `ZG.build(id)` mellé `ZG.buildIn(root, id)` — egy mountolt blokkot a
  saját root-jára szűkítve épít. `icons.js` `paint(scope)`, `type.js` `run(scope)`
  ugyanígy. A belépők `tl.from` → `tl.fromTo` (seek-stabil sub-kompban, hyperframes-core
  ajánlás). A cam-push külön `fromTo`, a settle UTÁN indul.
- `zg.css`: `.ptitle` és `.reck` színe `--label` → `--muted` (2,55:1 → 4,7:1, AA-javítás
  a monoliton is).
- `regress.ps1` scene-tábla parszere olvassa a slot-listát is.
- `arrow`, `funnel`, `lens` kézzel írt `data-var-text` változó-felülettel (a többi 36
  egyelőre változó nélkül, alapértékkel a sampler tartalma).

**`hyperframes check` a mount hoszton: PASSED, 0 error, 0 warning, 58/58 WCAG AA**
(pontosan mint a monolit), 2 ismert info (device-footage zoom).

**ISMERT ELTÉRÉS — a mountolt render kb. 3-4%-kal nagyobb kerettel jön, mint a
monolit.** Egyenletes mind a 39 jeleneten, nem jelenet-hiba. A sub-komp
kompozitálás sajátja: se `#root`/slot CSS `transform`, se a `<template>` vs
no-template alak, se a font, se a cam-animáció nem befolyásolja (mindet
végigpróbáltam). Ez a mostantól érvényes néz.

**Még NEM változó:** attribútumban élő mozgás-paraméterek (lens `data-path` /
`data-words`, ikon `data-icon`). Következő: init-script a `getVariables()`-ből.

**JÓVÁHAGYVA (Zoltán, 2026-08-31): "jobb mint volt, eddigi legjobb."** Az új
regressziós baseline: `sampler_blocks_2026-08-30_2343.mp4` (`regress.ps1 -Accept`
lefutott, `baseline/<blokknev>_0/1/2.png` + `baseline.mp4`, 39 archetípus,
3 fázisú; `regress.ps1 -Video sampler_blocks_2026-08-30_2343.mp4` = 39/39 same).
A `zg-frames` könyvtár mostantól a mountolt blokkokon áll. A
`sampler_2026-08-29_v6.mp4` baseline LEVÁLTVA. Monolit a git történetben:
`git show 417ab8e:zg-frames/index.html`. Drive tükör: `📺 YouTube & Content/zg-frames/`
(`sampler_blocks_2026-08-30_2343.mp4` + `_sheet_blocks.jpg`).

---

## SEAMLESS ÉLES-VIDEÓ LÁNC (2026-08-31) — KÉSZ, TESZTELVE

A blokk-refaktor után a hiányzó darab: scene-tábla to mountolt videó, kézi
szerkesztés nélkül. Most megvan.

**Minden blokk teljes szöveg + attribútum változó-felülettel:**
- `blocks/add-vars.ps1` — a szöveg-leveleket bedrótozza (`data-vars='{"text":"id"}'`),
  a deklarációkat a meta-fejlécbe. `blocks/_fixvars.ps1` — a beágyazott ikon/emphasis
  spanokat is (contact-record, funnel, branch, cycle, gauge, command, lead-card…).
- **A `build-video.ps1` build-időben belesüti** a scene értékeit a per-scene
  composition-fájlba (a `data-vars`-t utána leszedi). NINCS HF runtime változó-rendszer
  a render-útban: a HF a `--<id>` CSS propot csak bizonyos neveknél adja meg
  (`sub`, `leftLabel` stb. nem), a besütés ezt megkerüli. Bármilyen név működik.
- `motion.js` `ZG.applyVars()` megvan a Studio elő-nézethez (a `--<id>` propból);
  a renderben nem számít.

**`blocks/build-video.ps1`** — a scene-lista (JSON: `{block, sent, vars}` per
jelenet) to `../index.html` + `compositions/<sceneId>.html`. Minden mountolt
instance EGYEDI `data-composition-id` (`s001-statement`): ismétlődő id-nél a
per-instance változók összeakadnak és defaultra esnek. Ezért scene-enként egy
byte-másolat blokk, csak az id cserélve, a `blocks/<name>/<name>.html` marad a forrás.

**`data-scene-dur`** (motion.js + build.ps1) — a szerzői mozgás-hossz külön a
`data-duration`-től (600 mp-es clip-ablak). Enélkül egy hosszú jelenet a blokk
szerzői hossza után elsötétül; így tartja a végkockát.

**`pipeline/stamp-timing.ps1`** — olvassa a mount-slot listát is (nemcsak a régi
`<section class="clip">`-et), `data-sent` to `data-start`/`data-duration` a
sentences.json-ból.

**`blocks/catalog.ps1` to `blocks/CATALOG.md`** — minden archetípus + változói +
hossz. Ezt olvassa Opus a scene-lista írásához (PIPELINE 4.).

**`motion.js` egyéb:** cam-exit fade eltávolítva (a slot-életciklus vág), belépők
`from` to `fromTo` (baseline-ben már), `A.wipe` `left` to `x` (lint:
gsap_non_transform_motion). Mind transzparens a baseline-re: `regress` 39/39 same,
`check` 58/58 WCAG AA.

**Tesztelve:** 11 jelenetes scene-lista a meglévő `vo.srt`-ből, `build-video` to
`stamp-timing` to `check` (PASS) to `snapshot`. Minden jelenet a saját szövegével,
ikonjaival, lupe-szavaival renderel; az ismételt archetípusok (statement 2x)
külön tartalommal; a hosszú jelenetek tartják a végkockát.

**HÁTRA:** Zoltán 0-ról kipróbálja egy új videóval egy új chatben. Prompt a
session válaszában.

---

## ELSŐ ÉLES VIDEÓ 0-RÓL — C2C / "One Idea In A Published Video Out" (2026-09-01)

A seamless lánc végigfutott 0-ról, egy új chatben. Working dir:
`ai-video-workflow/c2c/` (nem git repo). Végső jóváhagyott render (VLC-ben,
Zoltán): `zg-frames/renders/c2c_v2_2026-09-01.mp4`, 72,3 mp, 16 jelenet,
−14,4 LUFS.

**A menet ami működött:**
1. Script: a régi `vo.srt` nyitó íve, Zoltán a Drive doksiban átírta. Gate: Drive doc.
2. VO: IGAZI ElevenLabs (`pipeline/tts2.ps1`, Z HU mic 06, speed 0.96) + BGM mix
   (`bgm_v3.wav`, −38 dB, sidechain ducking, loudnorm −14). Két fájl, egy jóváhagyás.
3. Mondattábla: `sentences.ps1 -Stt` a ElevenLabs Scribe STT-ből (23 mondat).
4. Jelenet-lista: `c2c/scenes.json` (16 jelenet). Gate: Drive doc.
5. build-video to stamp-timing to `check` PASSED (0 error, 15/15 WCAG AA).
6. Kontakt lap (`snapshot`) + draft render. Gate: 2 link (VLC file:/// + Chrome Studio).
7. Végső render jóváhagyva.

**KÖNYVTÁRI JAVÍTÁSOK ebben a körben (mind a `FEEDBACK-LOG.md` 2026-09-01):**
- `zg.css`: `.subcap` szabály HOZZÁADVA (16px örökölt → 44px). Ez volt a
  visszatérő "small text" hiba, minden `subcap`-et használó blokkon.
- `blocks/tiles`: per-csempe ikon-változók (`ico1..ico4`), a scene mondja meg.
- `blocks/question`: a wired `.qline`-ból kivéve a `<em>` (a build-video BakeVars
  regex nem tud beágyazott markupot kezelni → a szöveg nem sült be).
- `motion.js` `blurword`: a deblur a jelenet vége ELŐTT éles (at+1.5, nem at+2.8).
- `motion.js` `branchin`: lassabb útvonal-építés + a nyertes ág zöld pulzáló gyűrű.

**hyperframes PIN (2026-09-01):** `_frames/package.json` → `hyperframes@0.8.22`,
`npm install` lefutott, `node_modules/` gitignore-olt. Az `npx hyperframes`
mostantól a lokális pinnelt verziót hívja (ha a cwd `_frames` alatt van).
Ok: a session közben az npx magától 0.8.20→0.8.22-re ugrott.

**ÚJ BASELINE (Zoltán, 2026-09-01): `sampler_2026-09-01.mp4`.** `regress.ps1 -Accept`
lefutott, `baseline/<blokk>_0/1/2.png` (39 archetípus, 3 fázis) + APPROVED.txt
frissítve. Ez a 0.8.22-es render, a mai könyvtári javításokkal. A régi
`sampler_blocks_2026-08-30_2343.mp4` baseline LEVÁLTVA.

**KÖNYVTÁRI JAVÍTÁSOK (2026-09-01, második kör, a `_feedback/2026-09-01`-ből):**
- **`&middot;` / `&rarr;` entitások literálisan jelentek meg** a kickerekben
  ("30 &MIDDOT BRANCH"). Ok: a HyperFrames a mountolt sub-kompnál a meta-fejléc
  `default` értékét használja, és az entitást nyers szövegként rakja ki.
  Mind a 15 érintett blokk `.src.html`-je (body + meta) valódi Unicode-ra
  cserélve: `·` (U+00B7), `→` (U+2192), tipográfiai idézőjelek.
- **branch csomópont-korongok átlátszóan renderelődtek.** A `.brend .skm` CSS
  halott tokenekre hivatkozott (`--accent-600`, `--accent-700`, `--neutral-300`,
  `--neutral-500` — ezeket az OKLCH-paletta törlésekor kivették). Vissza élő
  kánon-tokenekre: nyertes ág `--green-500` korong fehér pipával, másik
  `--navy-100` korong `--navy-700` kihúzással.
- **tiles státusz-korongok: NINCS ilyen a könyvtárban.** A screenshotokon látott
  zöld pipa / kék kérdőjel / piros kereszt a szemvédő szűrő torzítása a sima
  kör-ikonokból.

**AVATAR (9. lépés) — KÉSZ, JÓVÁHAGYVA (Zoltán, 2026-09-01).**
Végső videó: `c2c/c2c_v4_avatar_calm_2026-09-01.mp4` (72,3 mp, −14,4 LUFS).
B mód, Segments: nyitás 0-6 mp, zárás 62,8-71,3 mp, közte tiszta. avatar_iii,
átlátszó webm, natív VP9 alfa (semmi maszk / zöldháttér / colorkey).
Look: `bfcee432248442539191df03f922f575` ("Zoltan Gero", nyugodt, nincs kéz a
képben, direkt szemkontaktus). Az Eye Contact Correction lookok (`c26abf3b`
fekete, `48a6d85f` kék) is mentek, de Zoltán szerint túl erősen gesztikulálnak.
A HeyGen hívásokat Zoltán engedélyezte a claude.ai connector beállításokban.
Kb. 10-12 kredit fogyott a próbálgatással (760-ból).

**A HeyGen close-avatar buktató:** ha a hang-asset még `status: processing`,
a generált avatar NÉMA lesz (nincs szájszinkron). Meg kell várni a `get_asset`
`processing` → kész állapotot, és a hang tényleges hangerejét ellenőrizni
(`volumedetect`), MIELŐTT a `create_video_from_avatar` fut.

**PUBLIKÁLÁS: NEM TÖRTÉNT MEG.** A videó kész, de YouTube-ra nincs feltöltve.
Külön lépés, külön kérésre.

**STUDIO PREVIEW instabil:** a `hyperframes preview` háttérszerver ebben a
környezetben lehal / a canvas endless loadingra megy. VLC (`file:///`) a
megbízható út. Fejlesztési tétel.

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
