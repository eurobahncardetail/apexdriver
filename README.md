# Apex Driver

Single-page landing site for Apex Driver, a supercar driving-experience company
in Frederick, MD: self-drive on public-road routes, ride-along with a pro
driver, gift vouchers, private and corporate bookings.

Built on **Apex Driver Brand System v3**. The handoff lives outside the repo at
`../../design_handoff_landing_page/`: read `Apex Driver Brand System v3.md`
first, and use `Apex Driver Brand System v3.dc.html` as the visual source of
truth for spacing, type and colour.

## Stack

Static HTML, CSS and one small script. No build step, no dependencies.

```bash
node .claude/dev-server.js
```

Then open <http://localhost:4173>. Opening `index.html` directly also works.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole page: nav, hero, fleet, experiences, how it works, route, terms, footer |
| `styles.css` | Page styles. Every value references a token |
| `script.js` | Nav current-item rule, per-section reveal, the circuit draw |
| `tokens/*.css` | The brand system's custom properties, copied verbatim from the handoff |
| `assets/mark.svg`, `assets/circuit.svg` | Brand mark and the circuit motif |
| `assets/grain-*.png` | The two stamp tiles clipped to display type at 40px and up |
| `assets/spatter-*.png` | The 500px surface tile, used on the how-it-works band |
| `assets/photos/` | The client's own car photography, WebP with JPEG fallback |
| `tools/build-photos.js` | Regenerates the photo crops with sharp |
| `docs/` | Notes from the earlier grayscale build, kept for history |

`tokens/fonts.css` is an `@import`; the page uses the equivalent `<link>` in
`index.html` so the fonts start loading before the CSS does.

## The system, in the rules that are easiest to break

- **Nothing is rounded, nothing has a shadow.** `--radius` is 0.
- **Four colours, three neutrals.** Paper carries the page. One gradient per
  screen (the hero). One orange stat *or* one orange button per screen, never
  both. Inside the gradient nothing is orange; type and the CTA go paper.
- **One motion curve**, `cubic-bezier(0.2, 0, 0.2, 1)`, deceleration only.
  Hover changes colour or a hairline. Reveals fire per section, never per
  element. The circuit draws once. No parallax.
- **Anton is stamped only at 40px and up** and never on a spatter ground. On
  spatter, anything under 24px sits on a solid paper plate (`.plate`).
- **Ten spacing steps**: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 140.
- **No breakpoints.** Layout is `auto-fit` and `clamp()`. The only `@media`
  rules are `prefers-reduced-motion`.
- **No icons.** State is colour and rules; the one graphic is the circuit.

## Motion

An inline script in `<head>` adds `ad-motion` to `<html>` only when reduced
motion is off and IntersectionObserver exists. Every reveal and the circuit
draw are gated on that class, so without it the page renders finished. With
reduced motion on there is no reveal and no draw.

## Photography

Three photographs exist, the client's own, cropped to 4:3 at 62% down the
frame and served at two widths. EXIF is stripped; the originals carry GPS.

| Slot | Source | Car |
| --- | --- | --- |
| Hero | `IMG_6483.jpeg` | Purple Huracán, head-on, under the gradient |
| Fleet No. 01 | `IMG_6487.jpeg` | Green Huracán, front three-quarter, clean |
| Fleet No. 02 | `IMG_6500.jpeg` | Purple Huracán, front three-quarter, clean |

To regenerate after swapping a source, edit and run `tools/build-photos.js`:

```bash
npm install sharp && node tools/build-photos.js
```

## Placeholders and open questions

Marked in `index.html` with comments at the point of use.

- **Fleet cards 03 to 06** are placeholder makes, specs and striped image
  blocks. The real fleet beyond the two Huracáns is not finalised and no
  photography exists. Each card is labelled "Placeholder model" on the page.
- **Prices** are not shown. None have been agreed for the self-drive /
  ride-along / voucher / corporate structure. The experience cards carry a
  duration stat instead; the 90 and 45 minute figures are placeholders.
- **Route 01** uses the spec's example figures (42 miles, 90 minutes) with a
  Frederick start and finish. Replace with the surveyed route.
- **Before you drive** is draft legal copy, flagged on the page as pending
  client sign-off. Minimum age, licence period, deposit, waiver and weather
  policy all need confirming.
- **Booking** is UI only. The progress line shows an illustrative state; every
  CTA points at the how-it-works section until a mechanism is chosen.
- **Footer links** for terms, waiver and contact point at page anchors.
- **No form or input** exists in the system, so there is no newsletter or
  contact field.
