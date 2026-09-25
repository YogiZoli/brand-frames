# SZÓTÁR ÉS TELJES FOLYAMAT

> Ez a doksi Zoltánnak szól, nem a gépnek. Két része van. Az első a szakszavak,
> bőséges példákkal. A második a teljes gyártási folyamat, a stratégiától a
> publikálásig, végig, kihagyás nélkül.
> Verzió: 1.0, 2026-08-18.

---

# ELSŐ RÉSZ: A SZAKSZAVAK

## Archetípus

**Egy újrahasználható jelenet-minta.** Nem konkrét kép, hanem sablon: "így néz ki
és így mozog az a jelenet, ahol a narrátor két dolgot szembeállít".

Gondolj rá úgy, mint a konyhában a receptekre. Nem az a kérdés, hogy "milyen
legyen ez a tányér", hanem hogy "melyik receptet főzöm most". A recept adott, a
hozzávalók változnak.

A könyvtárban 39 archetípus van. A kulcs, ami miatt ez működik: **nem látvány
szerint vannak indexelve, hanem aszerint, hogy mit CSINÁL a narrátor.**

| A narrátor éppen | Archetípus | Példa mondat |
|---|---|---|
| kijelent | statement | "Ez a rendszer lényege." |
| szembeállít | split, before/after | "Nem terminál kell. Egy mondat kell." |
| felsorol | tiles, grid, panel-lista | "Cím, leírás, fejezetek, huszonöt nyelv." |
| sorba rendez | arrow, rail, funnel, cycle | "Előbb script, utána hang, utána kép." |
| számol | count-up, gauge, bars | "Harminc másodperc videó, ötvennégy másodperc gépidő." |
| megmutat | panel-mock, lens, command | "Ide gépeled be, pontosan így." |
| emberré tesz | lead-kártya, personák | "Alex négy hónapja csinálja." |
| meghív | keyword-pill, végkártya | "Írd le kommentbe: GUIDE." |
| kérdez | question | "Mi lenne, ha a jóváhagyás előbb jönne?" |
| idéz | quote | "A döntés az enyém marad." |
| elágazik | branch | "Vagy van kulcsszó, vagy nincs." |

**Miért ez a legfontosabb döntés az egész rendszerben.** Mert ha az archetípust a
mondat típusa választja ki, akkor a nulladik szabály (a kép azt mutatja, amiről a
hang beszél) nem fegyelem kérdése, hanem automatikus. Nem tudsz véletlenül
dekorációt tenni a képre, mert nincs olyan archetípus, hogy "valami szép".

Konkrét példa. A script mondata: "Ez harminc másodperc videó, és ötvennégy
másodperc gépidő." A narrátor SZÁMOL. Tehát count-up bars. Nem azért, mert a
sávok jól néznek ki, hanem mert a mondat számokat állít szembe. Ha a mondat az
lett volna, hogy "a gép gyorsabb, mint gondolnád", az KIJELENTÉS, és statement
lenne belőle.

## Render

**A kockák legyártása.** A kompozíció egy weboldal, ami mozog. A render ezt
lefényképezi képkockánként, és összefűzi egy mp4 fájllá.

A most elkészült sampler: 192 másodperc, 30 kocka másodpercenként, tehát
**5760 külön képkocka**. A gép mindegyiket külön lefotózta, majd összerakta.
Ez tartott 8 perc 46 másodpercig.

Két dolog, amit érdemes tudni róla.

**A render lassú és drága időben, de nulla token.** Nem beszélgetés, nem AI,
csak a géped dolgozik. Ezért lehet éjszakára tenni, és ezért nem baj, ha hosszú.

**A render az UTOLSÓ lépés, nem az első.** Ha a render után derül ki, hogy rossz
szó van a képen, az újabb kilenc perc plusz a javítás. Ezért van minden
jóváhagyás a render ELŐTT. Erről szól az egész pipeline.

## Kontakt lap

