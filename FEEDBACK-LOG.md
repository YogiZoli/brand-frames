# FEEDBACK-LOG — általános szabályok, nem videó-specifikusak

Minden bejegyzés MINDEN videóra érvényes, minden csatornán, visszavonásig.
A forrás screenshotok: `_feedback/<dátum>/`

---

## 2026-08-29 (este, 2. adag) — sampler apró simítások (10 kép)

Forrás: `_feedback/2026-08-29/` (minor / mouse / router / arrow / flywheel / quote).

- **LENS:** a felirat SOHA ne csússzon rá a címre vagy a sub-ra. A lupe SOHA
  ne legyen üres utazás közben: a régi szó zoomol ki, az új zoomol be, imitálja
  a valódi nagyítót. Ez FELÜLÍRJA a régi v1.6 "blank while it travels" elvet.
- **FORM kurzor:** a kurzor MÁR AZ ELEJÉN a képen van, előbb a name mezőre megy,
  csak utána indul a gépelés, majd az email mezőre, végül a gombra. A `click`
  mozgás mostantól N pontos path-ot kezel.
- **Gomb-glow:** minden gomb kap egy jól látható zöld glow-lüktetést a
  dobozárnyékon (`btnPulse`), nem csak a finom scale-t.
- **KEYWORD router:** valódi szétágazó lábak (mint a 30 BRANCH), 0-ról indulnak
  és a pillek felé kivastagodnak. Minden pill elé kis magyarázó ikon.
- **ARROW:** a végigfutó jelölő NYÍLHEGY, nem pötty.
- **CYCLE:** lineáris körtöltés, a csomópont pontosan akkor gyúl ki, amikor a
  kör odaér, nem később.
- **QUOTE:** az idézet dőlt IS (nem csak félkövér). Az author jobbra rendezve.
  A záró idézőjel valódi span (`.qq`), csak a legutolsó szó után pattan be.

---

## 2026-08-29 — sampler feedback a brand-kánon utáni első renderre (10 kép)

Forrás: `_feedback/2026-08-29/zoom-effect-01..10.png`. Mind a könyvtárba ment.

- **Egérmutató (FORM):** soha nem CSS-háromszög. Valódi rendszer-kurzor nyíl
  (sötét kitöltés, fehér kontúr, árnyék). Az "odaviszem az egeret, majd gépel"
  effekt jó, marad. Megoldva: `.cursor,.mouse` SVG data-URI a `zg.css`-ben.
- **Pulzálás MINDEN gombon, minden jeleneten**, nem csak ahol kézzel be volt
  írva `data-pulse`. A `motion.js` build() mostantól automatikusan pulzáltat
  minden `.fbtn .ecbtn .cpill .callout .krpill .appbtn` elemet.
- **KEYWORD PILL:** a több-választásos "routing" verzió a kedvenc. Egy pill
  szétágazik három opcióra (GUIDE / COURSE / TRIGGER), visszafogott IF/ELSE
  elválasztó effekttel. Új `kroute` mozgás + `.kroute` blokk. A gyenge
  "APPROVAL POINT 04" elem törölve.
- **BRANCH / router:** a forma jó, de a kimeneti korongok legyenek magas
  kontrasztúak: vitt út = tömör accent-zöld + fehér pipa, nem vitt út = fehér
  korong szürke kerettel + szürke vonás. Új `dash` glyph.
- **FUNNEL:** a lépcsők legyenek jól elkülöníthetők. Kánonon belül: azúr to
  mélykék to mély zöld to majdnem fekete zöld. Narancs TILOS marad.
- **GAUGE:** az ív vége és a mutató vége UGYANOTT legyen. A `motion.js` `* .5`
  hibája javítva (`C * (1 - pct)`).
- **LENS felirat:** felülről, a cím és a kártya közé ússzon be, unfold
  effekttel, színes tinttel, figyelemvezetéssel. Új `unfold` mozgás.

---

## 2026-08-29 — render-kommunikáció, MINDEN renderre, visszavonásig

Amikor bármilyen hosszú műveletet indítasz (render, batch, composite, bármi ami
percekben mérhető), a művelet indításakor azonnal, EGYETLEN üzenetben írd meg:

- mennyi ideig tart, konkrét perccel (becslés is jó, de szám legyen)
- pontosan HÁNY ÓRAKOR folytatod ("folytatás 18:52-kor, kb. 9 perc múlva")
- hogy addig a gépet NE csukja le (a lokális render a gép leállásával megszakad)
- egy sor, hogy közben nem kell Claude-ot nyitva tartani

Utána HALLGATÁS. Nem pollozol, nem tartod nyitva a beszélgetést, nem írsz
státuszfrissítést, amíg a művelet le nem fut. A harness magától értesít, amikor kész.

Zoltán ezt minden egyes render előtt kézzel elmondta hónapokon át. Mostantól a
hiánya hiba. Ha nem tudod a pontos időt, olvasd ki EGYSZER a render logból az
ETA-t, aztán csend.

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

---

## 2026-08-18 — HF-v6 (5 kép) · a v1.5 sampler

Forrás: `_feedback/2026-08-17/HF-v6-01..05.png`. Mind az öt **általános** szabály,
mind a **könyvtárba** ment, egyikből sem lett egyvideós javítás.

