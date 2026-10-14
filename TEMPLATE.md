# TEMPLATE.md — making the next Taste Index

This folder is the reference Taste Index (after typesafe.ai) and the template for every Taste Index Shipped makes. A Taste Index is a brand guide an agent can follow: measured values, the reasons behind them, the component classes, a motion library, and a gallery that proves the system works on real website blocks at desktop and phone width.

**The contract:** class names, `data-*` hooks, token *role* names and file names stay the same in every index. Only the values and the copy change. That way agents, `modules.js` and the gallery work on any brand without edits.

## Files

| File | Change per brand? | What it is |
|---|---|---|
| `DESIGN.md` | **Rewrite** | Brief, principles with reasons, colour, type, components, motion, voice, Do / Don't. Agents read it first |
| `brand.css` §1–3 | **Rewrite values** | Raw palette, schemes, type presets. Keep every role name (`--bg --fg --fg-soft --accent --accent-fg --link-hover --chip-bg --chip-fg --tile-* --win-*`) |
| `brand.css` §4–5 | **Restyle, don't rename** | Base and component classes (`.ts-tile`, `.ts-window`, `.ts-tag` …). Change radius, borders, chrome and type to the brand's |
| `brand.css` v2 block | Usually keep | Motion presets, the FX library, index menu, Hairline theming, module components |
| `brand.js` | Keep | Behaviour. Add a hook only when the brand has a behaviour the library lacks |
| `tokens.json` | Regenerate | Machine-readable tokens for Framer styles and code (see the script note below) |
| `modules.js` | Keep structure, rewrite copy | 45 modules. Swap the fictional "Halftone" copy for the brand's voice; keep ids |
| `gallery.js`, `m.html` | Keep | The desktop + phone gallery and the single-module renderer |
| `index.html` | Rewrite content | The live page. Keep the section order: principles, colour, type, shape, components, motion, index, modules, voice, Do / Don't, template, files |
| `refs/`, `_measure/` | Replace | Screenshots and raw measurements of the new site |
| `prompt.md` | Replace | The brief that started it |
| `versions/vNNN/` + `CHANGELOG.md` | Append | Snapshot before every change the owner has seen |

## Steps

1. **Measure. Don't guess.** Pick 4–6 different page types (home, a list, an article, pricing or contact, legal).
   ```sh
   node _measure/extract.cjs <outdir> https://brand.com/ https://brand.com/blog …
   ```
   Or use Shipped's `node pipeline/capture-site.mjs <url> <out>`. Read computed styles at 1440 and 390, and check 810 and 1100 too if the type steps. Record: `@font-face` families, every text style (family / size / weight / line-height / tracking / case), every colour with where it appears, radius, borders, shadows, transitions and keyframes. Hover the nav, buttons and links and record the before and after styles. Open the phone menu.
2. **Tag everything.** M = read from computed styles or tokens. V = seen in a screenshot (images, SVG). I = inferred to fit. X = your addition. If a value can't be measured, say so in DESIGN.md.
3. **Fonts.** If a face is commercial, keep its name first in the stack and add the closest free substitute from Google Fonts. Copy the Google Fonts URL verbatim and check it returns 200. Set `--pixel-k` or a scale factor if the substitute draws at a different size.
4. **Schemes.** The site's own page colours become measured schemes. Extension schemes keep the rules: one bg, one fg, one accent used only for pointer state, chips with knockout text. The page reads contrast live (`[data-contrast]`); fix anything marked ✕ unless the site itself does it (then document that).
5. **Components.** Restyle the classes to the brand. If the brand has no equivalent (e.g. no windows), make `.ts-window` the brand's card and say so in DESIGN.md. Don't delete classes; modules use them.
6. **Motion.** Measure transitions and keyframes. Set the `computed` preset to what the site does. Keep `snappy` and `smooth` as tagged extensions. Never fade content in on scroll: arrivals use binary opacity, and every effect has a static default.
7. **Voice.** Quote real headlines, labels and buttons verbatim. Write the patterns you see beside them. Rewrite the module copy in that voice.
8. **Write DESIGN.md.** Use one-line brief, 5–7 principles with *why*, then colour, type, components, motion, voice, Do / Don't, and "cases this doesn't cover". Write it for an agent that wasn't in the room.
9. **Verify.** See the checklist below.
10. **Hand off.** Push, share the link, and give the owner one line for the project's CLAUDE.md:
    `Before building any UI, read <path>/DESIGN.md and use its brand.css/brand.js; follow [M] rules over [X] extensions.`