**Egy kép, amin ott van az összes jelenet, bélyegképként.** A neve a fotózásból
jön: a laborban a filmtekercs összes kockáját egy lapra hívták elő, hogy egyben
lehessen látni, melyik használható.

A miénk: `_sheet16.jpg`, nyolcszor öt rácsban a 39 jelenet.

**Mire jó.** Két perc alatt átfut rajta a szemed, és azonnal kiugrik, ha valami
tördelési hiba van. Kilóg a szöveg, ütközik két elem, üres a jobb fele a képnek,
elcsúszott egy felirat. Erre való.

**Mire NEM jó, és ezt minden alkalommal ki kell mondani: a kontakt lap SOHA nem
mutat mozgást.** Állóképek. Attól, hogy a kontakt lapon jól néz ki egy jelenet,
a mozgás még lehet rossz. A mozgást a motion sampler hagyja jóvá, nem ez.

Példa a különbségre. A progress ring a kontakt lapon tökéletesnek látszott a
v1.5-ben is, mert a kockán egy teli zöld gyűrű volt. Csak mozgásban derült ki,
hogy nem tölt, hanem beugrik. A kontakt lap ezt nem tudta volna megfogni, soha.

## Motion sampler

**Egy videó, amiben minden archetípus szerepel, valódi mozgással, egymás után.**
Ez a `sampler_v1.6.mp4`.

Az ötlet a következő. A mozgást nem videónként hagyod jóvá, hanem **a könyvtár
verziójára, egyszer.** Megnézed a samplert, azt mondod "v1.6 jóváhagyva", és
onnantól minden videó, ami ebből a könyvtárból épül, örökli ezt a mozgást.
Videónként már csak TARTALMI jóváhagyás van: jó szó van-e a jó mondaton.

Ez óriási különbség. Enélkül minden videónál újra végig kellene nézned az összes
animációt. Így egyszer nézed meg, és utána tíz videón át nem kell.

## Regressziós teszt

Előbb a szó. **Regresszió = visszaesés.** A szoftverfejlesztésben azt jelenti,
hogy valami, ami eddig működött, egy másik javítás mellékhatásaként elromlott.

Klasszikus példa a mi rendszerünkből. Tegyük fel, hogy javítom a lupét, és közben
hozzányúlok a `.panel` osztályhoz. A lupé megjavul. De a `.panel`-t használja a
11-es panel-lista és a 16-os kontakt kártya is. Azok elromlanak. Én nem tudom,
mert a lupét néztem. Te három videóval később veszed észre.

**A regressziós teszt ezt fogja meg.** A logika:

1. Van egy jóváhagyott render, ez a **baseline**, magyarul a referencia.
2. Ebből kimentünk jelenetenként egy reprezentatív képkockát.
3. Bármilyen könyvtár-változás után újrarenderelünk.
4. Az új rendert ugyanígy felszeleteljük.
5. Jelenetenként **kockára pontosan összehasonlítjuk** a baseline-nal.
6. Kiírjuk, MELYIK archetípus változott.

**A kulcskérdés, amit minden változott sorra fel kell tenni: akartam ezt?**
Ha a lupét javítottam és a lupé változott, az rendben van. Ha a lupét javítottam
és a panel-lista is változott, az egy bug, amit még egyetlen videó előtt
megfogtunk.

## Regressziós szkript

**A program, ami ezt automatikusan lefuttatja.** A fájl:
`C:/Users/gdp/HyperFrames/_frames/zg-frames/regress.mjs` (futtatás:
`node regress.mjs`; a régi `regress.ps1` 2026-09-24-én törölve)

Mit csinál, lépésről lépésre:

1. **Kiolvassa a jelenet-táblát magából a kompozícióból.** Nem másolat, nem külön
   lista, amit karban kellene tartani. Beolvassa az `index.html`-t, és megtalálja
   benne mind a 39 jelenetet, a kezdetükkel, a hosszukkal és a címükkel.
2. **Jelenetenként kivág egy kockát**, a jelenet kezdete plusz a hossz 78
   százalékánál. Ez azért pont ott van, mert akkor már leszállt a mozgás, de még
   nem kezdődött el a kimenet.
