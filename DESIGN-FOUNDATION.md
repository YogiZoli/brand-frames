# DESIGN FOUNDATION — a teljes alapozás

Készült 2026-08-17, Zoltán kérésére: *„az összes design alapozást kérem nézd át
és írd át hogy az profi legyen"*.

Ez a fájl a **miért és mennyit** minden vizuális döntésre. A `SCALE.md` a
számokat adja, ez a rendszert körülöttük.

> **FRISSÍTVE 2026-08-29 — a paletta már a BRAND KANONBÓL jön.**
> Forrás: `C:\Users\gdp\projects\design-system\tokens.css` + `README.md`.
> A 4. pont rampái a kánon szerint frissültek (azure `#1E7CE8`, zöld `#12A150`,
> CTA `#0E8542`). A **színvakság-első OKLCH szemantikai rendszert Zoltán törölte**:
> nem kánon. Ahol lentebb az szerepel (4. pont "Színvakság", v3.0 "A LEGFONTOSABB
> TERVEZÉSI TÉNY"), az **elavult** — a szemantikus pár mint egyszerű gyakorlat
> marad (világos pozitív mező kontra tömör negatív mező + alak + szó), ideológia
> nélkül. Részletek: `_frames/zoltan-gero/BRAND-BRIDGE.md`.
> Ütközés esetén: a brand kánon nyer.

---

## 0. A HIÁNYZÓ ELEM, AMI MIATT „ÖSSZE VAN NYOMVA"

Zoltán visszatérő panasza — *„nagyon kicsi a térköz két sor között, zsúfolt
benyomást kelt, mintha össze lenne nyomva"* — **nem a betűméret és nem a
térköz-token hibája volt. A SORKÖZ hibája.**

A méreteket és a blokk-térközöket beállítottuk, de a `line-height` és a
`letter-spacing` végig érintetlen maradt. Egy 122 px-es cím 1,24-es sorközzel
optikailag szoros; két ilyen sor 8 px réssel gyakorlatilag összeér.

**Az alapszabály, ami ezt megoldja: minél nagyobb a betű, annál KISEBB a
relatív sorköz szám — de annál NAGYOBB az absztolút levegő körülötte.** A kettőt
nem szabad összekeverni.

---

## 1. SORKÖZ (line-height) — kötelező tábla

| Betűméret | line-height | Miért |
|---|---|---|
| 32 · 40 (micro, caption) | **1,50** | kis szöveg sok levegőt kér, hogy olvasható legyen |
| 50 (body) | **1,40** | folyó szöveg optimuma |
| 62 (lead) | **1,30** | átmenet |
| 78 (card) | **1,22** | |
| 98 (head) | **1,16** | |
| 122 (display) | **1,10** | nagy betűnél a szoros sorköz erős, tömör blokkot ad |

**De: a soron kívüli levegő nem a sorközből jön.** Két cím-sor között a
`.stmt` térköze legalább **16 px** (`--sp-2`), több soros blokk alatt
**64 px** (`--sp-5`) a következő elemig. A sorköz a soron BELÜL dolgozik, a
térköz a sorok KÖZÖTT.

---

## 2. BETŰKÖZ (letter-spacing / tracking) — optikai szabály

Ez a második, ami hiányzott. Nagy betűnél a betűk optikailag szétesnek, kicsinél
összefolynak. Ezért a tracking a mérettel ELLENTÉTESEN mozog:

| Szerep | tracking | Megjegyzés |
|---|---|---|
| micro caps (32, tracked label) | **+0,16em** | tracked caps mindig levegős |
| caption (40) | **+0,01em** | |
| body (50) | **0** | semleges |
| lead (62) | **−0,01em** | |
| card (78) | **−0,015em** | |
| head (98) | **−0,02em** | |
| display (122) | **−0,03em** | nagy betűnél kötelező szűkíteni |
| kicker (62, caps, tracked) | **+0,12em** | kivétel: caps + tracked, nem display |

**Szabály:** caps + tracked = nagy pozitív tracking. Kisbetűs display = negatív.
A `letter-spacing:-2px` fajta fix px-érték tilos — mindig `em`, hogy skálázódjon.

---

## 3. MÉRTÉK (measure) — a sorhossz

Egy sor **maximum 28–34 karakter** display méretben, és **legfeljebb 46** body
méretben. Ennél hosszabb sor videón olvashatatlan, mert a szem nem talál vissza.

- Cím: `max-width: 1400px`, és inkább **két rövid sor, mint egy hosszú**.
- Alcím (`sub`): `max-width: 1200px`.
- **Özvegy sor tilos:** egy sor végén ne maradjon egyetlen szó. Ha marad,
  a tördelést kézzel törjük meg.

---

## 4. SZÍN — rendszer, nem hexák gyűjteménye

### Rampák (mindegyik 5 fokozat: 50 · 100 · 500 · 700 · 900)

| Szerep | 50 (halvány) | 100 (tint) | 500 (alap) | 700 (sötét) | 900 (szöveg) |
|---|---|---|---|---|---|
| **kék** — vezető | `#EBF3FE` | `#D6E6FD` | `#1E7CE8` | `#144F9F` | `#15355F` |
| **zöld** — pozitív / akcentus | `#E4F5EA` | `#BFE8CC` | `#12A150` | `#0C6A36` | `#0A4228` |
| **piros** — negatív | `#FCECED` | `#FBD5D3` | `#E5484D` | `#B83230` | `#8A2320` |
| **amber** — figyelem | `#FBF2DD` | `#FAE2BB` | `#E5A400` | `#B26A00` | `#7D4A00` |
| **navy** — szöveg | `#F6F8FC` | `#EDF1F7` | `#6A7688` | `#333D4C` | `#1E2733` |

**CTA / gomb = `#0E8542`** (kánon `--primary`), fehér szöveggel (~4,7:1). A `#12A150`
vonalnak, gyűrűnek, kitöltésnek való, fehér szöveg nem áll meg rajta.

**Használati szabály:** `500` = tömör kitöltés és vonal. `100` = halvány háttér
tömör kitöltés MÖGÉ. `700` = szöveg a `100`-as háttéren. `900` = törzsszöveg.
A tömör `500`-on **csak fehér szöveg** állhat.

### Jelentés-kiosztás
- **kék** = folyamat, semleges adat, vezető elem
- **zöld** = pozitív végállapot, kész, elfogadva
- **piros** = negatív, hiba, elvesztett idő, **és a kiugró badge**
- **amber** = figyelem, „vigyázz", harmadik sáv ha kell
- **rózsaszín** `#d4537e` = kedvelt, emberi (Skitch ♥)
- **narancs TILOS** (Zoltán, 2026-07-30 és 08-16). Az amber `#e8a33d` nem narancs.

### Színvakság — kötelező
Zoltán színvak, és a nézők ~8%-a vörös-zöld tévesztő. **Mérve 2026-08-17:**
deuteranópia-szimulációban a piros ✗ és a zöld ✓ **azonos szürke-olajzöld körré
válik.** Ezért:

1. **Jelentést legalább két csatorna hordoz:** szín + forma + pozíció + szó.
2. **Világosság-különbség kötelező:** a negatív tömör `500`-as kitöltés fehér
   glyph-fel, a pozitív `100`-as háttér `700`-as glyph-fel. Így szürkeárnyalatban
   is elválik.
3. Claude minden renderre lefuttatja a deuteranópia-szimulációt. **Zoltán nem
   ítél színt.**

### Kontraszt-célok
Szöveg ≥ **4,5:1**, nagy szöveg (≥50 px) és grafikus elem ≥ **3:1**.
A `check` ezt automatikusan méri — 0 hiba a feltétel, warning maximum a
tranziens (blur alatti) állapotokra fogadható el.

---

## 5. ALAKZAT ÉS LEKEREKÍTÉS

| Token | px | Mire |
|---|---|---|
| `--r-chip` | **8** | apró chip, badge-sarok |
| `--r-btn` | **16** | gomb, beviteli mező |
| `--r-card` | **24** | kártya, panel |
| `--r-panel` | **32** | nagy panel, eszközkeret |
| `--r-pill` | **999** | pill, badge |
| `--r-circle` | **50%** | ikon, jelölő, avatar |

**Szabály:** egy kompozícióban **legfeljebb három** különböző lekerekítés.
A pill és a kör keveredhet, a 8/16/24/32 közül maximum kettő.

**Ikonok, jelölők, avatar: mindig KÖR** (Zoltán, 2026-08-17). Lekerekített
négyzet ikonra nem használható.

---

## 6. ÁRNYÉK ÉS MAGASSÁG — egy fényforrás

A fény **felülről, kicsit balról**. Minden árnyék lefelé és kicsit jobbra esik.
Kétrétegű árnyék: egy szoros kontakt-réteg + egy lágy szórt réteg.

| Token | Érték | Mire |
|---|---|---|
| `--e-1` | `0 2px 4px rgba(17,29,46,.06), 0 8px 16px -6px rgba(17,29,46,.10)` | chip, badge |
| `--e-2` | `0 4px 8px rgba(17,29,46,.06), 0 24px 48px -18px rgba(17,29,46,.18)` | kártya |
| `--e-3` | `0 8px 16px rgba(17,29,46,.08), 0 40px 80px -28px rgba(17,29,46,.24)` | panel, modal |

**Tilos:** színes árnyék (kivéve a CTA gomb zöld ragyogása), belső árnyék,
több fényforrás, `blur` filter a háttéren (**mérve: 2× lassabb render**).

---

## 7. GRADIENS — csak háttérben, sosem típuson

- **Engedélyezett:** a ground ambient gradiense (radiális, 3 stop, nagyon alacsony
  kontraszt), és a `uln` szabály kék→zöld átmenete.
- **Tilos:** gradiens szövegen (a per-betű animáció szétvágja a spanokat és
  elrontja), gradiens kártyán, mesh, noise textúra, 3-nál több stop.
- A ground gradiens **soha nem vonja el a figyelmet**: a legvilágosabb és a
  legsötétebb pontja között legfeljebb 6% világosság-különbség.

---

## 8. VONALVASTAGSÁG — szintén skála

| Token | px | Mire |
|---|---|---|
| `--w-hair` | **1** | elválasztó vonal kártyán |
| `--w-thin` | **2** | mező-keret |
| `--w-mid` | **5** | gyűrű, körvonal, progress ring |
| `--w-bold` | **9** | rail sáv, diagram-vonal |
| `--w-heavy` | **11** | nyíl-vonal, hangsúlyos szár |

Egy kompozícióban **legfeljebb három** vastagság. A 6/7/8/10/12 keverése tilos.

---

## 9. MOZGÁS — időtartam, easing, koreográfia

**Időtartamok:** `0,3 · 0,5 · 0,8 · 1,3 · 2,1` s. Semmi közte.

**Easing — négy, és nem több:**
| Mire | Easing |
|---|---|
| belépés | `power3.out` |
| kilépés | `power2.in` |
| oda-vissza, ambient | `sine.inOut` |
| megérkezés hangsúllyal | `back.out(1.7)` |

`power4`, `elastic`, `bounce`, `expo` **tilos** — hisztérikus és nem a mi hangunk.

**Koreográfia:**
- **Egyszerre legfeljebb két elem mozog.** Három már káosz.
- **Stagger egység: 0,12 s** (sorok, kártyák). Ennél sűrűbb villog.
- **Belépés → tartás → kilépés.** A tartás legalább a jelenet 50%-a; ha nincs
  tartás, a néző nem tud olvasni.
- Pulzálás **±2%**, 1,1 s ciklus, **csak a jelenet végén**, csak azon, ami kész.
- **Két sebesség:** ≥4 mp jelenet kap 3 fázisú mintát, <4 mp csak fade + rise.

---

## 10. KIEMELÉS SZÖVEGBEN — a highlighter

Zoltán kérése: *„legyen tényleg olyan mint a szöveg-kijelölő papíron, sárga,
kézírás szerű."*

**Döntés (Claude, indokolva): SÁRGA, kézzel húzott formával.**
- Szín: `#ffd94a` **60% átlátszósággal**, szorzó keveréssel (`multiply`), hogy
  a betű átlátszódjon rajta, mint valódi filctollnál.
- **Nem téglalap:** SVG path, enyhén egyenetlen felső-alsó éllel, kissé ferde,
  a végei lekerekítettek — mintha egy húzással készült volna.
- Balról jobbra húzódik be, `0,8 s`, `power2.out`.
- **Miért sárga és nem pink vagy zöld:** a sárga a világ összes kijelölőtolljának
  alapszíne, azonnal felismerhető gesztus. Színvakság-szempontból is a
  legbiztonságosabb: a sárga világossága messze eltér a törzsszövegtől, tehát
  szürkeárnyalatban is látszik — a pink és a zöld nem válik el ilyen tisztán.
- A pink és az élénkzöld **másodlagos** változatként megvan (`--hl-pink`,
  `--hl-green`), de az alap a sárga.

---

## 11. SŰRŰSÉG — egy gondolat egy képen

- Egy jeleneten **egy fő gondolat**, egy objektum, egy hangsúly.
- **Legfeljebb három betűméret** és **legfeljebb két szín-jelentés** egy képen.
- Kicker + objektum + legfeljebb egy caption. Négy szint már zsúfolt.
- **Egy annotáció** (nagyító, jelölő, callout) egy képen.

---

## 12. TELJESÍTMÉNY — ez is design-döntés

- `filter:blur` a kompozícióban **tilos** — mérve 2× lassabb render.
- Sok DOM-elem lassít: a form + kontakt-kártya jelenetek miatt a v1.2 render
  2,6× lett az 1,8× helyett. **Költségvetés: 1 mp videó ≤ 2 mp gépidő.**
- Google Fonts `<link>` / `@import` **tilos** — lefagyasztja a `check`-et.
- Minden render új, időbélyeges fájlnévre.

---

## 13. ANTI-PATTERNEK — amit soha

Narancs · sötét háttér · gradiens szövegen · színes vagy több irányú árnyék ·
`filter:blur` · negatív absztolút pozicionálás egymásra rakott címkékhez ·
betű mint ikon (`C`, `$`) · négyzetes ikon · négynél több betűméret egy képen ·
`elastic`/`bounce` easing · három egyidejű mozgás · jelentés csak színen ·
kitalált szám vagy százalék · sarok-keret · özvegy sor · `px` letter-spacing.


---

# MÁSODIK RÉTEG — amit egy profi alapozás még tartalmaz

Hozzáadva 2026-08-18. Az első réteg a látható dolgokat rendezte (méret, szín,
forma). Ez a réteg azokat, amiket a néző **nem vesz észre, ha jól van — csak azt
érzi, hogy profi.**

---

## 14. OPTIKAI KORREKCIÓK — a matematika hazudik

A szem nem mérőszalag. Ahol a számok egyenlők, ott gyakran optikailag nem az.

**Optikai közép.** A szem a képközepet a matematikai közép fölött érzékeli.
Minden centrált kompozíció **4–5%-kal feljebb** ül. Ez az a „valami nem stimmel,
de nem tudom mi" érzés, ami profi anyagoknál sosem jelentkezik.
→ kódban: `.cam{padding-bottom:230px}`

**Optikai túlnyúlás (overshoot).** Egy kör optikailag kisebbnek látszik, mint egy
vele azonos magasságú négyzet. Ezért a **kör alakú ikon 2–4%-kal nagyobb**, mint
a mellette álló szögletes elem. Ugyanígy: a hegyes formák (háromszög, pipa)
kilógnak a rácsból, különben aprónak tűnnek.

**Optikai margó-igazítás.** Az idézőjel, a kötőjel és a pont optikailag beljebb
tolja a sort. Ha egy idézet nagy betűvel indul, a nyitó idézőjel **kilóg a
margón kívülre** — különben a szövegblokk bal éle töröttnek látszik.

**Ikon optikai súlya.** Két ikon akkor egyenlő, ha a **tintamennyiségük**
egyenlő, nem ha a befoglaló dobozuk. Egy tömör kör „nehezebb", mint egy vonalas
négyzet — a vonalasat nagyobbra kell venni.

---

## 15. SZÁMOK — külön szakma

**Tabuláris számjegyek** minden változó számnál (számláló, idő, ár, statisztika).
Arányos számjegyeknél a `1` keskenyebb, mint a `8`, ezért a szám **ugrál**
számolás közben. → kódban: `font-variant-numeric:tabular-nums`

**Formátum:**
- Ezres elválasztó: **vékony szóköz**, nem vessző és nem pont (`12 400`).
  Így nem ütközik a tizedesjellel egyik nyelven sem.
- Mértékegység **mindig ott van** és szóközzel: `54 s`, `30 mp`, `+282 %`.
- **Kerekítés:** a képre soha nem kerül két tizedesnél több. Százaléknál egész.
- **Nagyságrend:** 10 000 fölött `12,4k`, egymillió fölött `1,2M`.

**Igazság:** minden szám mért adat. Százalék csak akkor, ha a két alapszám is
látszik vagy elhangzik. `12,4k → 47,4k` az **+282%**, nem +312%.

---

## 16. OLVASÁSI IDŐ — a legtöbbet vétett hiba videóban

**Képlet: 0,5 mp + szavanként 0,4 mp.** Egy hatszavas felirat minimum **2,9 mp**.

**A be- és kiúszás NEM számít bele.** Ha egy jelenet 3 mp és a szöveg 0,5-nél jön
és 0,3-nál megy, akkor 2,2 mp a valós olvasási idő — az öt szónál már kevés.

**A kép nem lehet gyorsabb, mint a hang.** Ha a narráció még a mondat elején jár,
a következő vizuál nem érkezhet meg. A jelenet-tábla ezért a mondathatárokra ül.

---

## 17. LOKALIZÁCIÓ — 25 nyelv, ugyanaz a kompozíció

- **+30% hossztűrés** minden szövegdobozban. A német, finn, magyar hosszabb az
  angolnál; a kínai rövidebb, de magasabb sortávot kér.
- **Szöveg soha nem képbe égetve** — mindig élő szöveg, hogy fordítható legyen.
- **Nincs szójáték a kulcsüzenetben**, mert fordíthatatlan.
- **Szám- és dátumformátum** lokalizálódik: `1,234.5` vs `1 234,5`.
- **Az ikon nem nyelvfüggő** — ezért ér többet, mint a felirat.

---

## 18. RÁCS ÉS IGAZÍTÁS

- **12 oszlopos rács** az 1640 px tartalom-boxon, **32 px köz**.
  Oszlop = 105 px. Minden objektum oszlophatárra ül.
- **Egy optikai tengely jelenetenként.** Ha a cím centrált, a kártya is centrált.
  Kevert igazítás (cím középen, lista balra) csak akkor, ha a kártya maga egy
  önálló doboz saját belső tengellyel.
- **Az azonos szerepű elemek azonos helyen kezdődnek** egymást követő
  jeleneteken. Ha a kicker mindig ugyanott van, a szem nem ugrál vágás közben.

---

## 19. TÖMÖRÍTÉS-BIZTOS SZÍN ÉS VONAL — YouTube-specifikus

A YouTube h.264/VP9 kódolása **a vörös csatornát bántja a legjobban**, és az
egy pixeles vonalakat szétmossa.

- **Vonal minimum 3 px** 1080p-n. Az 1–2 px-es hajszálvonal csak fehér kártyán,
  elválasztóként megengedett, hangsúlyként soha.
- **Telített tiszta vörös nagy felületen tilos** — sávosodik. A `--red-500`
  (`#e24b4a`) enyhén tompított, épp ezért.
- **Finom gradiens nagy felületen sávosodhat** — ezért maradt a ground
  gradiens 6% alatti kontraszttal, és ezért nincs gradiens kártyán.
- **Zaj és textúra tilos** — a tömörítő minden bitjét ráönti, és elveszi a
  szövegtől.

---

## 20. MOBIL OLVASHATÓSÁG — a nézők többsége telefonon van

Egy 1920 px széles kompozíció telefonon kb. 400 px. Az osztó **4,8×**.

| Képen (1920) | Telefonon | Olvasható? |
|---|---|---|
| 32 px | 6,7 px | **nem** — csak dekoráció lehet |
| 40 px | 8,3 px | épphogy, csak rövid címke |
| 50 px | 10,4 px | igen, de nem hosszú mondat |
| 62 px+ | 13 px+ | igen |

**Szabály: a kulcsüzenet soha nem kisebb 62 px-nél.** A 32 és 40 px csak
mikro-címke és kontextus lehet — ha a nézőnek el KELL olvasnia, akkor ≥50 px.

**Hüvelykujj-teszt:** ha a kontakt lapot lekicsinyíted 400 px szélesre és a fő
üzenet nem olvasható, a jelenet megbukott.

---

## 21. MOZGÁS-BIZTONSÁG

- **Semmi villogás 3 Hz fölött** — fényérzékeny epilepszia kockázat.
  A pulzálásunk 1,1 mp ciklus = 0,9 Hz, biztonságos.
- **Nagy felületű gyors parallax tilos** — mozgásbetegséget okoz kis kijelzőn.
- **A kamera-drift maximum ±3%** a jelenet teljes hossza alatt. Gyorsabb
  zoomolás fárasztó.

---

## 22. RÉTEGSORREND

1. ground (gradiens + rács) → 2. objektum (kártya, sáv, diagram) →
3. annotáció (nagyító, jelölő, callout) → 4. szöveg-overlay →
5. avatar (composite, a renderen kívül)

**Annotáció fedheti az objektumot** — ez a dolga. **Szöveg soha nem fedhet
szöveget.** Az avatar semmit nem fedhet, ami információt hordoz — ezért marad
üresen a jobb alsó sáv.

---

## 23. AZ ÜRES TÉR MINT KOMPONENS

Az üres tér **tervezett, nem maradék**. Három szabály:

- **A margó nem alku tárgya.** 140 px minden oldalon, akkor is, ha „elférne".
- **Az objektum körüli levegő arányos az objektum súlyával.** Egy nagy kártya
  körül több kell, mint egy pill körül.
- **Egy jelenetnek joga van üresnek lenni.** Ha a mondat rövid, a kép legyen
  csendes. A töltelék-elem rosszabb, mint az üresség.

---

## 24. RITMUS A JELENETEK KÖZÖTT

- Átlagos jelenethossz **3,5–5 mp**. Ez a V9-ben mért, bevált sűrűség.
- **Ne legyen metronóm:** ha öt jelenet egyforma hosszú, a néző elalszik.
  Váltogass rövid (1,5–2,5) és hosszú (6–9) jeleneteket.
- **Szakaszzáró jelenet lassabb** — ott van a bezáruló gyűrű, és ott kap
  levegőt a néző.
- **Kemény vágás alapból.** Az áttűnés lágyítja az üzenetet; csak szakaszhatáron.

---

## 25. HANGKÉSZLET A MOZGÁSHOZ — spec, gyártás külön lépés

A mozgásnak hangja van, különben a videó „néma rajzfilm". Hat minta elég:

| Mozdulat | Hang | Hossz |
|---|---|---|
| elem megérkezik (pop) | lágy, tompa koppanás, magas felharmonikus nélkül | 120 ms |
| vonal rajzolódik | halk, folyamatos súrlódás, felfelé csúszó | a vonal hossza |
| számláló fut | nagyon halk tick, 8 Hz, a végén elhal | a felfutás |
| gyűrű bezárul (védjegy) | rövid, tiszta csengés, egy hang | 400 ms |
| szakaszváltás | mély, halk lökés (whoosh nélkül) | 250 ms |
| CTA megjelenik | felfelé lépő kis kvint | 300 ms |

**Szint: −24 LU a narráció alatt**, tehát épp csak érezhető. Ha a hang
észrevehető, túl hangos. A zene és a hangeffekt együtt sem viszi el a
narráció elől a helyet.

**Gyártás:** külön lépés, hangfájlokkal. Amíg nincs, a videó némán is teljes.

---

## 26. VERZIÓZÁS ÉS NÉVADÁS

- **Könyvtár-verzió** akkor lép, ha a mozgás vagy a design változik:
  `zg-frames v1.5`. A samplert ilyenkor újrarendereljük, és az lesz az új baseline.
- **Videó-fájl:** `<projekt>_<verzió>_<YYYY-MM-DD_HHmm>.mp4`. Mindig új név,
  soha felülírás — különben a lejátszó a régit szolgálja ki.
- **A jóváhagyás mindig verzióra szól**, nem videóra: „`zg-frames v1.5` mozgás
  jóváhagyva."


---

# v2.1 — a HF-v6 körből született szabályok (2026-08-18)

## A BIZTONSÁGI SÁV — a tartalmat soha nem nyomjuk össze

```css
.cam > * { flex: 0 0 auto; }
```

Egy oszlop-flexboxban a gyerekek alapból zsugorodnak. Ez a legalattomosabb
elrendezési hiba, ami létezik: a doboz nem tűnik el, csak **kisebb lesz**, és a saját
`overflow:hidden`-je levágja az utolsó sort. A kontakt lapon úgy néz ki, mint egy
tervezési döntés.

**A szabály:** ha a tartalom nem fér be, az nem CSS-hiba, hanem **jelenet-tábla-hiba**.
A javítás nem a betűméret csökkentése, hanem kevesebb tartalom a jelenetre.

Két sűrűség van, nem több:

| osztály | gap | alsó tartalék | mire |
|---|---|---|---|
| `.cam` | 56px | 210px | normál jelenet |
| `.cam.dense` | 40px | 170px | egy nagy panel/kártya viszi a jelenetet |

## IKON, NEM BETŰ — most már a jelekre is

Eddig a szabály az ikonokra szólt. Mostantól **minden jelentést hordozó jelre**:
pipa, kereszt, kérdőjel, felkiáltójel, szív. Ezek is rajzolt path-ok a 24-es rácson,
a készlet vonalvastagságával (`icons.js` → `G`).

**Miért:** a font karakternek saját alapvonala, saját optikai súlya és saját metrikája
van. Soha nem ül középen a korongban, és soha nem egyezik a mellette lévő ikon
vonalvastagságával. Ez a különbség az, amit „szarnak" látunk, akkor is, ha nem tudjuk
megnevezni.

**Marker-anatómia:** tömör korong · fehér gyűrű (6px) · rajzolt fehér glyph (56%) ·
lágy árnyék. **Fül nincs.** Minden fül, amit rajzoltunk, renderelési hibának olvasódott.

## MÉRJ, NE FELTÉTELEZZ — a `pathLength` esete

`pathLength="1"` `<path>`-en működik, `<circle>`-ön nem megbízható. Ha figyelmen kívül
marad, a `stroke-dasharray:1` egy pixelt jelent, és az egész animáció csendben elhal.

**Az általános tanulság:** ahol egy vizuális hatás egy böngésző-funkción múlik, amit
nem mértünk meg ezen a gépen, ott **mérjünk geometriát**, ne feltételezzünk szabványt.
A `getTotalLength()` egy hívás. Egy elhalt animáció egy videó.

## KONTRASZT-PADLÓ — a `-500` fokozat nem hordoz fehér szöveget

Mért érték: fehér a `--green-500`-on = **2,95:1**, a 3:1-es padló alatt.
Fehér szöveg csak `-700` vagy sötétebb fokozaton áll. A `-500` fokozat vonalaknak,
gyűrűknek, kitöltéseknek való — szövegháttérnek nem.

## AMIT A GÉP ELLENŐRIZ, AZT NE ELLENŐRIZZE EMBER

Ebben a körben a `check` és a kontakt lap fogott meg négy hibát, mielőtt Zoltán
egyetlen kockát látott volna: három tördelést és egy kontrasztot. Ez a 7. lépés
teljes indoklása.

**Zoltán soha nem regressziós teszt. Zoltán soha nem kontrasztmérő.**


---

# v3.0 — A TELJES ALAPOZÁS (2026-08-18)

Ez a réteg nem javítás. Ez az, ami eddig hiányzott. Minden szabály mellett ott
van, miért. Ha nem tudod megmondani miért, az nem szabály, hanem ízlés.

## A LEGFONTOSABB TERVEZÉSI TÉNY

**A rendszer tulajdonosa színvak.** Ez nem akadálymentesítési jóindulat, hanem
tervezési kiindulópont. Amit Zoltán lát, az a VILÁGOSSÁG, nem az árnyalat.

Ezért minden szemantikus pár HÁROM dologban különbözik egyszerre:

| | pozitív | negatív |
|---|---|---|
| világosság | világos mező | sötét mező |
| alak | pipa | kereszt |
| szó | approved | wrong |

Bármelyik kettő elvesztésével az üzenet még átmegy. Mérve: zöld-500 L=0,680,
piros-500 L=0,560, különbség 0,12, pont a padlón.

Ez az egész paletta felépítésének oka. A zöldet SZÁNDÉKOSAN világosabbra
vittem, mint a pirosat. Ennek ára van: fehér szöveg már nem áll meg a zöld-500
fokozaton, mérve 2,71:1. A -700 fokozat megoldja. **Ez nem kompromisszum,
hanem a csere ára, és megéri.**

## SZÍN

**Érzékelési színtér.** A rampák OKLCH-ban lettek újrakeverve. A hex a képernyő
nyelve, nem a szemé. Az OKLCH L tengelye érzékelési világosság, tehát ha
egyenletesen lépkedek rajta, a szem is egyenletesnek látja. A hex értékek
maradnak fallbacknek egy `@supports` blokkban: soha nem cserélünk le működő
értéket olyanra, amit nem mértünk ezen a gépen.

**Semleges hőmérséklet-egység.** Minden semleges ugyanazt az enyhén hideg
árnyalatot kapja, hue 256, ugyanaz, mint a vezető kéké. Egy meleg szürke egy
hideg mellett piszkosnak látszik. Ez az egyik leggyakoribb ok, amiért egy design
amatőrnek tűnik anélkül, hogy meg tudnád mondani, miért.

**Egyidejű kontraszt.** Ugyanaz a zöld más színűnek látszik fehér lapon és kék
kártyán. A szem mindig a környezethez viszonyít. A szövegszínt a HÁTTÉRHEZ
hangoljuk: fehéren a -700, színes tinten a -900.

**60 / 30 / 10.** Nagyjából 60% semleges, 30% vezető szín, 10% akcentus. Ha az
akcentus 30% lesz, elveszti az erejét. A zöld nálunk akcentus.

**Fehér szöveg soha nem ül az -500 fokozaton.** Az -500 vonalaknak, gyűrűknek,
kitöltéseknek való, szövegháttérnek nem.

## TIPOGRÁFIA

**Kiegyensúlyozott sortörés.** Ha egy cím két sorra tör, a két sor közel
egyforma hosszú. A 90/10-es törés a legárulkodóbb amatőr jel, és `text-wrap:
balance` egy sorral ingyen megszünteti. Videón SOHA nincs sorkizárás és SOHA
nincs elválasztás.

**Vastagság-fegyelem.** Képenként legfeljebb KETTŐ. Eddig három volt: 600, 700,
800. A hierarchiát előbb mérettel és színnel oldjuk meg, csak utána
vastagsággal. A 700 megszűnt. Ál-félkövér tilos, `font-synthesis-weight:none`.

**Írásjel-kultúra.** Ezt a `type.js` végzi el a build ELŐTT, minden feliraton,
felejtés nélkül: törhetetlen szóköz a szám és a mértékegység közé, valódi
hármaspont karakter, tipográfiai idézőjel nyelv szerint, szorzójel a betű x
helyett. Kódot és parancsot soha nem érint, mert ott a gépíró idézőjel a HELYES.

**Amit szándékosan NEM tesz:** nem tesz be gondolatjelet. Zoltán szabálya
szerint a gondolatjel a legárulkodóbb AI-jel, és ez a képre írt szövegre is áll.
Ahol gondolatjel kellene, ott KÜLÖN JELENET kell.

**Optikai igazítás.** Lógó írásjel az idézeteknél, különben lyuk keletkezik a
sor elején. Ikon és szöveg párosításánál a NAGYBETŰ-MAGASSÁGHOZ igazítunk, nem
a befoglaló dobozhoz. A kerek betűk túllógása az alapvonalon szándékos.

**Táblázatos számjegyek.** Minden számlálón, diagramfeliraton, időbélyegen.
Enélkül ugrálnak a számjegyek felfutás közben, mert a 4 keskenyebb, mint a 0.

## ELRENDEZÉS

**Valódi 12 oszlopos rács.** Vászon 1920, margó 140, tartalom 1640, 12 oszlop,
24 pixel köz, oszlop 114,67. A szélességek innentől oszlopokból számolnak, nem
szemre lőtt pixelekből. Ettől fog két teljesen különböző jelenet egy családnak
látszani, anélkül hogy a néző tudná, miért.

**Optikai közép.** A tartalom a matematikai közép fölött 4-5%-kal ül jól.

**Optikai méretkiegyenlítés.** Egy 100 pixeles kör kisebbnek látszik, mint egy
100 pixeles négyzet, mert kevesebb festéket tesz a papírra. A kört 4%-kal
nagyobbra kell rajzolni. A mi ikonjaink mind körök.

**A biztonsági sáv.** A tartalmat soha nem nyomjuk össze, hogy beférjen.
Ha nem fér be, a jelenet-tábla a hibás, nem a CSS.

**Az avatar sávja.** A bal alsó sarok FOGLALT TERÜLET. Oda egyetlen elem sem
kerülhet. A védjegy-gyűrű ezért a jobb alsó sarokba megy.

## RENDSZERSZINT

**Olvasási idő minimuma.** 0,5 mp elkapni, plusz 0,4 mp szavanként elolvasni.
A `motion.js` ezt MEGMÉRI minden feliraton, és a `hyperframes check`
figyelmeztetésként dobja ki. Egy szabály, amit nem mér senki, nem szabály.

Az első futásnál ez 28 valódi hibát talált a saját samplerünkben. Nem elmélet.

**Hossz-tűrés.** Angol és magyar kiadás megy ki, a magyar szöveg 25-30%-kal
hosszabb. Minden szövegdoboznak ki kell bírnia +30%-ot törés nélkül. Ez is
mérve van. Tulajdonnevet nem mérünk: az "Alex Rivers" magyarul is "Alex Rivers".

**Villogás-korlát.** Másodpercenként legfeljebb három villanás, fényérzékeny
epilepszia miatt. A mi pulzálásunk nagyjából 0,9 villanás per másodperc, messze
biztonságos. De a határnak írásban kell lennie, különben egy jövőbeli jelenet
átlépi, és senki nem veszi észre.

**Első kocka egyenlő thumbnail-jelölt.** A t=0 kockát úgy tervezzük, hogy
önmagában megálljon.

## MÉRJ, NE FELTÉTELEZZ

Ahol egy vizuális hatás olyan böngésző-funkción múlik, amit nem mértünk meg
ezen a gépen, ott mérjünk geometriát, ne feltételezzünk szabványt. A
`getTotalLength()` egy hívás. Egy elhalt animáció egy videó.
