# SCALE — az arany standard

Zoltán döntése 2026-08-17. **Ezeken kívül más érték nem használható.**
Ha egy méret „30-nak tűnik jónak", akkor 24 vagy 40 lesz. Nincs kivétel.

Ez a fájl a `FRAME.md` (mit) és a `MOTION.md` (hogyan) mellé a **mennyit** adja.

## 1. Betűméret — moduláris skála, arány 1,25, alap 32

| Szerep | px | Mire |
|---|---|---|
| `--fs-micro` | **32** | mikro-label, tengelyfelirat, badge-szöveg, kulcs-címke |
| `--fs-caption` | **40** | segédszöveg, sáv-címke, listasor, kártyaszöveg |
| `--fs-body` | **50** | törzs, alcím (`sub`), rekord-érték |
| `--fs-lead` | **62** | kicker/fejléc, számláló, pill-szöveg |
| `--fs-card` | **78** | kártyacím, ikonbetű, sávfelirat |
| `--fs-head` | **98** | főcím első sora, végkártya-cím |
| `--fs-display` | **122** | a filmenkénti EGY nagy szó, caps főcím |

**Egy jeleneten legfeljebb HÁROM méret szerepel.** Ez a fegyelem szünteti meg a
zsúfoltságot — négy-öt méret egymás alatt mindig kaotikus lesz.

**Fejléc vs törzs:** inkább a fejlécet növeld, mint a szöveget zsugorítsd
(Zoltán, 2026-08-17). A kicker `--fs-lead`, a törzs `--fs-caption` vagy `--fs-body`.

## 2. Térköz — 8-pontos rács

| Token | px | Mire |
|---|---|---|
| `--sp-1` | **8** | ikon és címkéje, sűrű belső részlet |
| `--sp-2` | **16** | összetartozó elemek (szám és a saját sávja) |
| `--sp-3` | **24** | kártyán belüli sorok, listasor-magasság |
| `--sp-4` | **40** | blokkon belüli szakaszok, kártya-padding |
| `--sp-5` | **64** | önálló elemek között (kártyák egy sorban) |
| `--sp-6` | **104** | csoportok között (két sáv-egység, két kör) |
| `--sp-7` | **168** | fő szakaszok között, ritkán |

**A közelség jelentést hordoz.** Ami összetartozik: `--sp-2`. Ami külön dolog:
`--sp-6`. A visszatérő „nincs térköz" panasz mindig ennek a felborulása volt —
a szám a fejléchez volt közel, nem a saját sávjához.

## 3. Biztonságos terület

- Kép: 1920 × 1080. Margó **140 px minden oldalon**, árnyékkal együtt.
- Tartalom-box: **1640 × 800 px**. Az alsó ~190 px az avatarnak marad.
- Minden csoport szélessége **1640 px**, és a levegő az elemek KÖZÖTT van,
  nem a kompozíció KÖRÜL.

## 4. Mozgás-időtartamok — szintén skála

| Token | s | Mire |
|---|---|---|
| `--d-1` | **0,3** | mikro (kattintás, villanás) |
| `--d-2` | **0,5** | belépés (fade, rise) |
| `--d-3` | **0,8** | vonal rajzolása, kártya beúszása |
| `--d-4` | **1,3** | sáv növekedése, számláló |
| `--d-5` | **2,1** | progress ring telése, nagyító mozgása |

Pulzálás: **±2%**, 1,1 s ciklus, mindig a jelenet végén.
0,45 / 0,55 / 0,6 keverése tilos — a fentiek közül válassz.

## 5. Szín — a jelentés SOHA nem csak színen múlik

Zoltán színvak (rögzítve 2026-08-17), és a nézők ~8%-a is vörös-zöld
tévesztő. Ezért:

- **Minden jelentést legalább két csatorna hordoz:** szín + **forma** (✗ / ✓ /
  ! / ?) + **pozíció** (bal = negatív, jobb = pozitív) + **szó**.
- A piros–zöld pár soha nem az egyetlen különbség két elem között.
- **Claude ellenőrzi, nem Zoltán:** a renderelt kockákra deuteranópia-szimulációt
  futtatunk ffmpeg-gel, és megnézzük, hogy megkülönböztethető marad-e. Ez a
  regressziós teszt része.
- Zoltán színkérdésben flexibilis — a színdöntés Claude felelőssége, és
  indokolni kell.

### Színkiosztás
- **kék** = vezető, folyamat, semleges adat
- **zöld** = pozitív végállapot, kész, elfogadva
- **piros** = negatív, hiba, elvesztett idő (a harmadik sáv, ha három van —
  Zoltán: „piros preferred")
- **navy** = szöveg és semleges badge
- **narancs TILOS**

## 6. Ikonok

Betűk (`C`, `$`, `T`) csak helykitöltők voltak — **nem elfogadhatók**.
Kell egy egy vonalvastagságú SVG ikonkészlet, 12–16 ikon fedi az összes videót.

**Skitch-stílusú jelölők** (Zoltán kérése, 2026-08-17): körben egy glyph,
oldalt kis háromszög-fül, tömör kitöltés — öt változat: `✗` piros, `?` kék,
`!` narancs helyett **amber**, `✓` zöld, `♥` rózsaszín. Ezek jelölők, nem
dekoráció: mindig valamire mutatnak.

## 7. Kiemelés szövegben

A szövegkijelölő-hatás (highlighter) engedélyezett és kívánatos: egy szó vagy
rész alatt **lágy, ferde sárga/zöld sáv** húzódik be balról jobbra, mintha
kijelölőtollal húznák alá. Ez a hangsúly, nem a betűszín.
