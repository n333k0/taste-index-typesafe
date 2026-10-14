# DESIGN.md — Taste Index after typesafe.ai

**Brief:** a research lab that dresses like a toy computer. Huge tight grotesk headlines, a pixel-terminal voice for machine labels, one flat colour per page, square ink blocks, and motion that ticks instead of floats.

Read this before building any UI. Then use `brand.css` (tokens + component classes) and `brand.js` (behaviour). `index.html` shows every value live. Screenshots of the source site are in `refs/`. Raw measurements and the scripts that took them are in `_measure/`.

### How to read the tags
| Tag | Meaning |
|---|---|
| **[M]** measured | read from `getComputedStyle` or the site's Framer tokens on 2026-10-14 (pages: `/`, `/blog`, `/blog/introducing-system-one-models-and-jev`, `/enterprise`, `/contact`, `/legal/terms`; widths 1440, 1100, 810, 390) |
| **[V]** seen | taken from screenshots because the thing is an image or SVG (dither art, dot fields, the hero cloud) |
| **[I]** inferred | not measurable; chosen to agree with [M] |
| **[X]** extension | not on the site; added so the system can scale. Use it, but know it's ours |

---

## 1. Principles

1. **Two voices, never mixed in one line.** The grotesk (Die Grotesk C) is the human voice: headlines, body, buttons. The pixel font (LisaTerminal) and JetBrains Mono are the machine voice: tags, window titles, readouts, FAQ questions, base64. *Why:* the product is "AI that returns typed values", so the site literally shows people text next to machine text. Before setting a label, ask who is speaking. A person gets the grotesk; the system gets pixel or mono.
2. **Square everything.** Radius is 0 on tiles, buttons, windows, images and cards [M]. The only exceptions are inline code (6px) and tables (8px) [M], both borrowed from document defaults. *Why:* the retro-OS look depends on hard corners. One rounded card reads as a different product.
3. **One page, one colour.** Each page has one background: paper `#fefefe` (home), sage `#abbab9` (blog), pink `#f386a1` (legal, feature panels), ink `#1e1e1e` (contact, enterprise) [M]. A second colour only appears inside a framed full-bleed panel. *Why:* the colour tells you where you are. Contrast comes from ink blocks, not a second hue.
4. **Magenta means "you are here".** `#d45bb6` is only used for pointer state: hovered tiles, hovered links and post titles, the active filter chip, an open dropdown trigger [M]. It also fills the last tile of the phone menu ("Contact Sales") [M]. *Why:* if magenta shows up in decoration it stops working as feedback.
5. **Huge, tight, Title Case.** h1 is 150px at line-height 0.8, so the lines touch [M]. Body copy is 17px at every width [M]. Headings are written in sentence case and `text-transform: capitalize` turns them into Title Case [M]. *Why:* the scale jump between 150 and 17 gives the drama, so nothing in between needs to shout.
6. **The interface is a toy computer.** Content sits in windows with ink title bars and version numbers ("Glider 1.1", "Clock Tool 1.1", "Version 0.01"), next to a live clock, Conway's Game of Life, base64 strings and 1-bit dithered spheres [M/V]. *Why:* it shows the product is software without screenshots. New widgets should look like small programs.
7. **Motion computes, it doesn't perform.** On load the headline is already there [M]. Hovers swap instantly [M]. Loops are linear or stepped: blinking dots (2s), race bars (18.248s linear), a 1s clock [M]. The only eased transition is link colour: 0.5s `cubic-bezier(.12,.23,.5,1)` [M]. *Why:* calm, machine-like motion goes with "fast, typed, no hallucinations".

---

## 2. Colour

All hex values are [M]. In CSS, use the semantic roles (`--bg`, `--fg`, `--accent`, …) so schemes can swap.

| Token | Hex | Where it's used |
|---|---|---|
| `--ts-ink` | `#1e1e1e` | headings, ink tiles ("Contact Us"), window title bars, tags, footer, /contact bg |
| `--ts-ink-86` | `#1e1e1edb` | body text and article h1 on light pages (ink at 86%) |
| `--ts-paper` | `#fefefe` | home bg, nav tiles, text on ink |
| `--ts-white` | `#ffffff` | window panels, buttons on dark pages |
| `--ts-magenta` | `#d45bb6` | hover / active only |
| `--ts-pink` | `#f386a1` | feature panels, /legal bg, pink windows on ink, skip link |
| `--ts-sage` | `#abbab9` | /blog and article bg |
| `--ts-green` | `#03aa5c` | "88% lower cost" readout; at 74% alpha (`#03aa5cbd`) the blog teaser band, which reads `#44c086` over paper |
| `--ts-hot` | `#e551ba` | one-off "Watch our launch video" pill. Don't reuse it, use magenta |
| `--ts-grey-1` | `#dedede` | pixel text on ink tags (paper pages), grey window panels |
| `--ts-grey-2` | `#c4c4c4` | grey window frame |
| `--ts-teal` | `#09aea1` | defined token, not seen in use. Hold in reserve |
| `--ts-grey-3` | `#858585e6` | defined token, not seen in use |
| `--ts-banner` | `#161616` + `#555555` border | cookie banner |
| `--ts-rule` | `rgba(153,153,153,.25)` | table rules; `rgba(153,153,153,.1)` for th fill |
| `--ts-fill` | `rgba(0,0,0,.1)` | inline code bg |
| `--ts-btn-dark` | `rgba(171,186,185,.2)` | option buttons on /contact |

