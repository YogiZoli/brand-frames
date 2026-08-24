# STATUS — hol tartunk MOST

> **Ez az ÁLLAPOT. A módszer a `PIPELINE.md`-ben van.** A kettő nem versenyzik.
> Egy darab van belőle, és felülíródik — nem szaporodik, mint a handoverek.
> A napló a `git log`, nem ez a fájl.

**Frissítve:** 2026-08-24 22:05 (Cowork, avatar composite MEGOLDVA) · **commit:** lásd `git log -1`
**Elévülés-ellenőrzés:** ha `git log -1` dátuma KÉSŐBBI, mint a fenti, akkor ez a
fájl elavult — **mondd ki, ne menj tovább.** Minden session a végén frissíti.

---

## AVATAR COMPOSITE — MEGOLDVA (2026-08-24 22:05, Cowork)

Ez az ÉRVÉNYES igazság. Az alább lévő korábbi avatar-szekciók ("KÉSŐ ESTI
FRISSÍTÉS", "E2E TESZT EREDMÉNY") HELYTELEN következtetésen alapulnak (azt
állították, a natív webm alfa nem működik), ELAVULTAK.

**Gyökérok megoldva:** a natív HeyGen webm alfa VÉGIG jó volt. A korábbi "100%
opaque" mérés hibás módszerből jött: egykockás PNG-kinyerés (image2/png muxer)
elveszti a VP9 alfa BlockAdditional adatát. FONTOS: a VP9 itt a webm codecje,
NEM az elhagyott exp-v9 motor, a kettőnek semmi köze egymáshoz. Helyes mérés
explicit dekóderrel plusz filtergráffal: `ffmpeg -c:v libvpx-vp9 -i klip.webm
-vf format=yuva420p,alphaextract,signalstats ...` minden kockán YMIN=0 (átlátszó
háttér) és YMAX=255 (subject). Valódi alfa van.

**Következmény:** NINCS szükség colorkey / chromakey / blur / denoise / median /
maszk lépésre. Mind kidobva. A fekete pólóból nincs mit kiharapni, ezért szűnt
meg a folt.

**AZ ÉRVÉNYES RECEPT (bizonyítottan foltmentes):**

    ffmpeg -y -i HATTER.mp4 -c:v libvpx-vp9 -i avatar.webm \
      -filter_complex "[1:v]scale=800:-2[av];[0:v][av]overlay=W-w-40:H-h-40[v]" \
      -map "[v]" -map 1:a? -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac out.mp4

- A `-c:v libvpx-vp9` az avatar-input ELŐTT kötelező, különben elveszik az alfa.
- `scale=800:-2` = arányos kicsinyítés. A HeyGen legkisebb kimenete 720p, ami
  sarokba túl nagy. Ez ENGEDÉLYEZETT: nem torzítás, nem kör, nem háttércsere.
- `overlay=W-w-40:H-h-40` = jobb alsó sarok, 40px margó. Csak elhelyezés, az
  avatart nem módosítja.
- `-map 1:a` = az avatar SAJÁT hangja. Éles pipeline-ban az avatart a valódi
  VO-ból generáljuk, így a szájszinkron automatikus (a demóban a háttér idegen
  hangja miatt tűnt eltérőnek, az nem HeyGen-hiba volt).

**Avatar generálás:** `create_video_from_avatar`, outputFormat webm (natív
átlátszó alfa), engine avatar_iii, resolution 720p.

**MOTOR DÖNTÉS (Zoltán, 2026-08-24): avatar_iii MARAD minden teljes videóhoz.**
Mért költség: III 3,42 mp = 1 kredit, render ~90 mp; V 8,62 mp = 8 kredit,
render 7,5 perc. A V kb. háromszoros kredit/mp és ötszörös render, teljes
videóhoz nem éri meg. (Kredit forrás: Creator előfizetés, most 760 kredit; az
API wallet külön ~5 USD, nem üres.)

**Zoltán SAJÁT avatarja:** csoport "Zoltan Gero"
`d713cb1c2fd9468daf21c129768c746c` (NEM a Bakkon2, az Mátéé). Lookok: Eye
Contact Correction `c26abf3b9a3e424d856cfa14533df6a8` (fekete póló) és
`48a6d85ff4a64c3e993c150dc465a5ee` (kék póló); sima Zoltan Gero
`cba5e2fdb31e4f48bb263e3d3b7a351d`. Zoltán a kék pólós Eye Contact Correction
lookot kedvelte.

**Bizonyító demók:** `assets\_preview_avatar_nativealpha_2026-08-24.mp4` (III,
fekete póló) és `assets\_preview_avatar_sync_V_2026-08-24.mp4` (V, kék póló,
tökéletes szinkron).

