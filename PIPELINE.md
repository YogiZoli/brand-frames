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

## VIDEÓTÍPUSOK — NÉGY BÁZIS + EGY FLAG (2026-08-17)

A videó elején egyetlen kérdés: **mi az alapanyag?** Nem négy párhuzamos
csővezeték — négy bázis, közös kapukkal.

| Bázis | Az alapanyag | Ki állítja össze | Avatar |
|---|---|---|---|
| `explainer` | nincs felvétel, HF grafika | HyperFrames, lokálisan | opcionális sarok-kör |
| `talking_head` | telefonos felvétel Zoltánról | HF overlay a felvétel FÖLÉ | nem értelmes |
| `screenrecording` | képernyőfelvétel (walkthrough is) | a felvétel a HF-en BELÜL | opcionális sarok-kör |
| `avatar_only` | **a HeyGen avatar maga** | HeyGen online vagy API | maga a videó |

A régi `hybrid` = `explainer` + avatar flag. Az avatar flag, de **csak ott**:
`avatar_only`-nál az avatar a bázis, nem jelölő. Ez a korábbi modell hibája volt.
A `walkthrough` nem külön típus: `screenrecording` oktató szándékkal.

### A két kombinációs irány — mindkettő stock HyperFrames

**HF a felvétel FÖLÉ (`talking_head`):** a HF alfa-csatornával renderel
(`--format mov` / `webm`, vagy `png-sequence` RGBA), ffmpeg ráteszi az
érintetlen felvételre. Lower-third, kinetikus cím, callout, pull-quote,
kiemelő gyűrű. **A felvétel nem kódolódik újra.**

**A felvétel a HF-en BELÜL (`screenrecording`):** a klip a kompozícióba
mountolva, így a HF zoomol, pásztáz, eszközkeretbe tesz, és a kurzort követi
lupéval. Itt a kontroll fontosabb, mint az érintetlenség.

Döntés 2026-08-17: **mindkettőt tudjuk, esettől függően** — `talking_head`
felette, `screenrecording` belül.

### `talking_head` — KEVESEBB lépés, nem több

| `explainer` | `talking_head` |
|---|---|
| script → VO gyártás ElevenLabsszel → átirat | felveszed → átirat a felvételről |
| 100+ jelenet grafikája | ~15 overlay időpont |
| avatar composite a végén | nincs — Zoltán a képen van |

Nincs VO-gyártás (a saját hang már ott van), és nincs teljes jelenet-grafika:
grafika csak oda kerül, ahol számít. A jelenet-tábla ekkor overlay-táblává
egyszerűsödik. Az öt kapu ugyanaz.

### `avatar_only` — ide NE építsünk HF gépezetet

Ahol az avatar a videó és a grafika mellékes, a HeyGen online (vagy API) a
helyes út. Nincs jelenet-tábla, nincs build. **Figyelem:** a HeyGen API-pénztárca
külön van a 600 in-app kredittől, és üresen 402-vel elhasal.

### Miért nem HeyGen online mindenre

A HeyGen online **nem ratchetel**: minden videó nulláról indul, a design
driftel, nincs verziózás, nincs regressziós teszt, és az operátor a kézi
összeállító. Amíg a `zg-frames` nem áll, a HeyGen online gyorsabb — utána a
lokális út gyorsabb ÉS ingyen van.

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
| 9 | **Avatar composite** (natív alfa, arányos kicsinyítés + fix sarok, SEMMI maszk/torzítás) | ffmpeg | ✅ **5. kapu** |

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

## ÍRÁSSZABÁLY — a scriptre és minden kimenetre

**Emoji nincs. Gondolatjel nincs.** Sem a scriptben, sem a leírásban, sem a
chatválaszban. Helyette vessző, kettőspont, zárójel, vagy külön mondat.
A kötőjel szóösszetételben és technikai névben marad (`zg-frames`, `AI-t`).
Teljes szabály: `C:\Users\gdp\CLAUDE.md`.

**Minden válasz végén teljes elérési út**, beilleszthető megnyitó paranccsal
és Drive URL-lel, ha van. Zoltán soha nem gépel útvonalat.