**The knockout rule [M]:** a tag or window title bar is an ink block, and its text uses the *page background colour*. Pink text on pink pages ("Glider 1.1"), sage on sage pages ("Company News"), `#dedede` on paper. In CSS this is `--chip-fg`. A label looks punched out of the page, which is why it never needs a third colour.

**Schemes** (`data-scheme` on `<html>` or any element):
- [M] `paper`, `pink`, `sage`, `night`, `green`: the site's own page colours, mapped to the same roles. Night's inverted chip (paper bg, ink text) is [I].
- [X] `cyanotype`, `amber`, `bone`: new hues on the same roles. Each keeps one bg, one fg, one accent used only for hover, and knockout chips.

## 3. Type

| Role | Site font | Free substitute | Licence |
|---|---|---|---|
| Display 500 | Die Grotesk C Medium | **Inter Tight 500** | commercial [I: self-hosted, foundry not verified] |
| Text 400 (+ faux 700) | Die Grotesk C Regular | **Inter Tight 400/700** | commercial [I] |
| Pixel | LisaTerminal Paper 2X3Y Medium | **VT323**, scaled ×1.18 via `--pixel-k` | commercial [I] |
| Mono labels 300 | JetBrains Mono | same | free (OFL) [M] |
| Inline code | Fragment Mono | same | free (OFL) [M] |

The commercial names come first in each stack, so they'll render if installed. If you own LisaTerminal, set `--pixel-k: 1`.

**Scale [M].** Sizes step at the Framer breakpoints (≥1200, 810–1199, <810). They're stepped, not fluid.

| Class | Desktop / tablet / phone | Line-height | Tracking | Case |
|---|---|---|---|---|
| `.ts-hero` h1 | 150 / 94 / 54 | 0.8 | 0 | capitalize |
| `.ts-h2` | 64 / 41 / 33 | 0.9 | 0 | capitalize |
| `.ts-link-xl` | 64 / 64 / 28 | 0.9 | 0 | capitalize |
| `.ts-h-card` | 48 / 48 / 30 | 0.9 | 0 | capitalize |
| `.ts-h-list` | 30 | 0.9 | +0.02em | capitalize |
| `.ts-h3` | 26 / 26 / 22 | 1.2 | 0 | as typed |
| `.ts-lead` | 22 | 1.2 | +0.05em | as typed |
| `.ts-h4` | 22 | 1.4 | 0 | as typed |
| `.ts-tile` (nav) | 18 | 1 | +0.03em | capitalize |
| `.ts-body` | **17 at every width** | 1.2 | +0.05em | as typed |
| `.ts-h5` | 16 | 1 | −0.02em | as typed |
| `.ts-small` (footer) | 15 | 1.2 | +0.05em | as typed |
| `.ts-mono` / `-s` / `-xs` | 13 / 12 / 10, weight 300 | 1.2 | +0.05em | capitalize (not -xs) |
| `.ts-pixel-xl/-l/(base)/-s` | 36 / 28 / 18 / 14 | 1 | +0.01em | as typed |

*Why the tracking:* display type sits at 0 so the giant words lock together, while small text is opened to +0.05em so it stays airy beneath them. Keep that inversion if you change fonts.

*Capitalize caveat:* CSS capitalize also changes file names and units ("DESIGN.md" becomes "DESIGN.Md"). Wrap those in `.ts-nocap`.

**Type presets [X]** (`data-type`): `measured` (default), `space` (Space Grotesk + Space Mono), `editorial` (Instrument Serif + Silkscreen), `wide` (Archivo 125% + Pixelify Sans), `condensed` (Barlow Condensed 600). Every preset keeps the same roles, sizes and the two-voice split; only the families and display tracking change.

## 4. Shape, space, layout