---

## MOST ÉPP

**A `zg-frames v1.7` JÓVÁHAGYVA ÉS BASELINE (2026-08-18).** Zoltán megnézte a
`sampler_v1.7.mp4`-et és jóváhagyta a design alapozást. A `baseline/` mappa
mostantól a v1.7 39 kockáját tartalmazza (a `regress.ps1 -Accept` lefutott).
A könyvtár innentől a TELJES design alapozáson áll: OKLCH, színvak-első
szemantika, négy easing, tömeg-arányos időzítés, védjegy-gyűrű, olvasási idő és
hossz-tűrés mint mért ellenőrzés.

**Innentől minden könyvtár-változás után a `regress.ps1` fut, és megmondja,
melyik archetípus mozdult el.** Zoltán soha nem regressziós teszt.

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

---

## DIAGNÓZIS 2026-08-24 (Cowork) — NE ÉPÍTSD ÚJRA

- Az `ai-video-workflow\index.html` markupja HELYES: minden ikon `data-icon` /
  `data-glyph`, és a `motion.js` a build elején és végén hívja `ZGI.paint()`-et.
  Az ikonhiba a mostani fájlban MÁR javítva. Nincs teendő rajta.
- GSAP mostantól LOKÁLIS (`gsap.min.js` a projektben), a fejléc nem CDN-ről tölt.
  Új szabály: GSAP soha CDN-ről, mint az Inter. (Google Fonts már lokál-injektált.)
- NYITOTT HIBA (ez az üres preview valódi oka): `hyperframes check` runtime hibát
  ad — `ZG is not defined` + `Invalid or unexpected token`, és "Timeline did not
  advance under seek". A `type/icons/motion.js` mind `node --check` OK, tehát a baj
  az, hogy a saját scriptek nem kapcsolódnak a stock compiler futtatókörnyezetébe.
  Ez a finomabb változata az exp-v9 hibának: a `motion.js` (ZG.build, saját gsap
  timeline) egy PÁRHUZAMOS motor a stock HyperFrames mellett. A stock út: data-attr
  animáció + katalógus-komponensek, nem kézzel írt ZG.build. Irány: katalógus-first.
- AVATAR SZABÁLY JAVÍTVA (2026-08-24): NEM kör-maszk. A HeyGen átlátszó hátterű
  kimenete 1:1 kerül a videóba, semmi maszk/átméretezés/háttércsere/reposition.
  A méretet és keretezést a GENERÁLÁSKOR állítjuk be (Claude az API-n), utána
  csak ffmpeg overlay fix pozícióra. Automatizált: Claude generál, Zoltán jóváhagy.
  Ez API-költség (wallet, most kb. 4,88 USD elérhető), NEM a Creator 777 kredit.
  A PIPELINE.md már javítva; a MOTION.md / FRAME.md / create-video skill régi
  „kör" szövegét legközelebbi érintéskor ugyanígy javítani kell. (FRAME.md már javítva.)
- AVATAR API PIPELINE MŰKÖDIK (2026-08-24): create_video_from_avatar, outputFormat
  webm (átlátszó), engine avatar_iii, ~90 mp, letöltve. FIGYELEM: a „Bakkon2" avatar
  MÁTÉ-é, nem Zoltané. Zoltan saját avatarját külön kell kiválasztani.
- GSAP visszaállítva CDN-re (utolsó ismert működő állapot, az Aug-19 render ezzel
  ment végig). A lokális gsap.min.js beágyazása törte a timeline-t (csak sc001
  renderelt). Nyitott: vagy CDN marad, vagy HF injektálja a gsap-ot és a tag törölhető
  (tesztelendő snapshottal).
- E2E TESZT ÁTADÁS (új chatben, gazdaságosabb): a One Sitting Workflow kész (script,
  vo_bgm.mp3, index.html). Lépések: 1) `npx hyperframes snapshot`/`render` — ELŐBB
  ellenőrizd, hogy MINDEN jelenet renderel-e (eddig csak sc001 igazolt); ha sc002+
  üres, a tiszta stock opening sub-komp a javítás. 2) avatar composite (átlátszó webm,
  1:1, ffmpeg, SEMMI maszk). 3) publish (publish-yt-url skill, unlisted teszt).


## E2E TESZT EREDMÉNY 2026-08-24 (Cowork, "One Sitting Workflow") — OLVASD EL ÚJ SESSION ELŐTT