3. **Összehasonlít.** Az ffmpeg megméri a két kocka eltérését, ebből RMSE lesz,
   ami egy 0-tól 255-ig terjedő számskála. Nulla azt jelenti, hogy a két kép
   bitre azonos.
4. **Ítélkezik.** 0,8 alatt "same", tehát ugyanaz. 2,0 alatt "noise", tehát
   élsimítási zaj, nem érdekes. 2,0 fölött **CHANGED**, tehát nézd meg.
5. **Színvakság-szimuláció.** Minden változott jelenetről készít egy második
   kockát, amin a zöld és a piros úgy néz ki, ahogy egy deuteranóp ember látja.
   Így egy olyan regresszió sem csúszik át, ami csak színben létezik.
6. **Jelentést ír.**

**Nulla token.** Nem AI, csak ffmpeg. Futtathatod ezerszer.

Ma bizonyítottam is, hogy tényleg mér. Ráeresztettem a régi v1.5 renderre, és
**29 változott jelenetet talált**, tíz továbbit pedig helyesen jelölt meg azzal,
hogy azok nincsenek is benne abban a renderben. Utána ráeresztettem a v1.6-ra, és
**mind a 39 nullát adott**. Egy teszt, ami mindig zöld, nem teszt. Ez nem az.

## Regressziós jelentés

**A szkript kimenete, egy markdown fájl.** Itt van:
`C:\Users\gdp\HyperFrames\_frames\zg-frames\_regress\regress-report.md`

Egy táblázat, jelenetenként egy sorral, a legrosszabbal a tetején.

| oszlop | mit jelent |
|---|---|
| scene | melyik jelenet, például `zg17` |
| RMSE | mennyire tér el a baseline-tól, 0 az azonos |
| verdict | same, noise, CHANGED, NEW, NINCS A RENDERBEN |
| archetype | a jelenet neve emberi nyelven |

A `NEW` azt jelenti, hogy ez az archetípus nincs a baseline-ban. Új archetípus.
Ez nem hiba, csak tény.

## Ratchet

**Racsni.** Az a szerkezet, ami csak egy irányba enged, visszafelé nem.
Kerékpárban, csavarhúzóban, emelőben ez van.

Nálunk ez a legfontosabb szervezési elv, és így hangzik:

> **Minden visszajelzés a KÖNYVTÁRBA megy, nem egy videóba.**

Vegyünk egy konkrét példát. Ma azt írtad egy screenshotra, hogy "szar ikonok
megint". Két út állt előttem.

**A rossz út, ami nem racsni.** Kijavítom a 28-as jelenetet ebben a
samplerben. Kész, jól néz ki. A következő videóban ugyanaz a hibás minta
kerül be, mert a KÖNYVTÁR nem változott. Te megint leírod, hogy szar. Én megint
kijavítom. Ez egy körhinta, nem racsni. Örökké tart.

**A jó út, ami racsni.** Megkeresem, MIÉRT szar. Kiderül, hogy a jel egy font
karakter volt, nem rajzolt ikon. Ebből három helyre kerül szabály:
a `FEEDBACK-LOG.md`-be a dátumozott szabály, a `DESIGN-FOUNDATION.md`-be az
elv, és magába a komponensbe a kód. Onnantól **egyetlen jövőbeli videóban sem
lehet font karakter ikon helyett.** Nem azért, mert emlékszem rá, hanem mert a
rendszer nem engedi.

**Ezért igaz az, hogy a harmadik videó ott kezd, ahol a második befejezte.**
Nem ugyanonnan indul. Feljebb indul. És soha nem csúszik vissza.

## További szavak, amikkel találkozol

**Kompozíció.** A weboldal, amiből a videó lesz. Konkrétan az `index.html`. Nem
weboldal a szó hétköznapi értelmében, senki nem böngészi. Csak a render nézi meg,
és lefényképezi.

**Jelenet-tábla.** Egy sima szöveges lista, ami megmondja, melyik mondatra melyik
archetípus jön, és melyik legfeljebb hat szó kerül a képre. Így néz ki:

