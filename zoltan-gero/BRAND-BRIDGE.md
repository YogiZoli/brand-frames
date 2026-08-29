<!-- ZG-CANON -->
> ## ELOSZOR OLVASD: a kanon
> A videogyartas egyetlen ervenyes leirasa: **`C:\Users\gdp\HyperFrames\_frames\PIPELINE.md`**
> A BRAND kanon: **`C:\Users\gdp\projects\design-system\tokens.css` + `README.md`**
<!-- /ZG-CANON -->

# BRAND-BRIDGE — a brand kanon es a HyperFrames video kozott

Frissitve: 2026-08-29. Zoltan dontese: a `projects/design-system` kanon a friss,
up-to-date igazsag. A HyperFrames (HR) reteg abbol szarmazik, nem forditva.

## A ket forras

| | Hol | Mit ad |
|---|---|---|
| **BRAND kanon** | `C:\Users\gdp\projects\design-system\tokens.css` + `README.md` | paletta, betu, radius, arnyek, szerep-tokenek. Web es video kozos alapja. |
| **HR tukor** | `_frames/zoltan-gero/tokens.css` | a fenti tukre, plusz a video-reteg (1920 vaszon, 140px sav, avatar-zona, 12 oszlop, video-meretu arnyek). |
| **HR hid** | `_frames/zoltan-gero/brand.css` | a `--hf-*` tokenek rakotve a kanonra, registry blokkokhoz. |
| **HR archetipusok** | `_frames/zg-frames/zg.css` | a 39 jelenet-archetipus. A palettat a fenti tokenekbol veszi, hex fallbackkel. |

Ha barmelyik elter a kanontol, **a kanon nyer**, es a HR fajlt kell javitani. Sose forkold csendben.

## Token-lekepezes (kanon to HR)

| HR token (`zg.css`) | Kanon token (`tokens.css`) | Ertek |
|---|---|---|
| `--blue` | `--brand-500` | `#1E7CE8` |
| `--green` | `--accent-500` | `#12A150` (vonal, gyuru, kitoltes) |
| `--cta` | `--primary` / `--accent-600` | `#0E8542` (gomb, feher szoveg ~4.7:1) |
| `--green-dk` | `--accent-700` | `#0C6A36` |
| `--navy` | `--neutral-800` / `--foreground` | `#1E2733` |
| `--muted` | `--neutral-500` | `#6A7688` |
| `--sub` | `--neutral-600` | `#4C5768` |
| `--label` | `--neutral-400` | `#97A3B8` |
| `--bg` | `--neutral-50` / `--background` | `#F6F8FC` |
| `--card` | `--neutral-0` / `--surface` | `#FFFFFF` |
| `--line` | `--neutral-200` / `--border` | `#E0E6F0` |
| `--red` | `--danger` | `#E5484D` |
| `--amber-*` | `--warning` rampa | `#E5A400` alap |
| rampak `--blue/green/red/amber/navy-{50..900}` | a kanon brand/accent/neutral skalak | 1:1 |

## Szandekos eltres a webes kanontol (a video-reteg)

Ezek nincsenek a `projects/design-system/tokens.css`-ben, mert csak videon ertelmesek:

1. **Betu-toltes.** A kanon Google Fonts `<link>`-et ir. Videon az tilos (a HyperFrames
   renderer nem tuzeli a load eventet, a `check`/`render` navigation timeouttal lefagy).
   Helyette: `_frames/zoltan-gero/fonts/` az 5 sulyu Open Sans .ttf, `fonts/fonts.css`
   `@font-face`-szel. A compiler build-idoben woff2-re tomoriti es beagyazza.
   **A betu ugyanaz: Open Sans. Nincs kivetel a betucsaladra.**
2. **Radius.** A kanon 6/10/12/16/24. Videon a kartya nagy (1640px szeles), ezert egy
   lepessel feljebb: `--r-chip 6 . --r-btn 12 . --r-card 16 . --r-panel 24`. Ugyanaz a skala.
3. **Arnyek.** A kanon hue-ja (`rgba(14,32,56,...)`) marad, a geometria video-meretu
   (nagyobb szorodas, hogy 1080p-n is legyen melyseg).
4. **1920 vaszon, 140px biztonsagi sav, 12 oszlopos racs (`--w4..w12`), avatar-zona
   (bal also 420px, FOGLALT).**

## Amit TOROLTUNK (2026-08-29, Zoltan)

- **Szinvaksag-elso OKLCH szemantikai rendszer.** A regi `zg.css` "v1.7 TELJES DESIGN
  ALAPOZAS" blokkja OKLCH rampakat es a "zold szandekosan vilagosabb a pirosnal, mert a
  rendszer tulajdonosa szinvak" logikat vitte. Ez nem kanon. Kikerult a `zg.css`-bol es
  a `DESIGN-FOUNDATION.md`-bol. A szemantikus par (vilagos pozitiv mezo / tomor negativ
  mezo + alak + szo) mint egyszeru gyakorlat marad, ideologia nelkul.
- A `regress.ps1` deuteranopia-szimulacios passza tovabbra is fut, de mar nem "kotelezo
  itelet" reszekent. Kesobb dontheto, hogy marad-e.

## Nyitott, a kovetkezo korre

- `DESIGN.md`, `SCALE.md`, `GLOSSARY.md`, `README.md`, `BLOCKS.md`, `frame-showcase.html`:
  a paletta-emlitesek atvezetese a kanonra.
- Uj sampler render + Zoltan jovahagyas + uj `regress.ps1` baseline. **Csak a teljes
  kor vegen**, ahogy Zoltan kerte.
- VoxFlow: **nem nyulunk hozza** (Mate csatornaja).
