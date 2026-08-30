<!-- ZG-CANON -->
> ELOSZOR OLVASD: `C:\Users\gdp\HyperFrames\_frames\PIPELINE.md`
> Ket szabaly felulir mindent: (1) mi szoveget irunk, a HyperFrames gyart kockat;
> (2) a kep azt mutatja, amirol a hang beszel. Utkozes: PIPELINE.md > skill > Drive > projekt > chat.
<!-- /ZG-CANON -->

# blocks/ — az archetipusok mint mountolt egysegek

## Miert

A monolit sampler (`../index.html`) bizonyitja, hogy a `zg.css` es a `motion.js`
jo. Azt NEM bizonyitja, hogy az a markup-reszlet, amit valaki egy eles videoba
bemasol, ugyanaz, mint amit teszteltunk: a samplernek sajat masolata van minden
archetipusbol. Ez a mappa megszunteti a masolatot.

Minden archetipus kanoni markupja EGY helyen el: `blocks/<name>/<name>.src.html`.
A `build.ps1` korbe-inlineolja a kozos `zg.css` + `type.js` + `icons.js` +
`motion.js` fajlokat, es kiad egy HyperFrames sub-kompoziciot:
`blocks/<name>/<name>.html`. Ezt mountolja a sampler ES minden eles video a
`data-composition-src`-n keresztul. Ugyanaz a bajt mindenhol.

## A ket fajl archetipusonkent

| fajl | mi | kezzel szerkesztheto |
|---|---|---|
| `<name>.src.html` | a kanoni markup + valtozo-felulet | IGEN, ez a forras |
| `<name>.html` | a generalt, mountolhato sub-komp | NEM, felulirja a build |

A `<name>.src.html` egy `<!--zg { ... } zg-->` fejlecet visz (id, duration,
camClass, variables), utana a markup, pontosan az, ami a samplerben a
`<div class="cam">`-en belul van.

## Valtozok

Minden szoveg-level `data-vars='{"text":"<id>"}'`-t visz, minden attributum-
csere `data-vars='{"<attr>":"<id>"}'`-t (pl. lens `data-path`/`data-words`,
arrow `data-icon`). A hoszt slot ad ertekeket `data-variable-values`-szel;
`ZG.applyVars()` a `--<id>` CSS custom propbol olvas (NEM a `getVariables()`-bol,
az csak a defaultot adja mountkor). A deklaracio a `.src.html` `variables`
tombjeben. Teljes lista: `CATALOG.md`.

**Foglalt valtozonevek** (a HF nem ad rajuk `--css` propot): `sub`, `leftLabel`,
`rightLabel`, `leftIcon`, `rightIcon`. Helyettuk: `subcap`, `lnode`, `rnode`,
`lico`, `rico`.

## A teljes lanc (eles video)

```
sentences.ps1           # SRT -> sentences.json  (PIPELINE 3.)
[Opus irja]             # scenes.json: block + sent-horgony + vars per jelenet  (PIPELINE 4., 3. kapu)
build-video.ps1         # scenes.json -> ../index.html + compositions/<sceneId>.html  (PIPELINE 5.)
stamp-timing.ps1        # data-start/data-duration a sentences.json-bol
check -> snapshot -> render
assemble-sampler.ps1    # ha kell a sampler vissza
```

Minden mountolt instance EGYEDI `data-composition-id`-t kap (`s001-<block>`):
ismetlodo id eseten a per-instance valtozok utkoznek. `build-video.ps1` ezert
scene-enkent egy byte-masolat blokkot ir `compositions/`-ba, csak az id-t cserelve.

A jelenet-hossz: `data-scene-dur` (a szerzoi mozgas-hossz) kulon a
`data-duration`-tol (600 mp-es clip-ablak), igy egy hosszabb jelenet tartja a
vegkocakat, nem villog ki. Anelkul a jelenet a blokk szerzoi hossza utan
elsotetul.

## Blokk-lanc (a konyvtar maga)

```
extract.ps1        # egyszeri: a monolit <section>-jeibol <name>.src.html (mind 39, lefutott)
add-vars.ps1       # szoveg-valtozo-felulet a levelekre (idempotens)
make-fontface.ps1  # _fontface.css (Open Sans base64) — csak ha a fonts/ valtozik
build.ps1          # <name>.src.html + kozos css/js -> <name>.html   (minden valtoztatas utan)
assemble-sampler.ps1  # ../index.html = 39 mount slot
catalog.ps1        # CATALOG.md (Opus ezt olvassa a scenes.json-hoz)
```

Ujra kell futtatni a `build.ps1`-t MINDEN `zg.css` / `motion.js` / `icons.js` /
`type.js` / `.src.html` valtoztatas utan. Tukroz a `_frames/blocks/<name>/`-ba.

## Statusz (2026-08-31)

Mind a 39 archetipus mountolt blokk, szoveg + attributum valtozo-felulettel.
Sampler baseline: `sampler_blocks_2026-08-30_2343.mp4` (Zoltan jovahagyta),
`regress` 39/39. `hyperframes check`: 0/0, 58/58 WCAG AA. Az eles-video lanc
(build-video -> stamp-timing -> check -> snapshot) tesztelve, mukodik.

**Ismert elteres:** a mountolt render kb. 3-4%-kal nagyobb kerettel jon, mint a
regi monolit. Egyenletes, nem regresszio, elfogadott nez. Reszletek: STATUS.md.

Monolit backup: `git show 417ab8e:zg-frames/index.html`.