```
t=1.71   7.3s  arrow       ONE IDEA -> PUBLISHED     sub: "Not a draft..."
t=9.05   5.3s  tiles-4     Title, Description, Chapters, 25 languages
t=14.38  2.6s  statement   "Let me be" / PRECISE
```

Ez a legfontosabb dokumentum az egész gyártásban. Két perc alatt átfutod, és
pontosan azt dönti el, ami a videót eldönti. Egy javítás itt egy sor. Ugyanaz a
javítás a render után negyven perc.

**Mondattábla.** Az elhangzott mondatok listája időpontokkal, a hangfájlból
kiolvasva. Ez nem döntés, hanem MÉRÉS. Ezért nincs rajta jóváhagyás.

**Kapu.** Egy pont, ahol megállunk, és te azt mondod, hogy mehet tovább. Öt van
belőle. Nem azért, hogy lassítson, hanem azért, hogy a drága lépés előtt legyen
a döntés.

**Lint és check.** Két automatikus ellenőrzés. A lint a kódot nézi, a check
ténylegesen betölti a kompozíciót és megnézi, kilóg-e valami, ütközik-e valami,
olvasható-e a kontraszt. Ma a check fogott meg négy hibát, mielőtt te egyetlen
kockát láttál volna, köztük egy kontrasztot, ami fehér szöveg volt zöld
alapon 2,95-ös aránnyal, a hármas küszöb alatt.

**Snapshot.** Egyetlen állókép egy megadott időpontban, render nélkül. Nagyon
gyors, húsz-hatvan másodperc. Erre való, ha csak egy jelenetet akarok
ellenőrizni. Ma ezzel néztem meg a javításokat, mielőtt kilenc perc rendert
indítottam volna.

**Baseline.** A jóváhagyott referencia, amihez a regressziós teszt hasonlít.
Mostantól a v1.6.

**Alfa-csatorna.** Átlátszóság. Amikor a HyperFrames grafikát renderel a
telefonos felvételed FÖLÉ, akkor a grafika háttere átlátszó, és az ffmpeg
ráteszi az érintetlen felvételre. A felvétel nem kódolódik újra.

**Composite.** Összefűzés. Az avatar körkivágott, átlátszó videó, amit a render
UTÁN teszünk a kész képre, ffmpeggel.

**Token.** Az AI beszélgetés költségegysége. Amit én írok és olvasok, az tokenbe
kerül. A render, a check, a snapshot, a composite **nulla token**, mert azok a
gépeden futó programok, nem beszélgetés. Ezért van az, hogy a szabály így szól:
Opus a scriptre és a jelenet-táblára, minden másra olcsóbb modell vagy szkript.

---

# MÁSODIK RÉSZ: A TELJES FOLYAMAT, VÉGIG

Négy szinten működik a rendszer. Fentről lefelé egyre gyakrabban futnak.

| szint | milyen gyakran | mit dönt el |
|---|---|---|
| Csatorna-alapozás | csatornánként EGYSZER | ki vagy, kinek beszélsz |
| Playlist-launch | playlistenként egyszer | mi a sorozat, mi a lead magnet |
| Videó-pipeline | MINDEN videónál | ez a konkrét videó |
| Post-publish | publikálás után | mi legyen a videóval azután |

---

## NULLADIK SZINT: Csatorna-alapozás

Ez már megvan a te csatornádon, de a teljesség kedvéért.

**Mikor fut.** Egyszer, mielőtt a csatorna elindul. Nálad ez már lezajlott.

**Mit hoz létre.** Az Avatar Card, tehát pontosan kit szolgálsz. A Hero Story,
tehát a te saját utad, ami hitelesíti a tanítást. Az EEAT alapok, tehát az, amiből
a YouTube és a néző látja, hogy értesz hozzá. A jogi és fiókbeállítások.

**Miért számít minden későbbi lépésben.** Mert minden videóötletnek ezt az egy
embert kell szolgálnia. Ha egy ötlet nem az ő átalakulásáról szól, kiesik, akkor
is, ha egyébként jó ötlet.

