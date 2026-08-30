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

## Statusz (2026-08-30)

Pilot: `arrow`, `funnel`, `lens`. A `_pilot/` harness mountolja mind a harmat
(a `lens`-t ketszer, egyszer sajat `data-variable-values`-szel), es a
`hyperframes check` zold: 0 error, 0 warning, 31/31 WCAG AA.

Bizonyitott: a mount-kontrakt, a `motion.js` scope-olasa (`ZG.buildIn(root,id)`),
a helyi Open Sans a sub-kompba, a token-hid, es a per-instance valtozok.

Hatra: a maradek 36 archetipus kinyerese, a sampler `index.html` atirasa mount
hosztra, a `regress.ps1` scene-tabla parszere a slot-listara, uj sampler render,
uj baseline (Zoltan mozgas-jovahagyasa, PIPELINE 3. kapu).