**A build és a render MŰKÖDIK, ezt ne kérdőjelezd meg újra:**
- A "csak sc001 renderel" gyanú HAMIS RIASZTÁS volt. A snapshot mintavételi
  időpontjai (1.2s, 9s, 23s...) korábban túl közel estek az egyes jelenetek
  kezdetéhez, mielőtt a GSAP belépő animáció lefutott volna (az elemek
  opacity:0-ról indulnak). Jelenet-kezdet + 2 mp-cel mintavételezve mind a
  nyolc ellenőrzött archetípus (tiles, rail, split, bars, arrow, cpill,
  statement) helyesen renderel. **Nem kell stock opening sub-kompot építeni,
  a jelenlegi index.html jó.**
- Teljes render lefutott hiba nélkül: `aivw_onesitting_e2e_2026-08-24_1803.mp4`,
  109.7 MB, 9m22.5s, 21 perc gépidő (30fps, 16875 kocka, 3 worker).
- `hyperframes check`: 0 error, csak lint/OLVASHATATLAN idő-figyelmeztetések
  (ismertek, nem blokkolók).

**[ELAVULT — MEGOLDVA, LÁSD FENT] AVATAR COMPOSITE alfa/méret kérdés:**
(A natív webm alfa MŰKÖDIK, a recept a felső "AVATAR COMPOSITE — MEGOLDVA"
szekcióban van. Az alábbi bekezdés csak történeti.)
- Három avatar-generálás is (avatar_iii a sima "Zoltan Gero" look-kal,
  avatar_iii az "Eye Contact Correction" look-kal, avatar_v az "Eye Contact
  Correction" look-kal) mindegyike webm-et adott vissza HIBA NÉLKÜL, de a
  helyi ffmpeg-teszt (`ffmpeg -vframes 1 -update 1 -pix_fmt rgba` → PIL
  `getchannel('A').getextrema()`) mindháromnál (255,255)-öt mért: TELJESEN
  ÁTLÁTSZATLAN, egyetlen átlátszó pixel sincs.
- Zoltán a videón (nem a kinyert PNG-n) "OK"-nak látta mindkét újabb próbát —
  ez ellentmond a mérésnek. **Tisztázandó: a Zoltán általi ellenőrzés
  ténylegesen látott-e valódi átlátszóságot (sakktábla-mintás háttérrel egy
  szerkesztőben), vagy csak azt látta, hogy a generálás sikeres volt.** Ha az
  utóbbi, a helyi ffmpeg PNG-kinyerés lehet a hibás (ismert kvirk: webm VP9
  alfa egyedi-kocka kinyerés az image2/png muxeren át néha elveszti az alfa
  BlockAdditional-t, míg a folytonos dekódolás/filtergráf helyesen kezeli) —
  ez esetben MÁS módszerrel kell újratesztelni (pl. a teljes composite-ot
  végigfuttatni és a KIMENETI kockát nézni, vagy `-c:v libvpx-vp9` explicit
  dekóder-kényszerítéssel), NEM újra generálni.
- A composite, amit ezekkel a fájlokkal csináltam, FEKETE HÁTTERŰ dobozt
  adott (VLC-ben látszott) — ez konzisztens az opaque méréssel.
- Fájlok a további vizsgálathoz: `ai-video-workflow\assets\avatar_e2e_opening_2026-08-24_1803.webm`,
  `avatar_e2e_eyecontact_2026-08-24_1844.webm`, `avatar_e2e_v_2026-08-24_1856.webm`.
- HeyGen API wallet: ebből a session-ből 3 generálást használtunk el, ne
  generálj vakon negyediket a wallet-korlát tisztázása nélkül.

**MÉRET-KÉRDÉS, CANON-ÜTKÖZÉS — Zoltán döntése kell:**
- Mindhárom avatar-generálás natívan 1280x720-at adott (a `resolution`
  paraméter legkisebb opciója is 720p — nem tudtam natívan kisebbet kérni
  ennél az avatar-csoportnál). Zoltán ezt "nagyon nagynak" találta a videóban.
- A korábbi (2026-08-18/19-i) kis méretű, jobb alsó sarokban lévő avatar NEM
  natívan kicsi volt — a régi `_composite_avatar4.bat` ffmpeg `scale=220:220`
  paranccsal MÉRETEZTE ÁT. Ez pontosan az a lépés, amit a 2026-08-24-es
  canon-javítás (lásd lejjebb, "AVATAR SZABÁLY JAVÍTVA") kifejezetten
  megtiltott.
- **Ellentmondás: a canon szerint a méretet generáláskor kell beállítani, de
  a HeyGen API-n (legalábbis ennél az avatar-csoportnál) nem lehet 720p alá
  menni.** Zoltánnak el kell döntenie: (a) felülírjuk a canon-t és
  engedélyezünk egy kontrollált, arányos (nem torzító) utólagos kicsinyítést,
  vagy (b) natív méretben hagyjuk és a kompozíció eleve nagyobb sávot foglal
  az avatarnak, vagy (c) más avatar-csoportot/look-ot vagy HeyGen
  beállítást keresünk, ami natívan kisebbet ad.
- **Amíg ez nincs eldöntve, NE módosítsd a PIPELINE.md avatar-szabályát
  egyoldalúan.**

**MI TÖRTÉNT PUBLIKÁLÁSSAL: SEMMI.** Zoltán kifejezetten kérte, hogy álljak
meg, ne publikáljak, amíg a fenti két kérdés nincs tisztázva. Nem futott
YouTube feltöltés, nem futott publish-yt-url skill ebben a session-ben.

**KÖVETKEZŐ ÚJ E2E TESZT (Zoltán bejelentette): teljesen 0-ról, a
video-script lépéstől indul, nem a One Sitting Workflow újrafelhasználásával.**
A fenti avatar-alfa és méret kérdés ATTÓL FÜGGETLENÜL releváns marad, mert
ugyanaz a HeyGen avatar-csoport/pipeline-lépés érinti az új tesztet is —
ne generálj avatart az új teszthez sem, amíg ez nincs tisztázva.


## [ELAVULT — LÁSD FENT: AVATAR COMPOSITE — MEGOLDVA] 2026-08-24 KÉSŐ ESTI FRISSÍTÉS

> Ez a szekció HELYTELEN: azt állítja, a natív webm alfa nem működik. DE MŰKÖDIK.
> A hibás mérés oka az egykockás PNG-kinyerés volt. Csak történeti okból marad meg.

**HELYESBÍTÉS a fenti "AVATAR SZABÁLY JAVÍTVA (2026-08-24)" bejegyzéshez: AZ
HAMIS ELŐFELTEVÉSEN ALAPUL. A natív HeyGen webm alfa NEM működik, soha nem is
működött. Ne higgy neki, amíg ezt valaki ki nem javítja a szövegben.**

### Gyökérok (bizonyítva, lezárva)
A régi (2026-08-18/19 előtti) "mindig zökkenőmentesen ment" avatar composite
SOHA nem natív webm alfát használt. A régi `.bat` scriptek (`_composite_avatar.bat`,
`_composite_avatar2.bat`, `_composite_avatar3.bat`, `_composite_avatar4.bat`,
mind itt: `ai-video-workflow\`) bizonyítják a fejlődést:
1. `_composite_avatar.bat`: kör alakú alfa maszkot GYÁRTOTT `geq`-vel, mert a
   forrás eleve opaque volt.
2. `_composite_avatar2.bat`: `colorkey=black:0.15:0.08` hozzáadva — direkt
   bizonyíték, hogy a webm háttere fekete és opaque volt, kézzel kellett kulcsolni.
3. `_composite_avatar3.bat` (ez lett a "mindig működött" verzió): teljesen
   FELADTA a webm/alfa utat, és egy KÜLÖN, literál zöldhátterű mp4-et
   (`avatar_opening_green.mp4`) használt `chromakey=0x00FF00`-val.
4. `_composite_avatar4.bat`: `scale=220:220`-szal kézzel kicsinyítette az
   avatart — innen a "korábban kicsi volt" emlék, ez mindig kézi resize volt.

Tehát a "natívan átlátszó, natívan kicsi" emlék tévedés: mindig volt kézi
lépés (colorkey vagy chromakey + kézi scale). **Zoltán elve marad: zöldháttér
SOHA. Ezért colorkey-t használunk fekete háttéren, nem chromakey-t zöldön.**

### Mai mérési eredmény (megismételve, megerősítve)
3 friss HeyGen generálás (avatar_iii sima look, avatar_iii "Eye Contact
Correction" look, avatar_v "Eye Contact Correction" look) — mind webm,
`alpha_mode: 1` a streamben, DE `ffmpeg -pix_fmt rgba` kockakinyerés + PIL
`getchannel('A').getextrema()` mind a háromnál (255,255)-öt mért: 100%
opaque. Háttérszín pixelenként megmérve: pontosan `(0,0,0,255)` — tiszta
fekete, nem sötétszürke.

### Composite iterációk 2026-08-24 este (mind 8 mp-es preview, NEM a teljes
9m22s render — Zoltán kifejezett kérése: ne pazaroljunk gépidőt iterálás közben)
Forrás mindvégig: `assets\avatar_e2e_eyecontact_2026-08-24_1844.webm` overlay
`aivw_onesitting_e2e_2026-08-24_1803.mp4`-re, `overlay=W-w-40:H-h-40`
(jobb alsó sarok, fix pixel pozíció, NEM stretch — arányos `scale`).

- **v1** `colorkey=black:0.20:0.08` + `scale=800:450`, feathering nélkül.
  Zoltán: pozíció/méret/átlátszóság jó, de az élek "szaggatott vagy zavaros".
- **v2** feathering hozzáadva (`alphaextract`+`gblur sigma=1.2`), de a
  colorkey similarity túl laza (0.25) maradt → az arc árnyékos részei is
  részben kikulcsolódtak, a blur ezt foltokká kente. Zoltán: "ugyanez, csak
  még zavarosabb".
- **v3** colorkey szigorítva a mért valós háttérszínhez (`0x000000:0.06:0.02`),
  feathering `boxblur=1:1`-re csökkentve. Zoltán: arc tiszta lett, de a
  váll/ing/gallér terület még mindig foltos.
- **v4** `hqdn3d` zajszűrés a colorkey ELŐTT (feltevés: VP9 kompressziós zaj a
  sötét ing-árnyékban okozza a foltokat) + `median=3` az alfa csatornán
  `boxblur` helyett. Zoltán: **ROSSZABB lett, még foltosabb.** Ez a
  feltevés (kompressziós zaj) tehát VALÓSZÍNŰLEG HIBÁS, vagy a median/hqdn3d
  kombó maga vezet be új artefaktot. Ne folytasd ebbe az irányba first.
- **v5** (legutolsó, ez alatt a bejegyzés alatt még nincs Zoltán-visszajelzés):
  vissza az alapokhoz, MINDEN feathering/denoise KIKAPCSOLVA —
  `colorkey=0x000000:0.05:0.0` (blend=0, kemény küszöb), semmi blur/median/hqdn3d.
  Cél: kiderül, hogy a blend/feathering lépés maga okozza-e a foltokat, vagy a
  probléma máshol van (pl. a VP9 dekódolás maga ad vissza inkonzisztens
  pixelértékeket kockáról kockára a ruha közelében, amit semmilyen utólagos
  ffmpeg-szűrés nem fog stabilan megoldani).

### Zoltán visszajelzése v5-re (2026-08-24 21:22): "egy kicsi még van" —
vagyis v5 (kemény colorkey, blend=0, SEMMI feathering/denoise) EDDIG A
LEGJOBB EREDMÉNY, jelentősen kevesebb folt mint v3/v4. A feathering/blur/
denoise hozzáadása (v2, v4) MINDIG rontott, nem javított. **Következő
session iránya: v5 filterjéből induljon ki (`colorkey=0x000000:0.05:0.0` +
`scale=800:450`, format=yuva420p, semmi blur/median/hqdn3d), és a maradék
apró foltot próbálja a similarity finomhangolásával (pl. 0.04 vagy 0.055)
csökkenteni, NE feathering hozzáadásával.**

### ÁLLAPOT: NINCS LEZÁRVA. Ne tekintsd egyik verziót sem véglegesnek.
Zoltán ma este egy újabb kört fut (v5 visszajelzés), utána ÚJ Cowork
session-t indít egy teljesen 0-ról induló E2E teszthez. **Ha te vagy az az
új session:**
- NE generálj új HeyGen avatart — van 3 letöltött webm, ami mérhetően
  opaque, ezekkel lehet tovább tesztelni.
- NE higgy a natív webm-alfának, még ha a HeyGen API `alpha_mode: 1`-et is
  ír a streambe.
- NE használj zöldhátteret / chromakey-t (Zoltán explicit tiltása), csak
  fekete háttéren colorkey-t.
- NE használj kör alakú maszkot (`geq` circle), Zoltán explicit tiltása.
- Arányos kicsinyítés (`scale=800:450` vagy hasonló) ELFOGADOTT, nem "tiltott
  resize" — a canon "ne resize-olj" szabálya a képarány-torzításra
  vonatkozott (stretch), nem az arányos kicsinyítésre.
- Ha megtalálod a foltmentes kombinációt: FUTTASD LE a teljes
  `aivw_onesitting_e2e_2026-08-24_1803.mp4`-re (9m22s), majd írd ide, ebbe a
  szekcióba a PONTOS ffmpeg filter_complex string-et, és javítsd a fenti
  "AVATAR SZABÁLY JAVÍTVA (2026-08-24)" bejegyzést a helyes verzióra.

**Publikálás: továbbra sem történt semmi. Zoltán "állj meg, ne publikálj
még" utasítása érvényben marad.**