---

## ELSŐ SZINT: Playlist-launch

**Mikor fut.** Playlistenként egyszer, MIELŐTT az első videó elkészülne.

Ez a lépés az, amit a legtöbben kihagynak, és emiatt az első tíz videójuk nem hoz
egyetlen feliratkozót sem. Mert nincs hová vinni a nézőt.

**Mi történik itt.**

Először megszületik a playlist koncepció. Egy playlist nálad nem lejátszási lista,
hanem **ingyenes kurzus**. Minden videó egy modul. Van nyitó íve, közepe és
zárása. A néző a végén tud valamit, amit az elején nem tudott.

Utána a funnel épül fel. Ez átmegy az email-list-building csapatnak. Ott dől el,
hogy mi a lead magnet: PDF, mini-kurzus, vagy szegmentáló kérdőív. Megépül a
landing page, megépül a GHL automatizmus, és a végén visszajön **egy állandó
opt-in URL**.

**Miért ez a legfontosabb kimenet az egész szinten.** Mert ettől kezdve minden
videó leírásában van egy élő link, az első naptól. Nem "majd később berakom".
Az első videó alatt is ott van.

**Mivel indítod.** Ezt írod: `playlist launch @Zoltan Gero`

---

## MÁSODIK SZINT: A videó-pipeline

Ez fut minden videónál. Kilenc lépés, öt kapu.

Előbb a legfontosabb kérdés, ami mindent eldönt.

### A nulladik kérdés: mi az alapanyag?

Nem négy párhuzamos gyártósor. Egy kérdés az elején: **mi a bázisréteg?**

| bázis | mi az alapanyag | a HyperFrames szerepe | avatar |
|---|---|---|---|
| **graphics** | nincs felvétel | a grafika MAGA a videó | opcionális sarok-kör |
| **camera** | telefonnal felvetted magad | grafika a felvétel FÖLÉ | nem kell, te vagy a képen |
| **screen** | képernyőfelvétel | a felvétel a grafikán BELÜL | opcionális |

Két módon lehet felvételt és grafikát keverni, mindkettő gyári HyperFrames.

**Grafika a felvétel fölé.** A HyperFrames átlátszó háttérrel renderel, és az
ffmpeg ráteszi az érintetlen felvételre. Ide való a lower-third, a kinetikus cím,
az adatkiemelés, az idézet, a kiemelő gyűrű. **A felvételed nem kódolódik újra**,
tehát nem romlik a minősége.

**Felvétel a grafikán belül.** A klipet bemountoljuk a kompozícióba, így a
HyperFrames tud rajta zoomolni, pásztázni, eszközkeretbe tenni, és a kurzort
lupéval követni. Ide való a képernyőfelvétel és a termékbemutató.

Van egy negyedik eset, ami nem ide tartozik: ha a HeyGen avatar MAGA a videó és a
grafika mellékes, akkor a HeyGen online a helyes út. Oda ne építsünk gépezetet.

### 1. lépés: Kutatás, cím, script

**Ki csinálja.** Opus. Ez az egyik a két helyből, ahol a legerősebb modell kell.

**Fontos sorrend: a CÍM a script ELŐTT születik.** Nem fordítva. A cím határozza
meg a kulcsszót és az ígéretet, és a scriptnek azt kell teljesítenie. Ha
fordítva csinálod, írsz egy jó videót, amit senki nem talál meg.

Ez a lánc: kulcsszókutatás, cím, majd a script az Ownership keretrendszer szerint,
tehát OPEN, TEACH, OWN.

**Az első kapu.** Elolvasod a scriptet, és jóváhagyod. Innentől a script zárt.

### 2. lépés: Hang és zene

**Ki csinálja.** Szkript, ElevenLabsszel. A hangod a "Z HU mic 06".

Narráció és zene EGY fájlba kerül, ducking-gal, tehát a zene automatikusan
halkul, amikor beszélsz. A végső hangerő mínusz 14 LUFS.

