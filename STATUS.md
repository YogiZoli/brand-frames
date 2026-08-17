# STATUS — hol tartunk MOST

> **Ez az ÁLLAPOT. A módszer a `PIPELINE.md`-ben van.** A kettő nem versenyzik.
> Egy darab van belőle, és felülíródik — nem szaporodik, mint a handoverek.
> A napló a `git log`, nem ez a fájl.

**Frissítve:** 2026-08-18 00:15 · **commit:** lásd `git log -1`
**Elévülés-ellenőrzés:** ha `git log -1` dátuma KÉSŐBBI, mint a fenti, akkor ez a
fájl elavult — **mondd ki, ne menj tovább.** Minden session a végén frissíti.

---

## MOST ÉPP

**A `zg-frames` archetípus-könyvtár v1.3 rendere fut** (kb. 6 perc gépidő).
Ez az első verzió, ami a teljes design-alapozáson áll — a sorköz és a betűköz
javításának hatását csak ezen a renderen lehet megítélni.

Ha a render kész: `zg-frames/sampler_v1.3.mp4` (28 jelenet, 136,5 mp) +
`_sheet13.jpg` (kontakt lap) + `_hl13.jpg` (highlighter közelről) +
`_cvd13.jpg` (deuteranópia-szimuláció a Split jelenetre).

---

## AMI KÉSZ

### A rendszer (git: github.com/YogiZoli/brand-frames)
- **`PIPELINE.md`** — a kánon: 9 lépés, 5 jóváhagyási kapu, a határ
  („mi szöveget írunk, a HyperFrames gyárt kockát"), négy bázis-réteg
  (explainer / talking_head / screenrecording / avatar_only), költség-politika,
  mért tények.
- **`SCALE.md`** — arany standard: betűméret 1,25-ös skála 32-ről
  (32·40·50·62·78·98·122), térköz 8-pontos rács (8·16·24·40·64·104·168),
  mozgás-időtartamok, max 3 méret jelenetenként.
- **`DESIGN-FOUNDATION.md`** — a teljes alapozás: sorköz- és betűköz-táblák,
  5-fokozatú színrampák, mérték, radius/elevation/vonalvastagság skálák,
  4 engedélyezett easing, koreográfia, sűrűség, teljesítmény, anti-patternek.
- **`FEEDBACK-LOG.md`** — Zoltán általános szabályai dátumozva (3 adag).
- **`BOOTSTRAP.md`** + Drive „Laptopcsere" doksi — új gép beüzemelése.
- **`_feedback/`** — a feedback egyetlen helye. 2026-08-17-ben 66 screenshot.

### A könyvtár (`zg-frames/`)
- `zg.css` — minden archetípus stílusa, csatorna-független tokenekkel
- `motion.js` — a mozgás-könyvtár (a videók ezt töltik be, sosem írnak sajátot)
- `index.html` — a motion sampler, 28 jelenet, 136,5 mp
- `baseline/` — 24 referenciakocka a v1.0-ból (a regressziós teszthez)
- Állapot: **`lint` és `check` 0 hiba.**

### Belépési pontok — mindenhol pointer, sehol másolat
`C:\Users\gdp\CLAUDE.md` (gép-szintű, ezt olvassa minden session) ·
`HyperFrames\CLAUDE.md` · `ai-video-workflow\CLAUDE.md` + `AGENTS.md` ·
`_frames` összes .md-je · két skill (`video-production-orchestrator`,
`create-video`) · két projekt-utasítás (Zoltan Gero, VoxFlow) ·
Drive: a régi kánon-doksi pointerré alakítva, három handover „SUPERSEDED" bannerrel.

---

## A KÖVETKEZŐ LÉPÉS

1. **v1.3 sampler megnézése** — Zoltán jóváhagyja a mozgást a `zg-frames v1.3`
   verzióra. Ez egyszeri: utána videónként már csak tartalmi jóváhagyás van.
   Valószínűleg kell még egy **v1.4** kör a maradék feedbackből.
2. **A maradék archetípusok** — jelenleg 28 van meg a tervezett ~38-ból.
   A hiányzók: elágazás, tölcsér, ciklus, mérőóra, quote, question, before/after,
   grid, kód/parancs, lead-kártya. **Ez már sablonmunka a jóváhagyott mintákból.**
3. **Regressziós diff szkript** — sampler render → ffmpeg kockák →
   pixel-összehasonlítás a `baseline/`-nal → lista, MELYIK archetípus változott.
   Plusz a deuteranópia-szimuláció. **Zoltán soha nem regressziós teszt.**
4. **A „One Sitting Workflow" videó újraépítése** a könyvtárból, jelenet-táblával.
   Ez zárja a kört és bizonyítja, hogy a rendszer működik.
5. Végső render + avatar composite + publikálás.

---

## FÉLBEHAGYVA / NYITOTT

- **A `HF-v4-feedback` képekből 5 nincs beolvasva** (02, 03, 05, 06, 08).
  A megnyitott háromból a fő üzenet átvezetve (sorköz, badge piros, highlighter
  sárga filctoll).
- **Négy javaslat elfogadva, de még NINCS kódban** (Zoltán 2026-08-18-i kérésére
  születtek, ő mindet kérte):
  - `tabular-nums` a számlálókra — most ugrálnak a számjegyek felfutás közben
  - optikai közép: a tartalom a matematikai közép fölött 4-5%-kal
  - olvasási idő minimuma: 0,5 mp + szavanként 0,4 mp
  - lokalizációs tűrés: minden szövegdoboz bírjon +30% hosszt (25 nyelv miatt)
- **Két kreatív javaslat, döntésre vár:** a „bezáruló gyűrű" mint védjegy-mozdulat
  minden szakaszzáró jeleneten; és egy 5-6 mintás halk hangkészlet a mozgáshoz.
- Az `ai-video-workflow/index.html` a RÉGI, monolit felépítésű videó (141 jelenet,
  562,5 mp hanggal). Nem hibás, de **nem a könyvtárból épül** — a 4. lépésben
  cseréljük.

---

## AMIT SOHA

Saját render-/videó-/hangmotor (`exp-v9` — a rendszer legdrágább tévedése) ·
narancs · sötét háttér · `filter:blur` · Google Fonts `<link>` ·
kitalált szám · jelentés csak színen · feedback a chatben, könyvtár helyett.