- **Radius:** 0 [M]. Code 6px, tables 8px [M].
- **Shadow:** none. The one exception is the cookie banner, `0 8px 24px rgba(0,0,0,.533)` [M]. Don't add shadows to new components. Depth comes from 1px drawn outlines and 3px window frames.
- **Borders:** almost none [M]. Outlines on windows are drawn (here as `box-shadow: 0 0 0 1px`) [V→I]. Left rules on articles, FAQs and post lists are 1px, dashed in lists [V].
- **Crop marks:** 10px L-shapes with a 1.2px stroke at the corners of section frames [M]. Class: `.ts-crop`.
- **Dot field:** a fine dot grid behind windows and art [V]. Class: `.ts-dots`. The 6px pitch is [I].
- **Spacing that recurs [M]:** 3, 4, 5, 10, 20, 30, 40, 50, 60, 100, 200. There's no 4/8 grid. The site uses 3px (window frame, menu tile gap), 5px (nav tile gap, phone panel inset), and then jumps in tens.
- **Grid [M]:** a 1240px content frame centred at 1440 (100px margins). On phones the gutter is 10px, and full-bleed panels are inset 5px. The tablet gutter (30px) is [I]. Layouts are mostly centred stacks and 2–3 column text bentos with 50px gaps, not a 12-column grid.
- **Nav [M]:** tiles sit flush on the top edge with no bar behind them. There are three groups: brand on the left, sections centred, CTAs on the right.

## 5. Components

Every class here is in `brand.css` and shown live in `index.html`.

| Component | Class | Spec | Tag |
|---|---|---|---|
| Nav tile | `.ts-tile`, `--ink`, `--accent` | 36px tall, 0 5px padding, 18/18 display 500 +0.03em, capitalize. Hover sets the bg to magenta **instantly** | [M] |
| Nav bar | `.ts-nav`, `__group`, `__center` | fixed, flush to the top, 5px gaps, no background | [M] |
| Dropdown | `.ts-dd` + `[data-dd-toggle]` | tiles stack 5px below the trigger; the chevron flips; instant | [M] |
| Phone menu | `.x-mm[data-mm-mode]` | `tiles` [M]: tiles stack down the right edge, 3px gap, "Menu" becomes "Close", last tile magenta, instant. `iris` [X]: Shipped's circle reveal (.75s `cubic-bezier(.76,0,.24,1)`, links rise with a 60ms stagger). `window` [X]: Shipped's pill-grow, restyled as an OS window | M / X |
| Text link | `.ts-link` | underlined; colour eases to magenta over .5s `cubic-bezier(.12,.23,.5,1)` | [M] |
| Link-heading | `.ts-link-xl` | h2-size words with a 4px bar 5px below (2px on phones [I]); turns magenta on hover. Whether the bar also changes colour is [I] | [M] |
| Tag | `.ts-tag`, `--l` | pixel font on ink, knockout text, padding 3px 4px | [M] |
| Filter chip | `.ts-chip[aria-pressed]` | pixel 16 on ink; active one gets magenta text | [M] |
| Button | `.ts-btn`, `--wide` | small paper button ("Contact Us", "Talk To Sales"); wide 400×60 option buttons on ink | [M] (padding [I]) |
| Window | `.ts-window`, `__bar`, `__body`, `__panel`, `--grey` | 20px ink bar (padding 1 0 1 4, pixel 18, knockout), 3px frame in page colour (or `#c4c4c4`), white panel | [M] structure, [V] outlines |
| Announcement | `.ts-announce` | grey window, centred pixel copy, underlined pixel link, max 364px wide | [M] |
| Readout | `.ts-readout`, `--green` | big pixel value on ink or green ("$0.39", "88%") | [M] |
| Stat | `.ts-stat` | h2-size number + 13px caption | [M] |
| Leader | `.ts-leader` | "Introducing Jev ........ Intelligence beyond chat" | [M] |
| Base64 rail | `.ts-b64`, `.ts-b64-block`, `[data-b64]` | the heading re-encoded in base64, 10px mono, vertical | [M] |
| Post item | `.ts-post` | tag + 30px title + excerpt; the whole item turns magenta on hover | [M] |
| FAQ | `.ts-faq` | mono 13/300 capitalize questions, 1px boxed +/− glyph, dashed left rule | [M] (glyph [I]) |
| Table | `.ts-table` (wrap in `.ts-table-scroll`) | 1px rules, 8px radius, th fill | [M] |
| Footer | `.ts-footer` | ink bar, 15px, links spread across | [M] |
| Cookie banner | `.ts-banner` | the only shadowed element | [M] |
| Panel | `.ts-panel` + `__frame` | full-bleed colour band, 30px 10px padding, framed 1240 | [M] |
| Hero cloud | `.ts-cloud` | stand-in for the site's grainy pastel photo | [V→I] |

## 6. Motion