**A második kapu.** Meghallgatod. Ha jó, a hang **zárva van.**

**Ez a legfontosabb következmény az egész gyártásban: a hang a fix óra.**
Soha nem nyújtjuk a hangot, hogy passzoljon egy animációhoz. Mindig a kép
igazodik a hanghoz. Ha ez fordítva történik, a videó ritmusa szétesik.

### 3. lépés: Mondattábla

**Ki csinálja.** Szkript. Kiolvassa a zárt hangból, hol vannak a mondathatárok és
mikor hangzik el mi.

**Miért NINCS itt kapu.** Mert ez nem döntés, hanem mérés. Ha rossz, akkor a hang
rossz, azt viszont a második kapu már jóváhagyta.

### 4. lépés: A jelenet-tábla

**Ez a legfontosabb újítás az egész rendszerben.**

**Ki csinálja.** Opus. Ez a másik hely, ahol a legerősebb modell kell.

Két dolog dől el itt, mondatonként. Melyik archetípus, és melyik legfeljebb hat
szó kerül a képre.

**A harmadik kapu.** Sima szöveg, két perc alatt átfutod.

**Miért itt van a legfontosabb kapu.** Mert ez pontosan azt dönti el, ami a
videót eldönti: jó szó van-e a jó mondaton, és nem tér-e el a kép a hangtól.
És mert ez a lassú lépés ELŐTT van. Egy javítás itt egy sor szöveg. Ugyanaz a
javítás a render után negyven perc.

Ez a te saját elved, csak egy fokkal korábbra tolva, mint a preview.

### 5. lépés: Build

**Ki csinálja.** Sonnet vagy szkript. Ez sablonbehelyettesítés: a jelenet-tábla
plusz a könyvtár egyenlő kompozíció.

**Nincs kapu.** Ha rossz, akkor a jelenet-tábla volt rossz, és a check úgyis
elkapja.

### 6. lépés: Lint és check

**Ki csinálja.** A HyperFrames. Nulla token.

A feltétel nulla hiba. Ma ez fogta meg a kontraszthibát és három tördelést.

### 7. lépés: Kontakt lap

**A negyedik kapu.** Egy kép, minden jelenet bélyegképe.

Ez NEM tartalmi kapu. A tartalom a negyedik lépésnél már átment. Ez kézműves
ellenőrzés: kifér a szöveg, nem ütközik semmi, kiegyensúlyozott a kép.

**És minden alkalommal ki kell mondani: a kontakt lap nem mutat mozgást.**

### 8. lépés: Render

**Ki csinálja.** A HyperFrames. Nulla token, de gépidő.

Egyszer. A samplernél ez 8 perc 46 másodperc volt 192 másodperc videóra. Egy
kilencperces videónál nagyjából harminckét perc.

Egy mért tény, amit ne mérjünk újra: **`filter:blur` nélkül a render kétszer
gyorsabb.** Ezért a háttér-ragyogás lágy sugárirányú átmenet, nem elmosás.

### 9. lépés: Avatar composite

**Ki csinálja.** ffmpeg. Nulla token.

Az avatar körkivágott, átlátszó WebM. A render UTÁN kerül rá, **a HeyGen saját
méretében, átméretezés nélkül.** A kompozíció alsó sávja üresen marad neki.

**Az ötödik kapu.** Megnézed a kész videót az avatarral együtt.

### A kilenc lépés egyben

| # | lépés | ki | kapu |
|---|---|---|---|
| 1 | kutatás, cím, script | Opus | 1. kapu |
| 2 | hang és zene | szkript | 2. kapu |
| 3 | mondattábla | szkript | nincs |
| 4 | **jelenet-tábla** | **Opus** | **3. kapu** |
| 5 | build | Sonnet | nincs |
| 6 | lint és check | gép | nincs, 0 hiba a feltétel |
| 7 | kontakt lap | gép | 4. kapu |
| 8 | render | gép | nincs |
| 9 | avatar composite | ffmpeg | 5. kapu |