### 1. „szar ikonok megint" — skitch markerek (HF-v6-01)
**Amit láttunk:** a marker glyphje egy FONT KARAKTER volt (`&#10007; &#10003; ? ! &#9829;`)
egy SVG `<text>`-ben, mellette egy nyers háromszög „fül".
**Miért baj:** a font karakternek saját alapvonala, saját optikai súlya és saját
metrikája van — soha nem ül középen a korongban, és soha nem egyezik az ikonkészlet
vonalvastagságával. A háromszög fül pedig renderelési hibának olvasódik.
**A szabály:** *a jelentést hordozó jel is IKON, nem betű.* Minden marker-glyph rajzolt
path a 24-es rácson (`icons.js` → `G` készlet), tömör korongon, **fehér gyűrűvel**,
hogy bármilyen felvételen megálljon. **Fül nincs** — Zoltán saját referencia-markerein
sincs.

### 2. „megint csak beugrott" — progress ring (HF-v6-02)
**Amit láttunk:** a gyűrű a saját indulási pillanatában rögtön 100%-on állt.
**A gyökérok:** `pathLength="1"` egy `<circle>`-ön. `<path>`-en működik, körön nem
megbízható. Ha figyelmen kívül marad, a `stroke-dasharray:1` **1 pixelt** jelent,
a gyűrű tömörnek látszik, és a töltés ugrásnak tűnik.
**A szabály:** *soha ne bízz a `pathLength`-ben — mérj.* A `motion.js` `ringLen()`
kiolvassa a valódi kerületet (`getTotalLength()`), és user unitban animál. A könnyítés
szándékosan majdnem lineáris (`power1.out`): egy `inOut` progress ugrásnak látszik.
Ugyanez a javítás a signature ringre és a ciklusra is.

### 3. „kilógó szöveg" — contact record (HF-v6-03)
**Amit láttunk:** a kártya utolsó sora félbevágva tűnt el a lekerekített alsó él alatt.
**A gyökérok:** a `.cam` egy oszlop-flexbox. A flex elemek alapból **zsugorodnak**.
A magas kártyát összenyomta, aztán a saját `overflow:hidden`-je levágta.
**A szabály:** *a tartalmat SOHA nem nyomjuk össze, hogy beférjen.* `.cam > * {flex:0 0 auto}`.
Ha nem fér be, a jelenet túl sűrű — és akkor a **jelenet-tábla** a hibás, nem a CSS.
Sűrű jeleneteknek van egy `.dense` módosítójuk (kisebb gap, kisebb alsó tartalék).

### 4. „off szöveg" — lupé (HF-v6-05)
**Amit láttunk:** a lupé a TEMPERATURE oszlop fölött állt, és közben az „Enterprise"
szót nagyította.
**A gyökérok:** a szöveg csak a mozgás VÉGÉN cserélődött, így ~0,9 mp-ig a lencse
olyan szót mutatott, ami nem alatta volt.
**A szabály:** *a lencse soha nem mutathat olyan szót, amin nem áll.* Repülés közben
az üveg **üres** (a szöveg kihalványul), az új szó csak a landolás után jelenik meg.
Az üres üveg őszinte; a rossz szó hazugság arról, mi van alatta.

### 5. „kimaradt 2 új beúszó felugró szövegbuborék" (HF-v6-04/05)
A `.pop / .popk / .popv` osztályok ott voltak a CSS-ben, de **egyetlen jelenet sem
használta őket**. Új `popin` mozgás + két buborék a lupé-jelenetben.
**A szabály:** *a lupé mondja meg, HOVA nézz; a buborék mondja meg, MIT jelent.*
A buborék mindig a lencse landolása UTÁN érkezik, sosem előtte — különben a szemnek
két gazdája van. Buborék soha nem lebeg szabadon: mindig egy képernyőn lévő dologhoz
horgonyzik.

### Amit a kontakt lap kapott el, nem Zoltán
A `check` és a kontakt lap három tördelési hibát fogott meg az új archetípusokon
(ciklus közepe, mérőóra száma, elágazás gyökere) és egy kontraszthibát
(fehér a `green-500`-on = 2,95:1, a 3:1 küszöb alatt → `green-700`).
**Ez a 7. lépés dolga. Pontosan ezért van.**

---

## 2026-08-18 (2) — írásszabály, minden Claude-ra, minden témára

Nem videó-specifikus, nem is design-szabály. Ez arról szól, hogyan hangzik Zoltán.

**Emoji: nincs.** Sehol. Se chatválaszban, se scriptben, se leírásban, se
státuszjelzésben. A pipa és a kereszt is emoji. Státuszt szó mond meg.
Kivétel csak akkor, ha egy létező fájlnév tartalmazza, mert az útvonal
különben nem működik.

**Gondolatjel: nincs.** Sem hosszú, sem rövid, sem szóközök közé tett kötőjel.
Helyette vessző, kettőspont, zárójel, vagy legtöbbször **külön mondat**.
A gondolatjel a legárulkodóbb AI-jel egy szövegben.

**Ami marad:** kötőjel szóösszetételben és technikai névben (`zg-frames`,
`e-mail`, `AI-t`, `stroke-dasharray`), markdown listajelölő, táblázat.
Az helyesírás és szintaxis, nem stílus.

Teljes szabály: `C:\Users\gdp\CLAUDE.md`.

## 2026-08-18 (3) — mindig teljes elérési út

Zoltán másol-beilleszt, soha nem gépel útvonalat és soha nem kérdez rá.
Minden válasz végén "Fájlok" blokk: abszolút Windows-útvonal, beilleszthető
megnyitó parancs, és Drive URL, ha van. Egy sor egy beilleszthető dolog.
Teljes szabály: `C:\Users\gdp\CLAUDE.md`.
