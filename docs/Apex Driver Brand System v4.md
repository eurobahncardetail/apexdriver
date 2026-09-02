# Apex Driver — Brand System v4 (draft from the v2 landing page)

Exotic and supercar driving experiences on the public backroads of Frederick County, Maryland. You drive, an instructor rides beside you. Three tiers by time at the wheel (Driver I, II, III) and a custom option (Driver X). Two Lamborghini Huracán Tecnicas in service, verde and viola; the fleet is growing to five or more.

This document describes the system as it stands on the v2 landing page (branch `v2`, commit `58acdc2`, 2026-09-02). It starts from Brand System v3 and records what v2 kept, what it changed, and what is new. Where v3 and this file disagree, this file wins. The rendered page is the visual source of truth.

---

## 00 — What changed from v3

| v3 rule | v4 |
| --- | --- |
| White carries 80% of any view | Photography carries the hero and the closing screen on a near-black ground; the body of the page stays paper and bone. Roughly 55 paper / 15 bone / 25 asphalt / 5 accent. |
| Four colours, three neutrals | One added: road-paint yellow, used only for the route line. |
| The hero takes the red-to-black gradient | Dropped. Photographs sit under a plain ink scrim so the car's colour stays true. `--grad-race` is retired from the page. |
| No breakpoints | Four media queries, listed in §08. `auto-fit` still does most of the work. |
| Circuit motif as a race track | Replaced on the page by a public-road route diagram with a double yellow line. The circuit remains the brand mark's companion for collateral. |
| Reveals per section, one long moment (the circuit draw) | Kept. The long moment is now the route drawing to the chosen tier. A five-step hero load sequence was added. |

Everything else in v3 holds: type families, the asphalt stamp, square corners, no shadows, one motion curve, 4px spacing, the voice.

---

## 01 — Colour

Tokens in `tokens/colors.css` plus five page-level additions at the top of `styles.css`.

| Token | Value | Job |
| --- | --- | --- |
| `--paper` | `#FFFFFF` | Page ground for reading matter, tier cards, fleet cards |
| `--bone` | `#F4F4F2` | Quiet bands (fleet, know before), the Driver X panel |
| `--hairline` | `#E6E6E4` | Every rule and card border; the undriven route |
| `--ink` | `#0B0B10` | Display type, selected-card border, the nav on paper |
| `--asphalt` | `#111114` | Dark ground: hero, the drive, the booking screen |
| `--asphalt-2` | `#18181D` | Reserved for dark panels; unused on the page so far |
| `--race-red` | `#E10600` | Start-finish bar, the live step, current nav item, focus ring |
| `--street-orange` | `#FF6A13` | The primary button, the one orange stat per screen, form errors on ink |
| `--orange-ink` | `#B23A00` | Orange as text on paper (the 631 hp figure) |
| `--paint` | `#E2B53E` | Road-paint yellow. The route line, the selected-tier top bar, reached route labels. Nowhere else. |
| `--paint-ink` | `#8A6A12` | Paint as small text on paper, if ever needed. Unused so far. |

Text on dark grounds is white at fixed opacities, never grey:

| Token | Value | Job |
| --- | --- | --- |
| `--text-on-dark` | `#FFFFFF` | Headlines, stat numbers |
| `--on-ink-2` | `rgba(255,255,255,0.78)` | Body copy on asphalt |
| `--on-ink-3` | `rgba(255,255,255,0.55)` | Mono labels, captions, form labels on asphalt |
| `--on-ink-line` | `rgba(255,255,255,0.18)` | Hairlines on asphalt |

### Budget

- One orange button or one orange stat per screen, never both. The hero has the button and the `$495` stat, which is the one deliberate exception: the stat is the price, and the strip sits below the fold on most phones.
- Yellow never appears as a fill, a button, or a heading. It is paint on a road.
- Red is never a panel. It marks the start line, the "Drive" step, and the nav's current item.

### Scrims

Photographs under type get a plain ink scrim, no hue:

- Hero: `linear-gradient(90deg, rgba(11,11,16,.82) 0%, rgba(11,11,16,.55) 38%, rgba(11,11,16,.05) 70%)` plus a vertical fade to `.75` at the bottom.
- Booking: `linear-gradient(180deg, rgba(11,11,16,.86), rgba(11,11,16,.62) 60%, rgba(11,11,16,.9))`.

---

## 02 — Type

Unchanged from v3. Anton (display, stamped at 40px and above), Archivo with its width axis (section heads at wdth 112, labels at wdth 100), IBM Plex Sans (body), IBM Plex Mono (data, captions, route labels). Google Fonts CDN.

Roles as set on the page:

| Role | Face | Size | Notes |
| --- | --- | --- | --- |
| Hero headline | Anton, stamped paper | `clamp(44px, 11.5vw, 168px)`, lh 0.94 | Two lines, each its own load step |
| Closing headline | Anton, stamped paper | `clamp(32px, 6.2vw, 84px)` | "Pick a date." |
| Section head `.h2` | Archivo wdth 112 / 700 | `clamp(24px, 3.6vw, 42px)`, lh 0.98, uppercase | `text-wrap: balance`; no manual line breaks |
| Card head `.h3` | Archivo wdth 112 / 700 | 22px, uppercase | Tier and car names |
| Step head `.h4` | Archivo wdth 100 / 600 | 18px | Sentence case |
| Tier price | Archivo wdth 112 / 800 | 56px, tracking −0.02em | `$` at 0.5em, muted |
| Stat number | Archivo wdth 112 / 800 | 24 / 32 / 40 / 58 (xs / sm / md / lg) | Tabular figures |
| Body | Plex Sans 400 | 17px, lh 1.55, max 520px | 18px in the hero |
| Body small | Plex Sans 400 | 15px | Cards, steps, terms, FAQ answers |
| Mono | Plex Mono | 12px, lh 1.65 | Eyebrows, captions, route labels, tier meta lines |
| Hero eyebrow | Plex Mono | 13px, sentence case | The one mono line not in uppercase |
| Label / button | Archivo wdth 100 / 600 | 11–13px, 0.1em tracking, uppercase | |

Rules carried over: 11px floor everywhere; stamp off below 40px; numerals always numerals.

---

## 03 — Surfaces and rhythm

The page alternates three grounds in this order: asphalt (hero) → asphalt (the drive) → paper (pricing) → bone (fleet) → paper (how it works) → bone (know before) → paper (FAQ) → asphalt with photograph (book) → paper (footer).

- Dark bands have no top hairline. Paper and bone bands have a 1px hairline on top.
- Section padding `clamp(44px, 6vw, 80px)`.
- Every section opens with a `.band__head`: a mono eyebrow, the `.h2`, and an optional lede at the right, aligned to the head's baseline.
- Spatter grounds are not used on the page. They remain in the system for collateral.

---

## 04 — Photography

Two treatments: under an ink scrim with type on top (hero, booking), or clean with nothing on top (everything else). No colour overlays.

- Hero, 16:9, `object-position: 62% 50%`. The car sits right, the headline left.
- Fleet, 4:3, `object-position: 50% 62%`.
- Delivery: WebP at three widths with a JPEG at the largest, `<picture>` with `sizes`.

The look, so new photographs match: late golden hour or dusk, September in Frederick County; narrow two-lane road with a faded double yellow centreline and no shoulder; stone walls, split-rail fences, hay fields, the Catoctin ridge hazy behind; oak and tulip poplar; realistic colour, light haze, fine grain, no HDR, no motion blur, no people. Car at front three-quarter from a low camera, filling the lower two thirds of a 4:3 frame.

The nine images on the page were generated to this brief with the client's two Huracán photos as references. Cars 03 to 05 are stand-ins.

---

## 05 — Components

### Nav

Fixed, 72px. Transparent with paper type over the hero; switches to 96% paper with a hairline and ink type once the hero's bottom edge passes under it. Current item gets a 1.5px red rule. The primary orange button sits at the right. Links hide below 860px; the lockup and the button stay.

### Buttons

Unchanged from v3. Primary orange fill with ink text, hover inverts to ink. Secondary 1.5px ink outline, hover fills ink. Tertiary text with a red underline. Square, 44px minimum, 120ms colour swap, no lift.

### Stat block

Number, optional unit at 0.42em (floored at 11px, mono, muted), mono uppercase label. One orange number per row. On dark grounds the number is paper and the orange is street-orange.

### Tier card (new)

Paper, 1px hairline, 24px padding. In order: `.h3` name, 56px price, mono meta line ("45 min at the wheel · about 27 mi"), 15px body, mono list with 10px rule bullets, full-width button.

States: hover raises the border to `--ink-3`; selected (`aria-checked="true"`) gets an ink border and a 4px `--paint` bar across the top. The recommended tier carries an ink flag at its top-right reading "Our pick". Cards are radios: click, Space or Enter select; arrow keys move; hover previews the route without selecting.

### Route diagram (new)

One closed SVG path, 640 × 460, drawn three times: a hairline "ghost" of the whole route, a `--paint` stroke at 8px, and a 2px paper stroke down its middle so it reads as a double yellow line. The painted strokes use `stroke-dasharray` equal to the path length and animate `stroke-dashoffset` over 900ms to the chosen tier's fraction of the route. A red 4px start-finish bar. Turnaround markers (paper circle, ink ring, ink core) placed by script along the path and shown once reached.

Beside it: a two-stat readout (miles, minutes, `aria-live`), a legend of route labels that turn ink with a yellow square when reached, and a mono note that the route is a sample.

