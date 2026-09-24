# Scene timing comes from the sentence table, never from a hand-typed number

Verzió: 1.1 · 2026-09-24 (Node: a szkriptek `.mjs`, Windowson és Macen ugyanúgy.
A régi `-Stt` / `-OutDir` írásmód is működik, a kapcsolók kis-nagybetű
függetlenek. A `.ps1` párok tartalékként megvannak.)

## A szabály

Egyetlen jelenet sem hordoz kézzel írt `data-start` / `data-duration` bűvös
számot. A jelenet szerzője egyetlen dolgot ír be: **melyik mondaton ül a
jelenet**, `data-sent` attribútumként. A `data-start` / `data-duration` a
zárolt hangból származik, a `stamp-timing.mjs` tölti ki.

Ez a PIPELINE 3. és 5. lépését köti össze: a 3. lépés mondattáblája
(`sentences.mjs`) mostantól tényleges bemenet a build-nek, nem csak a
jóváhagyáshoz készült becslés.

## A két szkript

### 1. `sentences.mjs`: a mondattábla

```
node pipeline/sentences.mjs --stt <ElevenLabs szó-json> --outdir <mappa>
node pipeline/sentences.mjs --srt <vo.srt>              --outdir <mappa>
```

- A **szó-szintű STT json** a jó forrás (`{ words:[{text,start,end,type}] }`).
  Ez az, amiből a `vo.srt` is készül. Ha van, ezt add meg.
- SRT-ből is megy: a cue-k szó-csoportok, nem mondatok, ezért a mondathatár
  ideje a cue-n belül karakterpozíció szerint interpolált.
- Kimenet: `sentences.json` (a build eszi) + `sentences.md` (ezt nézed a
  3. kapunál).
- Mondathatár: `.` `?` `!` opcionális záró idézőjellel, majd szóköz vagy vég.
  A `...` gondolat közben NEM zár mondatot. Rövidítés-lista (`e.g.` `i.e.`
  `Mr.` `vs.` stb.) sem.
- 0 token, sima szövegfeldolgozás.

### 2. `stamp-timing.mjs`: a jelenet-időzítés bezárása

```
node pipeline/stamp-timing.mjs --html <index.html> --sentences <sentences.json>
node pipeline/stamp-timing.mjs --html in.html --sentences s.json --whatif   # csak mutasd
node pipeline/stamp-timing.mjs --html in.html --sentences s.json --strict   # warning = hiba
```

- Minden `<section class="clip">`-et dokumentum-sorrendben beolvas.
- A `data-sent` alapján kiszámolja a jelenet kezdetét, majd `data-start` /
  `data-duration` értéket ír a tag-be (a `data-sent` marad, az a forrás).
- `#root data-duration` a hang hosszára (plusz az utolsó jelenet `data-hold`-ja).
- Első futáskor `<html>.bak` mentés, utána helyben ír. Újrafuttatható,
  idempotens.

## Példa

```html
<section id="zg01" class="clip" data-sent="S1"><!-- ... --></section>
<section id="zg02" class="clip" data-sent="S2"><!-- ... --></section>
<section id="zg20" class="clip" data-sent="S20-S22"><!-- egy jelenet, 3 mondat --></section>
<section id="zg70a" class="clip" data-sent="S99#1/3"><!-- ... --></section>
<section id="zg70b" class="clip" data-sent="S99#2/3"><!-- ... --></section>
<section id="zg70c" class="clip" data-sent="S99#3/3" data-hold="0.4"><!-- ... --></section>
```

`stamp-timing.mjs` után ugyanezekbe bekerül a `data-start` és a
`data-duration`, a `data-sent` marad. Újrafuttatható: a régi számokat cseréli.

## A `data-sent` nyelvtan

Minden `<section class="clip">`-en:

| forma | jelentés |
|---|---|
| `data-sent="S12"` | a jelenet a 12. mondaton ül |
| `data-sent="S12-S15"` | a jelenet a 12..15 mondatot fedi le, horgony az S12 |
| `data-sent="S20#1/3"` | a 20. mondat 3 jelenetre bontva, ez az 1. rész |
| `data-sent="S20#2/3"` | ... 2. rész (S20 idejének egyenlő harmadai) |
| `data-sent="S20#3/3"` | ... 3. rész |

Ritkán, és kommenttel megindokolva:

| attribútum | mit csinál |
|---|---|
| `data-sent-shift="0.20"` | a jelenet kezdetét +0.20 mp-cel tolja (negatív is) |
| `data-hold="0.5"` | csak az utolsó jelenet: 0.5 mp-cel tovább tart a hang után |

## Hogyan esik ki az időzítés

```
start[i]        = a horgony-mondat kezdete (+ shift), az előző jelenet után tartva
duration[i]     = start[i+1] - start[i]                (folytonos, nincs rés)
duration[utolsó] = hangVége + hold - start[utolsó]
```

A kezdet a mondatból jön. A hossz mindig a KÖVETKEZŐ horgonyból, sosem gépelt.
A jelenetek a szerző sorrendje szerint, hézag nélkül fekszenek fel.

## Mit jelez (warning, `-Strict` alatt hiba)

- horgony-mondat nincs a táblában (ez mindig hiba)
- a jelenetek sorrendje nem monoton (rossz `data-sent` sorrend)
- egy jelenet 0.8 mp-nél rövidebb vagy 12 mp-nél hosszabb (valószínű rossz horgony)
- egy mondatot egyetlen jelenet sem mutat (lefedetlen mondat)
- a `#k/n` split-csoport hiányos

## 3. `image-audio-lint.mjs`: a kép azt mutatja, amit a hang mond?

```
node pipeline/image-audio-lint.mjs --html <index.html> --words <words.json>
node pipeline/image-audio-lint.mjs --html in.html --words w.json --strict   # flag = exit 1
```

Olcsó, Opus előtti szűrő. Minden jelenet képernyőn lévő szavait összeveti a
jelenet időablakában ténylegesen elhangzott szavakkal, és jelzi, ha a kép olyan
szót mutat, amit a narráció ott nem mond. A triviális csúszásokat fogja: egy
mondatot csúszott jelenet, egy bennmaradt szó, egy szám ami nem stimmel
("25" a képen, mikor a hang még három mondatra van a "twenty-five"-tól).

- Bemenet: a `stamp-timing.mjs`-sel már megcímkézett HTML (`data-start` kell) és
  a `sentences.mjs` `words.json`-ja.
- `-Lead 1.0` / `-Lag 0.8`: a kép ennyivel megelőzheti vagy követheti a mondatot.
- Kihagyja a scaffold szöveget (`.kick` címke, `.sub` felirat, `.plateTag`).
- Lenient: pontos egyezés vagy közös 3 betűs tő ("publish" / "published"),
  számok szó-alakra fejtve, sorszám a tőszámra ("second" -> "two").
- **NEM a 3. kapu.** Nem dönti el, jó-e az archetípus vagy jó-e a kép. Csak
  szó-átfedést néz. A tiszta futás annyit jelent: "nincs nyilvánvaló csúszás".

## A menetben hol van

```
1  kutatás + cím + script            Opus     1. kapu
2  VO + zene                          szkript  2. kapu   <- itt zárul a hang
3  sentences.mjs  -> sentences.md + words.json           <- a mondattábla
4  jelenet-tábla (archetípus + szó)   Opus     3. kapu   <- ide kerül a data-sent
5  build -> index.html                Sonnet
   stamp-timing.mjs                   szkript            <- data-start/duration bezár
   image-audio-lint.mjs               szkript            <- csúszás-szűrő, vissza a 4-re
6  lint -> check                      HyperFrames
```
