# DESIGN FOUNDATION — a teljes alapozás

Készült 2026-08-17, Zoltán kérésére: *„az összes design alapozást kérem nézd át
és írd át hogy az profi legyen"*.

Ez a fájl a **miért és mennyit** minden vizuális döntésre. A `SCALE.md` a
számokat adja, ez a rendszert körülöttük. Ütközés esetén ez a kettő együtt nyer.

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
| **kék** — vezető | `#eef4fd` | `#d6e6fb` | `#1a73e8` | `#1257b8` | `#0c3d80` |
| **zöld** — pozitív | `#e9f7ef` | `#cfeedd` | `#22a75a` | `#178047` | `#0e5c33` |
| **piros** — negatív | `#fdeceb` | `#fbd5d3` | `#e24b4a` | `#b83230` | `#8a2320` |
| **amber** — figyelem | `#fdf3e2` | `#fae2bb` | `#e8a33d` | `#b26a00` | `#7d4a00` |
| **navy** — szöveg | `#f2f5f8` | `#e3e9f0` | `#5b6b86` | `#2b3a52` | `#111d2e` |

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
