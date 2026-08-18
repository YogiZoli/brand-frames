# SOUND.md — a mozgás hangja

> Verzió 1.0, 2026-08-18. Ez a spec, nem a megvalósítás.
> A HATÁR itt is él: **mi szöveget írunk, a HyperFrames gyárt kockát.**
> Hangmotort nem írunk. Amit írunk: egy táblázatot arról, mikor melyik minta
> szólna, és egy ffmpeg receptet, ami beleteszi. Hat wav fájl, semmi több.

## Miért kell

Most minden mozdulat néma. Egy elem leül a képen, és nem történik semmi a
fülben. Az agy ezt üresnek érzi, akkor is, ha a szem elégedett.

Egy alig hallható koppanás, amikor egy elem megérkezik, és egy halk emelkedő
hang, amikor egy sáv betelik: **ettől hangzik egy videó drágának.** Ez az egyik
legolcsóbb minőségi ugrás, ami létezik, mert nem kell hozzá se új render, se
új design, se több munka videónként.

## A készlet: hat minta, több nem

Hat minta lefedi mind a 39 archetípust. Ha hetedikre lenne szükség, az azt
jelenti, hogy egy archetípus nem illik a rendszerbe, és azt kell javítani, nem
a hangkészletet bővíteni.

| jel | mikor szól | karakter | hossz | csúcs |
|---|---|---|---|---|
| `scene` | jelenetváltásnál, minden jelenet elején | nagyon halk, tompa levegő | 180 ms | -34 dB |
| `land` | egy elem leül a helyére | rövid, puha koppanás, fa jellegű | 90 ms | -30 dB |
| `pop` | valami hangsúllyal jelenik meg | ugyanaz, egy terccel feljebb | 80 ms | -29 dB |
| `fill` | sáv, rail vagy tölcsér telik | halk emelkedő, folyamatos | a töltés hossza | -33 dB |
| `ring` | a védjegy-gyűrű RAJZOL | alig hallható súrlódás | 1,3 mp | -35 dB |
| `ringclose` | a gyűrű BEZÁRUL | egyetlen tiszta csengés | 700 ms | -28 dB |

### A hangolás

Minden minta **ugyanabban a hangnemben** szól. Ez a részlet választja el a
professzionális hangzást a hangeffekt-gyűjteménytől.

Ajánlás: **F dúr pentaton**, tehát F, G, A, C, D. Ez azért ez, mert nincs benne
félhang-súrlódás, tehát bármelyik két minta szólhat egyszerre anélkül, hogy
disszonáns lenne. Egy videóban tíz-húsz hang szól egymásra csúszva, és ha nem
egy skálán vannak, az ötödik után zajnak hallatszik.

- `land` alaphang F
- `pop` a fölötte lévő A
- `ringclose` a magas C, mert ez a lezárás, és a lezárás felfelé old
- `fill` F-ről A-ra csúszik fel, végig
- `scene` és `ring` hangolatlan zörej, nem dallam

### A keverés

- A hangkészlet a narráció ALÁ ül, mindig. A referencia a narráció csúcsa.
- Össz-hangerő: a hangkészlet soha nem viszi el a keveréket. Célérték
  **-30 dB a narrációhoz képest.**
- A zene ducking-ja a hangkészletre NEM vonatkozik: az effektek a zenével egy
  szinten ülnek, nem a narrációval.
- A végső keverék marad -14 LUFS, ahogy az `AUDIO.md` előírja.

### Amit soha

Nincs suhogás. Nincs whoosh. Nincs sci-fi. Nincs olyan hang, amit észreveszel.
**Ha a néző megjegyzi, hogy volt egy hang, akkor túl hangos volt.**
A cél nem az, hogy halld, hanem hogy hiányozzon, ha kiveszem.

## Hogyan kerül bele

A `motion.js` menet közben feljegyzi, mikor melyik jel szólna, és a build végén
kiírja ide: `window.__zgCues`. Ez egy sima lista, időbélyeggel és névvel:

```json
[ {"t": 0.12, "s": "scene"},
  {"t": 1.71, "s": "land"},
  {"t": 3.40, "s": "fill"},
  {"t": 93.9, "s": "ring"},
  {"t": 95.2, "s": "ringclose"} ]
```

Ebből egy külön szkript épít ffmpeg parancsot. Nem a HyperFrames rakja bele, és
nem is mi írunk keverőt: az ffmpeg `adelay` és `amix` szűrője pontosan erre való.

A vázlat, ami majd a `pipeline\sound.ps1` lesz:

```
ffmpeg -i narracio_es_zene.wav
       -i sfx\land.wav -i sfx\pop.wav ...
       -filter_complex "[1]adelay=1710|1710,volume=-30dB[a1]; ...
                        [0][a1][a2]amix=inputs=N:normalize=0"
       -c:a aac -b:a 192k kimenet.m4a
```

## A gyártás menete, amikor sorra kerül

1. Hat wav a fenti specifikáció szerint. Forrás lehet ElevenLabs sound effects,
   vagy egy licencelt UI hangkészlet, vagy felvétel. **Mi nem szintetizálunk.**
2. Bekerülnek ide: `C:\Users\gdp\HyperFrames\_frames\zg-frames\sfx\`
3. Egy videón kipróbáljuk, és **Zoltán fülbe hallgatja meg, nem hangszóróból.**
   A -30 dB hangszóróból nem hallatszik, fülhallgatóban igen.
4. Ha jó, a `sound.ps1` bekerül a 9. lépés mellé, az avatar composite elé.

## Az egyetlen kapu, ami ide kell

A hangkészletet **egyszer** hagyjuk jóvá, ugyanúgy, mint a mozgást. Utána
videónként nincs döntés: a cue tábla automatikus.
