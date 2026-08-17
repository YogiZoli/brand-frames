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
