# Brief (user, 2026-10-14)

Build me a Taste Index for https://typesafe.ai/blog/introducing-system-one-models-and-jev: a brand guide an AI agent can follow, so every new feature I build looks like it came from the same designer.

Go look at the site. Open a few different pages, not just the home page, and read the actual computed styles. Work out:
- Fonts: families, weights, the type scale, tracking and line-height
- Color: every background, text and accent value as hex, and where each is used
- Shape: borders, radius, shadows, spacing and the layout grid
- Components: buttons, links, cards, nav, anything that repeats
- Motion: what moves, how long it takes, and the easing
- Voice: how headlines, labels and buttons are written

Then build four files:
1. DESIGN.md: a one-line brief, 5–7 principles, then color, type, components, motion and a Do / Don't list. Explain why, not just what.
2. brand.css: every value above as a CSS variable, plus classes for the core components.
3. brand.js: the motion and interactive behavior, no dependencies.
4. index.html: one page that uses the CSS and JS to show every swatch, type size and component, live. Inspired by their website but with more variations: big-font horizontal scrolls, a cool animated mobile menu like Shipped/Queued, preselected alternative colour schemes and typography variations, all in the taste index html.

Mark what you measured and what you made up. If a font is commercial, name the closest free substitute. Don't invent rules the site doesn't follow.
