# FEEDBACK-LOG — általános szabályok, nem videó-specifikusak

Minden bejegyzés MINDEN videóra érvényes, minden csatornán, visszavonásig.
A forrás screenshotok: `_feedback/<dátum>/`

---

## 2026-08-17 — 5 adag feedback az „One Sitting Workflow" 30 mp-es tesztre

### A NULLADIK SZABÁLY — minden más felette áll

> **A kép azt mutatja, amiről a hang beszél.** Megerősíti, láthatóvá teszi,
> kihangsúlyozza. Soha nem tér el tőle, soha nem dekoráció, soha nem
> distraction. Ha egy effekt csak azért kerül be, mert tudjuk vagy kíváncsiak
> vagyunk rá — kimarad.

Következmények, amiket Zoltán kimondott:
- Nincs olyan jelenet, amihez nincs narráció (a „Get Started" form ezért maradt ki).
- Diagram csak oda, ahol a szöveg tényleg görbéről / kitartásról szól.
- Glow csak arra a szóra, amit a hang épp kiemel — vagy a CTA-ra.
- A CTA szövege = amit a hang abban a pillanatban mond. Nem több, nem kevesebb.

### Tilalmak (bővítés)

- **Sarok-keretek (`.brk`, a négy sarokban a szögletjel): TILOS.** Sehol.
- Narancs: továbbra is tilos. Ami a referenciákon narancs, az nálunk zöld.
- Sötét háttér: továbbra is tilos, 0%.
- Betűk körüli körvonal-buborék (a V9 `.ring` az „E" körül): nem kell.
- Kitalált szám vagy százalék: tilos. 12,4k → 47,4k az +282%, nem +312%.
  A sávokba a mért, valós adataink kerülnek.

### Alakzat

- **Ikonok, jelölők, tile-ikonok: KÖR.** Nem lekerekített téglalap.
- A `✗` / `✓` jelölők is körök.

### Mozgás-szabályok (átvezetve MOTION.md-be)

**Pulzálás: ±2%, „finom".** Nem ±4%, nem ±7%. Érinti: ikonok, gombok,
körvonalak, glow-szavak, kiemelt listasor. Mindig a jelenet VÉGÉN, amikor az
elem elkészült — nem a megjelenéskor.

**Ikon-építés, 3 fázis** (minden A → B jelenet alapmintája):
1. első ikon halkan beúszik + nő
2. a vonal balról jobbra felhúzódik, közben a második ikon fade-el be
3. mind a kettő teljes, és a végén finoman pulzál

**Progress rail, lépésenként:**
- step 1 balról indul, halvány alapsáv
- a vonal szakaszonként telik meg, balról jobbra
- a pontok sorban ülnek ki, ahogy a vonal odaér
- az utolsó állomás ZÖLD, és amikor a sáv teljes, pulzál
- a vonalon egy erősebb, „bold" szakasz vándorol

**Utazó pont:** kis pont fut végig a vonalon, balról jobbra.

**Szó-fázisok kiemelt szón:**
- fázis 0: a szavak egyenként fade-elnek be (természetes olvasás ritmusa)
- fázis 1: a kiemelt szó blurrys, és blurryben pulzál
- fázis 2: **élesre tisztul — NEM blurryben végzi** — és az aláhúzás fade-el be

**Lupe (nagyító kör), 3 fázis:** megjelenik a kártya egyik mezőjén → átmozog
egy másikra → közben extra szavak popupolnak, és a kiemelt szó zölden ül ki.
Azt emeli ki, amit a hang épp mond.

**Lista / panel:** a sorok soronként fade-elnek be. A kiemelt sor ZÖLD
(nem narancs), körvonallal, és a végén pulzál.

**Váltás-minta (kéz → YES):** az elemek egyenként váltanak állapotot, kis
pulzálás mindkét állapotban, a végén a kiemelt elem teljes és lassan nagyobbodik.

**Diagram:** vonaldiagram világos alapon, kék vonal, zöld végpont, finom
„shaking" mozgással. A shaking jó — a sötét alap és a narancs nem.

**Két sebesség — jelenethossz szerint:**
- **≥4 mp**: kap 3 fázisú mintát (ikon-építés, lupe, rail)
- **<4 mp**: csak fade + rise + kamera-drift. A hangot soha nem nyújtjuk
  azért, hogy egy animáció beleférjen.

**Rajzolt nyíl:** marad. „Feels like hand written" — ez működik.

### Ami kifejezetten tetszett (ne rontsuk el)

- Rajzolódó nyíl, kézzel írt érzet
- Szövegméretek (title 128 / sm 88 / sub 48) — jók, nem kellenek nagyobbak
- Sáv-jelenetek layoutja és a növekvő mozgás
- Kontakt-lap / kártya-kompozíció az avatarral
- A záró kártya egyszerűsége — egy világos CTA-val

### Avatar

Jobb alsó sarok. **A HeyGen által adott méretet NEM változtatjuk** — a
kompozíció hagy neki helyet (a `.cam` alsó padding), a composite csak
kör-maszkot tesz rá és beilleszti.

---

## 2026-08-17 (2) — sampler v1.0 feedback
Forrás: `_feedback/2026-08-17/HR-update-feedback-01..08.png`
Nyolc kép, hét általános szabály. Sorrend: a legfontosabb elöl.

### 1. TÉRHASZNÁLAT — a legnagyobb hiba (feedback-04)

> „All are very narrow! Lots of big white spaces! Can you use the white spaces?
> **Be more loose!** Use the usual white spaces — I don't know what normal or
> standard, but use that."

A kompozíció eddig egy szűk sávban ült a kép közepén, körülötte üres. **Ez nem
egy archetípus hibája, hanem az elrendezési logikáé.** Szabály:

- A tartalom **használja ki a biztonságos területet** (1920 − 2×140 = 1640 px),
  ne csak a közepét. A szűk, magas blokk tilos.
- Az elemek közti térköz **nagyobb**, de a csoport **szélesebb** — a levegő az
  elemek KÖZÖTT legyen, ne a kompozíció KÖRÜL.
- Ami eddig 1300–1420 px széles volt (panel, funnel), az **1640 px**.
- Kivétel a jobb alsó sarok: ott az avatarnak marad hely.

### 2. FEJLÉC ÉS TÖRZS ARÁNYA (feedback-07)

> „Make it slightly bigger like the text now… usually you can make the headlines
> bigger, as big as now the text, rather than make the text smaller."

- A **kicker/headline NAGYOBB**: 42 px → **54 px**.
- A törzs/kiemelt szöveg **relatíve kisebb**, ne fordítva. Ha szűkös, a fejlécet
  növeld, ne a szöveget zsugorítsd.
- A `pillout` („APPROVAL POINT 04") szövege a **headline méretéhez** igazodik,
  nem 56 px-hez. Max a fejléc mérete.

### 3. SÁVOK (feedback-01)

- **A sávok legyenek KÖZELEBB** egymáshoz. 300 px térköz sok → ~140 px.
- A számok **ne legyenek egymáshoz és a fejléchez közel** — kapjanak levegőt.
- **A badge színe MINDIG más, mint a sáv, amin ül.** Zöld sávon nem zöld badge.
- A badge **pulzál**.
- A sáv **nyílása animált** — a növekedés legyen látható.

### 4. LUPE / ZOOM (feedback-02)

> „Now the ZOOM was empty! It should be: ZOOM effect is ALWAYS on a word or text,
> the letters are magnified like zooming."

- **A lupe SOHA nem lehet üres.** Mindig szón vagy szövegen áll, és **a betűk
  nagyítva látszanak benne** — ez a lényege.
- A lupe alatti tartalom nagyítva jelenik meg, nem csak körvonal kerül rá.
- A popup kártyák **nem fedhetik** a fejlécet vagy egymást.

### 5. VONALDIAGRAM (feedback-05)

- **A pontok animálódnak**: ahogy a vonal odaér, minden adatpont kiül.
- A tengelyfeliratok **nagyobbak** (24 px → 32 px).

### 6. KÖR-ANIMÁCIÓ — két külön dolog, eddig összekevertem (feedback-06)

> „You misunderstand the animation: it starts from 0, no animation. Then the
> circle fills up to 100% full. When the circle is complete, no more animation."

- **Progress ring:** 0-ból indul, **feltelik 100%-ra**, és amikor kész,
  **megáll — nincs további animáció.** Ez NEM végtelen forgás. A mostani `orbit`
  hibás volt.
- **Pulzáló gyűrű:** ez a MÁSIK animáció. A körvonal **ugyanolyan méretű, mint
  maga a kör alakú elem**, és pulzál. Nem nagyobb, nem forog.

### 7. KONTAKT LAP (feedback-03)

> „This contact sheet is entirely wrong."

- A „8 db üres kártya időbélyeggel" archetípus **törölve**.
- Helyette kettő: **(a) FORM, ami épp kitöltődik** — betűnként írja be magát,
  „letters in progress"; **(b) CONTACT RECORD** — valódi kontakt-kártya, a
  GoHighLevel kontakt nézetének logikájával (nevesített mezők, valódi értékek).
  Képernyőn CRM-nevet SOHA nem írunk ki.

### 8. VÉGKÁRTYA (feedback-08)

- Az animáció jó, marad.
- A „See you there" **kisebb** legyen.
- Az app-ikon helyén **értelmes, a szöveghez tartozó ikon** legyen — vagy később
  a logó, ha lesz. Üres kék négyzet nem elfogadható.
- A CTA gomb **pulzál a végén**.

### Amit kifejezetten jónak talált — ne rontsuk el
- A 3 fázisú nyíl (05): *„letter and icon sizes are perfect, animation is perfect"*
- A pill és a `pillout` animációja (17)
- A végkártya felépítése és animációja (18)
- Összességében: *„amazing overall, all scenes are very good"*

---

## 2026-08-17 (3) — sampler v1.1 feedback
Forrás: `_feedback/2026-08-17/HR-v3-01..10.png`

### A GYÖKÉRHIBA — megoldva a `SCALE.md`-vel

Zoltán: *„Egy valami van ami globális és nem tetszik: a térközök, és ezzel együtt
a text méretek. Van valami standard ami nálunk követendő mint aranystandard?"*

Igen, és eddig nem volt. A méretek ad hoc számok voltak (26, 34, 42, 44, 54, 62,
74, 88, 120, 128, 132) — semmi nem indokolta őket egymáshoz képest. Ezért tűnt
egyszerre szűknek és aránytalannak.

**Döntés: `_frames/SCALE.md`** — betűméret 1,25-es moduláris skála 32-ről
(32·40·50·62·78·98·122), térköz 8-pontos rács (8·16·24·40·64·104·168),
mozgás-időtartamok skálán, max 3 betűméret jelenetenként. **Ezeken kívül más
érték nem használható.**

### Jelenet-szintű szabályok

**Sávok (v3-01):** a szám és a badge ütközött a fejléccel — negatív absztolút
pozicionálás (`top:-66px`) tilos, a badge flex-sorrendben a sáv fölé kerül saját
térközzel. **A badge lehet színes — piros vagy amber jó —, és pulzál.** Nem
kell semlegesnek lennie, csak a sávtól eltérőnek.

**Nyíl (v3-02):** *„overall very good, everything is OK, except:"* — ha a vonal
végén nyílhegy van, **nem kell az utazó pont is.** Vagy pont, vagy nyílhegy,
nem mindkettő ugyanabban az animációban. És: **a vonal és a nyílhegy azonos
színű** — vagy kék vonal + ZÖLD utazó pont, de nem kék vonal + zöld nyílhegy.

**Arány-sávok (v3-03):** 2 vagy 3 sáv is jó. Kettőnél a mostani térköz rendben.
**Ha három van, a harmadik élesen más színű: PIROS preferált** (amber elfogadható).

**Split (v3-04):** *„nagyon tetszik, amikor egy-egy szó mintha szövegkijelölővel
lenne aláhúzva"* — kell egy **highlighter-kiemelés** archetípus: lágy, ferde
sáv húzódik be a szó alá balról jobbra. Plusz: a ✗/✓ jelölők kapjanak saját
animációt, és **Skitch-stílusú jelölő-készlet** kell (kör + fül + glyph,
öt változat).

**Vonaldiagram (v3-05):** a mostani „minden pont egyenként kiül" nem az, amit
kért. Helyette: **a zöld bold pont VÉGIGMEGY a vonalon**, egyenletes
sebességgel, mintha rajzolná, és **a végén megáll és pulzál.** A közbenső pontok
maradhatnak halványan, de a főszereplő az utazó pont.

**Form (v3-07):** *„fantasztikus az animáció maga"* — de a form és a tipográfia
**kisebb és életszerűbb** legyen. A korábbi (HeyGen-referencia) példa aránya jobb
volt: keskenyebb kártya, kisebb betűk, több levegő a mezők között.

**Progress ring (v3-09):** az animáció jó, **csak a térköz nem** — a `SCALE.md`
`--sp-6` (104 px) rendezi.

**Keyword pill (v3-10):** a fejléc még nagyobb, a pill szövege kisebb.
Ez pontosan a `SCALE.md` fejléc-szabálya: kicker `--fs-lead`, pill `--fs-caption`.