**Mivel indítod.** Ezt írod: `új videó @Zoltan Gero, téma: ...`

### Ha telefonnal veszed fel magad

Ekkor a folyamat rövidebb, nem hosszabb.

| graphics bázis | camera bázis |
|---|---|
| script, majd hanggyártás, majd átirat | felveszed, majd átirat a felvételről |
| száz-plusz jelenet grafikája | körülbelül tizenöt overlay időpont |
| avatar composite a végén | nincs, te vagy a képen |

Nincs hanggyártás, mert a saját hangod már ott van. Nincs teljes jelenet-grafika,
mert grafika csak oda kerül, ahol számít. A jelenet-tábla ilyenkor
overlay-táblává egyszerűsödik. **Az öt kapu ugyanaz.**

---

## HARMADIK SZINT: Publikálás

Amikor a videó kész és feltöltötted nem listázottként, egyetlen parancs:

```
publish <a YouTube URL>
```

Amit ez legyárt: cím, teljes leírás affiliate linkkel, disclaimerrel és
fejezetekkel, maximalizált tag-lista karakterszámlálóval, hashtagek, kitűzött
komment, kártyák, végképernyő, és a thumbnail generáló prompt. Mindegyikhez
másoló gomb. Kérésre az API-n keresztül rá is írja a videóra.

**Egy figyelmeztetés a tagekhez.** A többszavas tag az idézőjelekkel EGYÜTT
számít a YouTube API-ban. A tényleges keret 440 és 470 karakter között van, nem
500.

Fejezetek. A YouTube automatikusan fejezetekre bontja a videót, ha a leírás
elején időbélyeges lista van, és az első nulla nullánál kezdődik.

Thumbnail. A brief plusz a Nano Banana 2 prompt készül el. A képet te generálod a
saját fotóddal.

---

## NEGYEDIK SZINT: Publikálás után

Ezek NEM futnak automatikusan. Te hívod őket, amikor akarod.

**Fordítás.** Ezt írod: `translate`. Az angol feliratból huszonöt nyelvre készül
felirat, plusz lokalizált cím és leírás, és felmegy a YouTube-ra. Minden videó
alapból többnyelvű.

**Shorts.** Ezt írod: `shorts`. A kész videóból három-öt darab harminc-hatvan
másodperces szegmens, mindegyikhez saját script és függőleges gyártási brief.

**Újrahasznosítás.** Email részlet, LinkedIn poszt, keresztposzt briefek.

**Közösség.** Kitűzött komment, kommentválasz-stratégia, Community poszt,
témabányászat a kommentekből.

**Elemzés.** Hét naponta. Ami működik, az visszamegy a stratégiához, és
befolyásolja a következő videó témáját. **Itt zárul a kör.**

---

## Az egész, egy ábrán

```
CSATORNA-ALAPOZÁS  (egyszer)
        |
        v
PLAYLIST-LAUNCH  (playlistenként)  ->  lead magnet  ->  ÁLLANDÓ OPT-IN URL
        |
        v
VIDEÓ-PIPELINE  (minden videónál)
   cím -> script [1] -> hang [2] -> mondattábla
        -> JELENET-TÁBLA [3] -> build -> check
        -> kontakt lap [4] -> render -> avatar [5]
        |
        v
PUBLIKÁLÁS  ->  "publish <URL>"
        |
        v
UTÓMUNKA  ->  fordítás, shorts, újrahasznosítás, közösség
        |
        v
ELEMZÉS (7 naponta)  --------> vissza a stratégiához
```

## Amiért az egész így van felépítve

Nem YouTuber vagy, hanem vállalkozó. A YouTube a forgalmi motor, **az email
lista a valódi vagyon.** Minden videónak van konverziós célja.

A playlist ingyenes kurzus, minden videó egy modul.

Nincs hamis szűkösség, nincs hustle kultúra, nincs virális hajkurászás.
Örökzöld, kereshető tartalom, és minősített leadek nézettség helyett.

És a rendszer racsni. A harmadik videó ott kezd, ahol a második befejezte.