FIGYELEM: ezekben a doksikban a 2026-08-18 előtt írt bekezdések tele vannak
gondolatjellel. Azok a szabály előttről valók. **Ne utánozd őket.** Amit
mostantól bárki ír, az a fenti szabály szerint készül, és ha egy régi
bekezdést amúgy is szerkeszteni kell, akkor abból is kikerül a gondolatjel.

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
- Avatar: átlátszó hátterű WebM, amit a HeyGen ad. A natív VP9 alfa MŰKÖDIK,
  colorkey NEM kell (az a fekete pólót kiharapná). Beolvasás `-c:v libvpx-vp9`-cel,
  különben elveszik az alfa. TILOS: kör-maszk, háttércsere, képarány-torzítás
  (stretch/oval), fátyol/fade, újrakódolás. ENGEDÉLYEZETT és SZÜKSÉGES: arányos
  kicsinyítés (`scale=800:-2`), mert a HeyGen legkisebb kimenete 720p, és fix
  sarok-pozíció (`overlay=W-w-40:H-h-40`) — ez elhelyezés, nem torzítás. A
  composite az avatar SAJÁT hangját teszi alá; éles pipeline-ban az avatart a
  valódi VO-ból generáljuk, így a szájszinkron automatikus. (Javítva
  2026-08-24: a régi „kör-maszk" ÉS a „semmi átméretezés / méret generáláskor"
  is hibás volt.) Teljes recept és a két üzemmód: lásd lent.

## AVATAR COMPOSITE — a végleges recept (kánon, 2026-08-24)

Ez a bizonyítottan foltmentes recept. Korábban csak a STATUS.md-ben élt, ami
felülíródik, ezért ide, a kánonba került. A gyökérok: a natív HeyGen webm VP9
alfa VÉGIG jó volt; a korábbi „100% opaque" mérés hibás volt (egykockás
PNG-kinyerés elveszti a VP9 alfa BlockAdditional adatát).

**Avatar generálás:** `create_video_from_avatar`, outputFormat `webm` (natív
átlátszó alfa), engine `avatar_iii`, resolution 720p. A III marad minden teljes
videóhoz (III kb. 3,4 mp / 1 kredit; V kb. 1 mp / 1 kredit és ötszörös render).

**A két üzemmód** (a wrapper `pipeline\avatar_composite.ps1` mindkettőt tudja):

- **Segments (ALAP):** az avatar CSAK a megszólalás-szigetekre kerül (nyitás,
  záró CTA, 1-2 kulcspillanat), időbélyegenként egy rövid webm, `between`-nel a
  saját idejére kapcsolva. Ez a olcsóbb út, mert csak a valóban generált
  másodpercek fogyasztanak kreditet.
- **Full:** az avatar végig a sarokban, egyetlen overlay, `between` nélkül.
  Drágább, csak külön kérésre.

**Full mód (egyetlen klip végig):**

```
ffmpeg -y -i HATTER.mp4 -c:v libvpx-vp9 -i avatar.webm \
  -filter_complex "[1:v]scale=800:-2[av];[0:v][av]overlay=W-w-40:H-h-40[v]" \
  -map "[v]" -map 1:a? -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac out.mp4
```

**Segments mód (több klip, mindegyik a saját idejére):**

```
ffmpeg -y -i HATTER.mp4 \
  -c:v libvpx-vp9 -i avatar1.webm -c:v libvpx-vp9 -i avatar2.webm \
  -filter_complex "\
    [1:v]scale=800:-2,setpts=PTS+0/TB[a1]; \
    [2:v]scale=800:-2,setpts=PTS+270/TB[a2]; \
    [0:v][a1]overlay=W-w-40:H-h-40:enable='between(t,0,7.3)'[t1]; \
    [t1][a2]overlay=W-w-40:H-h-40:enable='between(t,270,278.4)'[v]" \
  -map "[v]" -map 0:a -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac out.mp4
```

Kulcsszabályok mindkét módban:
- `-c:v libvpx-vp9` KÖTELEZŐ minden avatar-input ELŐTT, különben elveszik az alfa.
- `scale=800:-2` = arányos kicsinyítés (a HeyGen legkisebb kimenete 720p).
- `overlay=W-w-40:H-h-40` = jobb alsó sarok, 40px margó, csak elhelyezés.
- Segments: `setpts=PTS+<start>/TB` tolja a klipet, `enable='between(t,s,e)'` mutatja.
- TILOS: colorkey / chromakey / blur / denoise / median / maszk / kör / stretch.

**Alfa-önellenőrzés (a composite ELŐTT):**

```
ffmpeg -c:v libvpx-vp9 -i avatar.webm \
  -vf format=yuva420p,alphaextract,signalstats,metadata=print -f null - 2>&1 | findstr YMIN
```

A `metadata=print` KELL, e nélkül a signalstats nem írja ki a `YMIN=`/`YMAX=`
sorokat. Valódi alfa esetén a legkisebb YMIN=0 (van átlátszó háttér) és a
legnagyobb YMAX=255 (van subject). Ha YMIN mindenütt 255 vagy YMAX mindenütt 0,
a webm hibás, NE composite-olj vele. (A wrapper ezt automatikusan ellenőrzi.)

**Hang:** a háttér-render általában néma, a VO+BGM külön sáv. A wrapper `-Audio
vo_bgm.mp3` paramétere teszi alá; enélkül a háttér hangját veszi (`0:a?`), vagy
néma marad. Éles pipeline-ban add meg a `-Audio`-t a VO+BGM mp3-mal.
