# Apex Driver

Single-page marketing homepage for Apex Driver — gift vouchers redeemable for a
Lamborghini Huracán driving experience on back roads near Frederick, MD.

Built from the design handoff at
`../Apex Driver brief discussion/design_handoff_apex_driver_website/`.

## Stack

Static HTML + CSS. No build step, no dependencies, no JavaScript — the only
interactive behavior in the design (FAQ accordions, anchor scrolling) is native
browser behavior via `<details>`/`<summary>` and `scroll-behavior: smooth`.

## Running it

Open `index.html` directly in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole page — nav, hero, how-it-works, fleet, pricing, trust+FAQ, contact, footer |
| `styles.css` | Design tokens (`:root`) plus per-section styles, in section order |
| `assets/logo.svg` | The chevron/apex logo mark, rebuilt as SVG from the reference's CSS `clip-path` bars |

## Design tokens

All colors, fonts, and layout constants live as custom properties at the top of
`styles.css`. The palette is deliberately grayscale — no accent color anywhere;
color is meant to come only from the car photography.

Fonts load from Google Fonts: Anton (display), Space Grotesk (UI/labels),
IBM Plex Sans (body), IBM Plex Mono (numerals, prices, captions).

## Outstanding

**Assets needed** — currently dashed placeholder blocks marked in the markup:

- Hero photo: Huracán, front 3/4, dark garage or road backdrop (4:3)
- Fleet photos: Huracán 01 and Huracán 02 (4:3)

**Placeholder content** — marked `TODO` in `index.html`:

- Booking destination for the "BOOK A VOUCHER" button and the tier cards
- Real Instagram handle (`@apexdriver` is a placeholder)
- Footer phone, email, and waiver link

**One spec conflict to settle** — the handoff README disagrees with itself on the
Driver III card fill. Its token list says `#1C1D1F`; its section 5 and the visual
reference both say `#141517`. Built with `#141517`, which makes that card sit flush
against the section background. If it should read as a distinct card, change
`--tier-3-bg` in `styles.css` to `var(--asphalt-alt)`.

## Responsive

The handoff flagged that mobile was not designed per-breakpoint. Collapses used:

- **1024px** — pricing tiers 4 → 2 columns
- **900px** — hero and how-it-works stack to 1 column; trust block 3 → 2 columns
- **640px** — fleet, pricing, and trust all drop to 1 column

`THE FLEET` keeps its specified `white-space: nowrap` at every width.
