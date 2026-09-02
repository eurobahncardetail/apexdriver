# Apex Driver — Brand System v5 (the v3 landing page)

Exotic and supercar driving experiences on the public backroads of Frederick County, Maryland. You drive, an instructor rides beside you. Three drives by time at the wheel (Driver I, II, III) and a custom option (Driver X). Two Lamborghini Huracán Tecnicas in service, verde and viola; three more cars planned.

This document describes the system as it stands on the v3 landing page (branch `v3`, live at https://eurobahncardetail.github.io/apexdriver/, 2026-09-02). It replaces Brand System v4. Where v4 and this file disagree, this file wins. The rendered page is the visual source of truth.

---

## 00 — What changed from v4

v3 is a redesign, not a refinement. The client brought references (Veondora, Ryntal) and asked for that world: a page that lives inside rounded panels, big geometric display type, lush photography with the car as the protagonist, and atmosphere that moves. The v4 token sheet (`tokens/*.css`) is no longer linked by the page; it stays in the repo for collateral until it is retired.

| v4 rule | v5 |
| --- | --- |
| Paper page, asphalt hero, hairline rules, square corners, no shadows | Ink outer frame; one stone-grey page panel; every section is a rounded card nested inside it. No hairline rules between sections; the gap between cards does the work. Still no shadows. |
| Anton stamped display, Archivo heads, Plex Sans body, Plex Mono data | Bricolage Grotesque 800 display and heads, Manrope body, DM Mono data. The stamp texture is gone. |
| Race red, street orange, road-paint yellow | One accent: Verde, the green of car No. 02. Red, orange and yellow are retired from the page. |
| Photographs under a plain ink scrim, no motion | Photographs are the ground of most cards, and four of them move: ambient loops of dust, rain, light and fireflies. The route diagram is gone; the four drives are photographs. |
| Eyebrow label above every section head | No eyebrows. The heading carries the section; the nav names it. |
| One reveal per section | Two authored moments only: the hero load sequence and the chapter-card stagger. |

Kept from v4: the voice, the sequence of steps, the terms, the FAQ, the form that composes an email, 4px spacing, one motion curve, the two client photographs as the reference for every generated car.

---

## 01 — Colour

Custom properties at the top of `styles.css`.

| Token | Value | Job |
| --- | --- | --- |
| `--ink` | `#0C0F0D` | The outer frame, the booking card, chips, the primary dark |
| `--ink-2` | `#151A17` | Card ground while a photograph loads; hover on ink buttons |
| `--mist` | `#ECEDE9` | The page panel. Cool stone, not cream. |
| `--mist-2` | `#E0E2DD` | Quiet chips, the open FAQ marker |
| `--paper` | `#F7F8F5` | Small cards on mist (planned cars) |
| `--moss` | `#16301F` | The Know-before card |
| `--moss-2` | `#1E3B29` | Promise cards inside the moss card |
| `--verde` | `#8BE04A` | The accent. Primary button, "most booked" chip, live step, focus ring, caret, selection |
| `--verde-2` | `#A3EE6A` | Verde hover |
| `--verde-ink` | `#2F6E12` | Verde as text on light grounds, if ever needed. Unused so far. |
| `--stone` | `#5C615B` | Muted text on mist (5.3:1) |
| `--stone-2` | `#A3A7A0` | Reserved for disabled states. Unused on the page. |
| `--line` / `--line-2` | ink at 10% / 18% | Borders on mist |
| `--line-dark` | white at 14% | Rules on ink and moss |
| `--on-dark-2` / `--on-dark-3` | white at 76% / 54% | Body and captions on dark grounds |
| `--glass` / `--glass-line` | ink at 34% / white at 22% | Glass surfaces over photographs, with `backdrop-filter: blur(14–18px)` |

### Budget

- Verde is the only chromatic colour the page adds. It appears as one button per screen, the "Most booked" chip, the "8,500 rpm" chip, the live step's rule, and browser surfaces. It is never a heading, a panel or a large fill.
- The two cars supply every other colour. Viola belongs to photographs only; nothing in the UI is purple.
- Dark grounds are ink or moss. Moss is used once, for the trust section, so it reads as a change of room.

### Scrims

Photographs under type get plain ink gradients, no hue. Hero: a 38% top band for the nav, a 78% bottom band for the headline and ticket, a 34% left band. Chapter cards: 66% top, 82% bottom. Closer: 72% bottom only.

---

## 02 — Type

Google Fonts CDN: `Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800`, `Manrope:wght@400;500;600;700`, `DM+Mono:wght@400;500`.

| Role | Face | Size | Notes |
| --- | --- | --- | --- |
| `.display.h1` | Bricolage 800, opsz 96, wdth 100 | `clamp(50px, 8.6vw, 140px)`, lh 0.9, tracking −0.022em, uppercase | Hero and closer. The closer runs to `clamp(56px, 10.5vw, 168px)`. |
| `.display.h2` | same | `clamp(34px, 4.8vw, 68px)` | Section heads. `text-wrap: balance`, no manual breaks. |
| `.display.statement` | same | `clamp(34px, 5vw, 84px)` | The road statement. Two lines in `--stone`, the last line filled with the road. |
| `.h3` | Bricolage 700, opsz 40 | 26px (chapter titles 30px, promises 28px) | Card and car names |
| `.h4` | Manrope 700 | 18px | Steps, planned cars |
| `.lede` | Manrope 400 | 19px / 1.5, `--stone`, max 520px | Beside a section head |
| `.body` | Manrope 400 | 17px / 1.55, max 540px | |
| `.body-sm` | Manrope 400 | 15px | Cards, terms, FAQ answers |
| `.mono` | DM Mono 400 | 12px / 1.6, 0.06em, uppercase | Card kickers, meta lines, specs' units. Long lines (ticket footer, terms note, footer) are set in sentence case with no tracking. |
| `.pill` | Manrope 600 | 14px (13px small) | Buttons and links |
| `.chip` | Bricolage 600, opsz 14 | 13px, 0.04em, uppercase | Tags |
| `.label` | Manrope 600 | 12px, 0.06em, uppercase | Form labels |
| Prices | Bricolage 800 | 44px on cards, 24px on the ticket | `$` at 0.5em. Tabular figures on every number. |

Rules: 12px floor; uppercase only for display, chips, labels and short mono; body copy never uppercase; display tracking never tighter than −0.022em.

---

## 03 — Frame and rhythm

```
body                 ink
└ .page              mist, radius 32, margin 12, padding 12, grid gap 12
   ├ .hero           card, photograph, min-height 92vh
   ├ .band#road      mist (no card)
   ├ .band#drives    mist
   ├ .band#fleet     mist
   ├ .trust#know     card, moss
   ├ .band#faq       mist
   ├ .closer         card, photograph
   └ .book           card, ink; contains the footer
```

- `--gap: 12px` (8px under 640px) is the only spacing between cards. Cards never touch and never overlap.
- Radii: page 32px, cards 24px, glass panels 20px, small cards 18px, inputs 16px, pills and chips 999px. Under 640px the page drops to 24px and cards to 20px.
- Section padding `--section: clamp(48px, 7vw, 104px)`; horizontal `--pad: clamp(20px, 3.4vw, 48px)`. The drives and fleet bands drop their top padding so they run on from the section above.
- `.band__head` is a two-column grid, heading left, lede right, aligned to the baseline, stacking under 640px.
- Container 1380px.

---

## 04 — Photography and motion assets

All nine photographs were generated on 2026-09-02 with Nano Banana 2 at 2K, using the client's two Huracán photos as image references so the cars are the real cars (Viola Pasifae, Verde Selvans, the same wheels). Five were then animated with Kling 3.0 as locked-off ambient loops. Files live in `assets/v3/`; raw downloads in `assets/v3/raw/` (git-ignored).

| File | Frame | Where | Moves |
| --- | --- | --- | --- |
| `hero-ridge` | 16:9 | Hero | Dust and pollen in the sun shafts, 10 s |
| `ch-valley` | 3:4 | Driver I | — |
| `ch-ridge` | 3:4 | Driver II | Dust motes in the light, 5 s |
| `ch-bridge` | 3:4 | Driver III | — |
| `ch-x` | 3:4 | Driver X | — |
| `fleet-viola` | 4:5 | Car No. 01 | — |
| `fleet-verde` | 4:5 | Car No. 02 | Drizzle, fog, ripples, 5 s |
| `close-fireflies` | 16:9 | Closer | Fireflies and ground mist, 5 s |
| `road-gold` | 16:9 | Inside the letters of "A road." | Leaves and light, 5 s, as an animated WebP |

The look, so new assets match: Frederick County in late September, last golden hour or blue hour; narrow two-lane road with a double yellow centreline and no shoulder; stone walls, split-rail fences, hay bales, covered bridges, the Catoctin ridge in haze; oaks and tulip poplars; volumetric light, dust or pollen in the beams; realistic colour, light haze, fine grain, no HDR, no motion blur, no people, no text. Car front three-quarter from a low camera, filling the lower half of a portrait frame so the top half can hold a title.

Delivery: WebP at two or three widths per photograph, JPEG at the largest, `<picture>` with `sizes`. Video: H.264, 1280 wide, CRF 26, silent, `+faststart`, 0.25–1.2 MB each. The page's total media weight is about 5 MB before any video plays.

Rules for the moving pictures:

- The camera never moves. Only the atmosphere does. A loop that pans or zooms is rejected.
- The car never moves.
- Loops fade in over 900ms on top of their still, and only once they are actually playing (`.is-playing`), so nothing flashes.
- They load lazily, play only while on screen, and are removed from the DOM entirely under `prefers-reduced-motion` or `saveData`. The still is always the fallback.

Generation notes for the next batch: reuse the reference media ids recorded in the project memory; Kling `pro` mode needs the Plus plan, `std` at 5 s costs 7.5 credits; the first video submission is answered with a preset suggestion, resubmit with `declined_preset_id`.

---

## 05 — Components

### Nav

Fixed, three floating pills at the top inset: the lockup, the section links, the verde "Book a drive". Glass (ink 34%, blur 16px, 22% white line) over the hero; ink at 82% once the hero scrolls under it. Links hide below 900px; the lockup and the button stay. Current section gets a 14% white fill.

### Pills

`.pill` is every button and button-shaped link: 48px tall, 22px sides, Manrope 600 14px. Variants: `--verde` (primary), `--glass` (on photographs), `--paper` (white on photographs, the closer), `--ink`, `--outline` (footer). Hover swaps colour in 180ms; active scales to 0.98. No lift, no shadow.

### Chips

`.chip` is a tag, 36px, Bricolage 600 uppercase: ink on mist (the road names), `--verde` for the one emphasised tag, `--glass` over photographs (the hero's three, the fleet's "No. 01 · In service").

### Ticket (hero)

A 340px glass panel listing the three drives with time, route and price, each row a link to the drives section. The "most booked" row carries a verde dot. Footer line: "Insurance included · No payment until we confirm." On phones it stacks under the buttons.

### Chapter cards (pricing)

Four 3:4 cards in a row, each a photograph and a link to the form. Top: a mono kicker (drive name, minutes or the "Most booked" chip), the `.h3` title, one sentence. Bottom: the price at 44px with the mileage in mono, and a full-width pill. Driver II gets the verde pill and the moving photograph; the others get glass pills. Hover scales the photograph 4.5% over 900ms. Two columns under 1100px, one under 560px. Cards set `width: 100%` because an aspect-ratio box with a `min-height` would otherwise transfer that height into a minimum width and overflow the grid.

### Fleet cards

Two 4:5 photographs with a glass panel at the bottom: name, colour in mono, four spec pills (number in Manrope 700, unit in mono), one line of body. A glass chip at the top-left carries the fleet number and status. Planned cars are small paper rows: a 96×72 thumbnail, the name, a mono spec line.

### Trust card (moss)

The one moss card holds three things in order: three promise cards (`--moss-2`, an `.h3` and one paragraph each), the four steps (a `1px` rule on top, the live step's rule in verde, a mono "Step n" because the order is real), and the terms as a two-column `<dl>` with 110px labels. A sentence-case mono note closes it.

### FAQ

Heading left, `<details>` list right. Question in Manrope 700 18px; a 34px circle with a drawn `+` that rotates 45° and fills `--mist-2` when open. First item open by default.

### Closer

A photograph card, 80vh, the closing headline at the bottom-left, the note at the bottom-right, a glass chip top-left and a paper "Book a drive ↗" pill top-right.

### Form

On ink only. Inputs 54px, 16px radius, 6% white fill, 16% white border; hover 32%; focus verde border and 9% fill; invalid gets a coral border (`#FF7A59`). Selects use a drawn white chevron. Labels are `.label` in `--on-dark-3`. Error and success lines span the grid. Two columns, one under 520px. The submit is a verde pill, followed by "We reply within a day."

### Footer

Inside the booking card, above a `--line-dark` rule: the mono copyright left, the lockup centred, outline pills right.

---

## 06 — Motion

One curve, `cubic-bezier(0.2, 0, 0.2, 1)`, deceleration only. 160–180ms for colour swaps, 240ms for the FAQ marker, 640ms for entrances, 900ms for photographs and video fades.

- **Hero load sequence.** Seven elements (nav, chips, line one, line two, sub copy, buttons, ticket) rise 14px and fade in over 640ms, 100ms apart, starting 140ms after load. Once per visit.
- **Chapter stagger.** The four drive cards and the two fleet cards rise once when their grid enters the viewport, 80ms apart. Nothing else on the page has an entrance.
- **Ambient loops.** See §04. This is where the page's life is, and it is why the entrances stay few.
- **Hover.** Photographs scale; pills swap colour; ticket rows tint.
- `prefers-reduced-motion`: no sequence, no stagger, no video, no photograph scale, and the road statement shows a still frame in its letters.

Without JavaScript nothing is hidden: hidden states are applied only after a script confirms motion is wanted (`html.ad-motion`).

---

## 07 — Browser surfaces

Selection is verde with ink text. The caret is verde. Focus rings are 2px verde with 3px offset on every interactive element, rounded to match pills. Numbers use tabular figures. The date input's picker icon is inverted to white. Scrollbars are left to the browser.

---

## 08 — Breakpoints

All `max-width`:

| Width | What changes |
| --- | --- |
| 1100px | Chapter cards go to two columns; planned cars to two |
| 960px | The hero ticket drops under the copy |
| 900px | Nav links hide; promises stack; steps to two columns; terms to one; the form and copy stack |
| 860px | The road statement and copy stack, statement left-aligned |
| 760px | Fleet cards stack; closer text stacks |
| 720px | Footer centres |
| 640px | Page radius 24, card radius 20, gap 8, section heads stack, hero fills the viewport |
| 560px | Chapter cards to one column |
| 520px | Form to one column; steps to one |

---

## 09 — Voice

Unchanged in register: short declaratives, second person, real numbers, sentence case in prose, uppercase only in display, chips and labels. No exclamation marks, no emoji, none of the banned words.

Lines in use on the page:

- "You drive. We ride shotgun." (hero)
- "Not a track. Not a parking lot. A road."
- "How far up the road do you want to go?"
- "Two Huracáns. Verde and viola."
- "Know before you book."
- "Insurance is included." / "An instructor rides with you." / "Rain means a new date."
- "Asked before."
- "Pick a date." (closer)
- "Book a drive. No payment now."

Buttons say what they do: "Choose your drive", "See the road", "Book Driver II", "Ask about Driver X", "Send the request".

---

## 10 — Known gaps and placeholders

Carried from v4, still open:

- Route mileage per drive, and whether the drives are really out-and-back.
- The follow car mentioned in Driver III, the FAQ and the terms is an assumption.
- Legal line items: minimum age, licence tenure, deductible, refund and change windows, weather policy.
- The booking mechanism. The form composes an email to `hello@apexdriver.com`, which does not exist yet.
- Cars 03 to 05: make, spec, photograph.
- Reviews and any ratings strip.

New in v5:

- The ambient loops are Kling `std`; rerun at `pro` or 4K once the plan allows it. The hero loop is the softest of the five.
- The cockpit photograph from v2 is not on the page. It would suit the road section as a second moving picture.
- Fonts are CDN-linked, not self-hosted.
- No 404, privacy or terms pages.
- `tokens/*.css` and `assets/photos/` (except the three planned-car thumbnails) are unused by the page and can be retired once collateral moves to v5.
