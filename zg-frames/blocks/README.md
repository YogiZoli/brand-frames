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

`data-var-text="id"` a leveleleken, es a hoszt slot ad ertekeket:
`data-variable-values='{"kick":"...","caption":"..."}'`. A deklaracio a
`<name>.src.html` `variables` tombjeben. Reszletek: hyperframes-core
`references/variables-and-media.md`.

Meg NEM valtozo: az attributumban elo mozgas-parameterek (a lens `data-path` /
`data-words`, az ikonok `data-icon` neve). Ezek egyelore fixek a forrasban.
Kovetkezo lepes: egy pici init-script, ami a `window.__hyperframes.getVariables()`
ertekekbol tolti oket.

## Hasznalat

```
cd C:/Users/gdp/HyperFrames/_frames/zg-frames/blocks
powershell -NoProfile -ExecutionPolicy Bypass -File build.ps1            # mind
powershell -NoProfile -ExecutionPolicy Bypass -File build.ps1 lens funnel # csak ezek
```

Ujra kell futtatni MINDEN `zg.css` / `motion.js` / `icons.js` / `type.js` /
`<name>.src.html` valtoztatas utan. A build a `_frames/blocks/<name>/`
promoted konyvtarba is tukroz (BLOCKS.md).

## A lanc

```
extract.ps1        # egyszeri: a monolit <section>-jeibol <name>.src.html (mind 39, lefutott)
make-fontface.ps1  # _fontface.css (Open Sans base64) — csak ha a fonts/ valtozik
build.ps1          # <name>.src.html + kozos css/js -> <name>.html   (minden valtoztatas utan)
assemble-sampler.ps1  # ../index.html = 39 mount slot
```

## Statusz (2026-08-30)

Mind a 39 archetipus kinyerve, a sampler `index.html` mount host.
`hyperframes check`: PASSED, 0/0, 58/58 WCAG AA.

**Ismert elteres:** a mountolt render kb. 3-4%-kal nagyobb kerettel jon, mint a
monolit. Egyenletes mind a 39 jeleneten. Vegigprobalva: `#root`/slot CSS
`transform`, `<template>` vs no-template, font, cam-animacio — egyik sem
befolyasolja. A sub-komp kompozitalas sajatja. Egyszeri keret-dontes, nem
regresszio. Reszletek: `_frames/STATUS.md`.

**Meg NEM valtozo:** attributumban elo mozgas-parameterek (lens `data-path` /
`data-words`, ikon `data-icon`). Kovetkezo: init-script a `getVariables()`-bol.

Monolit backup: `git show 417ab8e:zg-frames/index.html`.