## Verification checklist

- [ ] `index.html` and `m.html?id=<every id>` have no console errors at 1440 and 390.
- [ ] `document.documentElement.scrollWidth === innerWidth` at 390, 810 and 1440 (in-component scrollers are fine).
- [ ] The type scale steps match the measurements at each breakpoint (check `getComputedStyle`, not screenshots).
- [ ] Contrast readouts: no ✕ on the brand's own schemes except where the site itself does it.
- [ ] Every scheme × the gallery: step through modules with the scheme switched; nothing goes invisible.
- [ ] `prefers-reduced-motion`: loops stop, content is visible, menus still work.
- [ ] Hairline figures mount (or show "offline" gracefully without network).
- [ ] No real client logos, photos or claims invented. Placeholders are labelled as such.
- [ ] DESIGN.md tags match brand.css tags.

## Adding a module

Append an object to `window.TI_MODULES` in `modules.js`:

```js
{ id: 'kebab-id', group: 'Sections', name: 'Readable name', tag: 'X',
  trend: 'what trend it answers', gesture: 'hover · drag …', fx: 'effects used',
  decision: 'One or two sentences: why this layout fits THIS brand.',
  css: `/* scoped styles, with a @media (max-width:809px) block */`,
  html: `<section class="m">…only brand.css classes and brand.js hooks…</section>` }
```

Groups in use: Menus, Heroes, Blog & content, Sections, Gestures, Product UI, Motion moments. `.m` gives the section standard padding. Use `NAV()`, `WIN(title, body)` and `FIG(name)` inside `modules.js` for the nav, windows and Hairline figures. It shows up in the gallery immediately and at `m.html?id=kebab-id`.

## Framer handoff (Shipped builds in Framer)

`tokens.json` maps directly to Framer styles:

- **Color styles.** Create one folder per scheme you'll use (e.g. `Paper/`, `Pink/`) with `bg`, `fg`, `fg-soft`, `accent`, `accent-fg`, `chip-bg`, `chip-fg`, `win-frame`, `win-panel`. Name them exactly as the roles, so the agent and the designer talk about the same thing.
- **Text styles.** One per entry in `textStyles` (Hero, H2, Link XL, Card title, List title, H3, Lead, Nav tile, Body, H5, Small, Mono, Pixel). Use Framer breakpoints 1200 / 810 / phone with the three sizes listed. Set case to Title Case for the `capitalize` styles. Framer's text transform does the same as the CSS.
- **Motion.** Hover states: tiles use an *instant* variant swap (transition 0). Text links ease colour over 0.5s with `cubic-bezier(.12,.23,.5,1)`. Appear effects: none on the measured preset. With Snappy, use Framer's "Appear" with y 40, opacity jumps (0 duration) and a spring-free ease `cubic-bezier(.23,1,.32,1)`, 180ms.
- **Components to build once:** Tile (default / ink / accent / hover), Window (bar + frame + panel, variants: default / grey / scheme), Tag, Chip, Link XL, Index row (hover fill), FAQ item, Footer bar.
- **Code overrides:** brand.js effects (ticker, decode, glitch, Hairline) can run as Framer code components, or as an embed of the needed function. Copy the function from brand.js and keep its name.

## Where this plugs into Shipped

- Put new indexes at `~/Developer/REMOTO/taste-index-<brand>/`. Client indexes can live in the private `remoto-studio/clients/<client>/taste-index/` instead.
- Shipped's `library/README.md` and the production agents (creative-director, ui-designer, frontend-builder) should read a client's `DESIGN.md` before building. **Proposed, not yet done:** a row in `library/README.md` and a line in `shipped-knowledge` pointing to this template. That needs the owner's OK.
