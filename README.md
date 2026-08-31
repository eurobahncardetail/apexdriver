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

## Deliberate departures from the handoff

Three changes were made after a design review and approved. Each is commented at
the point of change in the source.

**Pricing card tones run dark-to-light**, so visual prominence climbs with price
and Driver III is the most visible card rather than the least. This is the
reference file's own `tierToneDirection: dark-to-light` option, not an override.
It also settles the handoff's internal conflict on Driver III — the token list
named `#1C1D1F` as a card fill while section 5 said `#141517`, which is the
section background, so any card wearing it had no edge. Fills are now
`#1C1D1F` / `#26272A` / `#3A3C40` for I / II / III, measuring 1.08 / 1.22 / 1.65
against the section.

**Driver X's route line runs off the card edge.** Every other tier's line encodes
its duration (30/45/60 min → 90/140/190 of the 200-unit viewBox). Driver X has no
fixed duration and previously borrowed Driver III's 190, claiming a number it
doesn't have. It now bleeds past the padding and is cut flat by the dashed
border: open-ended, which is what the tier means.

**How It Works runs in chronological order** — 01 redeem, 02 meet, 03 choose,
04 drive. The steps were numbered but out of sequence: "Redeem when ready" sat at
04, describing the booking that happens before anyone meets in Frederick. Copy is
unchanged; only the order moved. The section now ends on the drive.

## Responsive

The handoff flagged that mobile was not designed per-breakpoint. Collapses used:

- **1024px** — pricing tiers 4 → 2 columns
- **900px** — hero and how-it-works stack to 1 column; trust block 3 → 2 columns
- **640px** — fleet, pricing, and trust all drop to 1 column

`THE FLEET` keeps its specified `white-space: nowrap` at every width.