| What | Duration | Easing | Tag |
|---|---|---|---|
| Link / post-title colour to magenta | 0.5s | `cubic-bezier(.12,.23,.5,1)` (`--ease-ts`) | [M] |
| Nav tile, dropdown, phone menu | 0s | none (hard swap) | [M] |
| Blinking dots in SVG art | 2s, infinite | linear on/off | [M] |
| Speed race bars | 18.248s, infinite | linear | [M] |
| Launch-video pill on load | ~0.5s | scale 0→1, curve not captured | [V] |
| Clock / Game of Life | 1s / 400ms per step | stepped | [M] / [I rate] |
| Marquee of giant type | width ÷ 90–140 px/s | linear, pauses on hover and off-screen | [X] |
| Horizontal scroll | tied to scroll position | linear (no smoothing) | [X] |
| Scramble | 30ms ticks | stepped, left to right | [X] |
| Iris / window phone menu | .6–.75s fold, links .7–.8s rise | `--ease-fold` `cubic-bezier(.76,0,.24,1)`, `--ease-rise` `cubic-bezier(.2,.8,.2,1)` (from Shipped) | [X] |

Rules:
- Nothing fades or slides in on scroll. Content is visible without JS. Every [X] effect in `brand.js` refines a static default: the marquee is a clipped line, the h-scroll is a swipeable row, the spheres are blank canvases.
- New motion should be linear, stepped or instant. If you need easing, use `--ease-ts` for colour and keep `--ease-fold`/`--ease-rise` for big structural moves (menus) only.
- Respect `prefers-reduced-motion`. `brand.css` stops loops and transitions, and `brand.js` skips the marquee, scramble and h-scroll pinning.

## 7. Voice

All quotes are verbatim from the site [M]. The patterns are our read of them [I].

- **Headlines** make a claim, add a number, then a wink. "The First (Public) System One Model; Jev Gives AI The Properties Of Code". "193.6x Faster, 444.6x Cheaper." "Jev's Intelligence Per Dollar Is Literally Off The Charts." "We Give A FAQ". "Let's Talk Business". Use precise decimals and `x` multipliers. Write them in sentence case; CSS adds Title Case.
- **Machine labels** are named like software: "Jev.Confidence", "TS.AI.OS1", "Clock Tool 1.1", "Glider 1.1", "Version 0.01", "[b.64]", "Oct 9, 2026 • TypeSafe News".
- **Buttons** are 2–3 words, verb first: "Contact Us", "Talk To Sales", "Create Account", "Join Discord", "Read the Case Study", "View announcement". Glyphs stand in for icons: "∵ Back", "Watch Launch Video ▶".
- **Body** is first-person plural, plain, and a bit cheeky about evidence. "Extraordinary claims require extraordinary evidence so see below for the receipts. 💅" "We love skeptics, and are skeptics ourselves." "Output tokens: FREE (too cheap to meter)."
- **Emoji:** at most one, at the end of a casual line. Never in headlines or buttons.
- **Proof:** a bold claim is followed by a link to proof ("(Proof)", "Watch the real video").

## 8. Do / Don't

**Do**
- Give each page one background and build contrast with ink blocks, because colour signals where you are.
- Choose the voice before the font: grotesk for people, pixel or mono for the machine.
- Type headings in sentence case and let `capitalize` do the rest. Wrap file names in `.ts-nocap`.
- Keep magenta for pointer state, so it stays meaningful.
- Put new data views, demos and settings in a `.ts-window` with a version-numbered title.
- Frame sections with `.ts-crop` marks and centre the main headline.
- Back every number with a link to its source.
- Keep body at 17px on phones. Scale headings down in steps (150 → 94 → 54).

**Don't**
- Round corners, add drop shadows, or use gradients on controls. The hero cloud is the only gradient, and it's a photo.
- Fade or slide content in on scroll, or ease hover backgrounds. Tiles swap in 0s.
- Use `#e551ba` or teal as a second accent. They're one-offs or unused.
- Put body copy in the pixel font or headlines in mono.
- Invent a new accent per feature. Add a scheme with the same roles instead.
- Put emoji in headlines, buttons or labels.
- Let tables or giant type widen the page on phones. Use `.ts-table-scroll`, `.x-marquee` and `.x-hscroll`, which clip.

## 9. Cases this doesn't cover

Work from the principles in this order:
1. Who is speaking? Pick the voice.
2. Which page colour is this? Use only that scheme's roles.
3. Can it be a tile, a tag or a window? Reuse one before inventing anything.
4. Does it move? Make it instant, linear or stepped, and make sure it reads without JS.
5. Is it square, flat and on the 3/5/10/20/30/50/100 spacing? Then it belongs.