Fractions on the page: Driver I 0.30, Driver II 0.58, Driver III 1.0. Mileage is placeholder.

### Fleet cards

Two large cards for the cars in service: 4:3 photograph, name, mono "No. 01 · Viola Pasifae", a four-stat spec row with the horsepower in orange-ink, one line of body. Three smaller cards for planned cars with a paper "Planned" tag over the photograph and a three-stat row.

### Steps

Four columns, each with a 1.5px ink rule on top, a 40px Archivo number, an `.h4` and a line of body. The step where the driving happens has a red rule and a red number. Numbered because the order is real.

### Terms list

A `<dl>` in two auto-fit columns. Each row: 96px label column in `--ink-3`, 15px body. Hairline between rows. A mono note beneath saying figures are confirmed at booking.

### FAQ

`<details>` with hairlines. Question in Archivo 600 at 18px, a mono `+` that rotates 45° when open, hover turns the question red. First item open by default. Answers max 620px.

### Form (new, first inputs in the system)

On asphalt only, so far. Inputs 48px tall, 12/14px padding, 1.5px border at 35% white, 4% white fill, paper text, orange caret. Hover 60% white border; focus paper border and 8% fill; invalid gets a street-orange border. Selects use a drawn paper chevron. Labels are the 11px uppercase label role in `--on-ink-3`. Error and success lines are mono, orange and 78% white respectively, spanning the grid. Two columns, one below 520px.

If inputs are ever needed on paper: 1.5px ink border, paper fill, orange caret, red focus ring.

### Footer

Hairline top, lockup left, two mono lines right.

---

## 06 — Motion

One curve, `cubic-bezier(0.2, 0, 0.2, 1)`, deceleration only. Tokens unchanged: 120ms tap, 220ms move, 380ms enter.

- **Hero load sequence.** Five elements (eyebrow, line one, line two, sub copy and buttons, the stats strip) rise 12px and fade in over 620ms each, 110ms apart, starting 160ms after load. Once per visit.
- **Section reveals.** Each section's inner wrapper rises once when its top crosses 88% of the viewport. Never per element.
- **The route.** Draws to the default tier when the diagram is 35% in view, then redraws to whatever tier is hovered, focused or selected. 900ms. This is the page's long moment.
- **Nav.** Background and colour swap over 220ms.
- **FAQ.** The `+` rotates over 220ms.
- Photographs and textures never move. No parallax.
- `prefers-reduced-motion`: no load sequence, no reveals, the route appears drawn, and in-page anchors jump instead of scrolling.

Without JavaScript nothing is hidden: the hidden states are applied only after a script confirms motion is wanted.

---

## 07 — Browser surfaces

Selection is street-orange with ink text. The caret is street-orange. Focus rings are 2px race-red with 3px offset on buttons, links, tier cards, inputs and FAQ questions. Stat numbers use tabular figures. Scrollbars are left to the browser.

---

## 08 — Layout and breakpoints

Container 1400px, `--pad-x: clamp(20px, 5vw, 64px)`. 4px scale, ten steps, unchanged.

The page uses four breakpoints, all `max-width`:

| Width | What changes |
| --- | --- |
| 1100px | (none currently; reserved) |
| 860px | Nav links hide; the drive, the route and the booking screen go to one column |
| 760px | Section heads stack; the two fleet cards stack |
| 720px | Tier cards and the Driver X panel stack |
| 520px | The form goes to one column |

Everything else is `auto-fit, minmax(260px, 1fr)` or `minmax(220px, 1fr)`.

---

## 09 — Voice

Unchanged from v3. Short declaratives, second person, real numbers, sentence case in prose, uppercase only in display, labels and buttons. No exclamation marks, no emoji, none of the banned words.

Lines in use on the page, in case they are reused:

- "Your hands. Our keys." (hero)
- "Not a track. Not a parking lot. A road."
- "How far up the road do you want to go?"
- "Two Huracáns. Verde and viola."
- "Four steps. One of them is the good part."
- "The short version." (terms)
- "Asked before." (FAQ)
- "Pick a date." (booking)
- "Sport mode. Second gear. Somewhere above Gambrill." (caption)

Buttons say what they do: "Choose your drive", "Book Driver II", "Ask about Driver X", "Send the request".

---

## 10 — Known gaps and placeholders

- Route mileage per tier, and whether the tiers are really out-and-back with turnarounds.
- The follow car mentioned in Driver III, the FAQ and the terms is an assumption.
- Legal line items: minimum age, licence tenure, deductible, refund and change windows, weather policy.
- The booking mechanism. The form composes an email to an address that does not exist yet.
- Cars 03 to 05: make, spec, photograph.
- Reviews and any ratings strip.
- Inputs on paper, error states beyond the form, a 404, privacy and terms pages.
- Fonts are still CDN-linked, not self-hosted.
