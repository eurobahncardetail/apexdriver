# Apex Driver — Design System

Supercar driving experience vouchers. Frederick, MD. Audience is gift buyers.

No build step, no dependencies. Plain CSS custom properties and two ES modules.

```bash
node serve.js
```

Then open `http://localhost:5173`. A server is required — the page loads ES
modules, which browsers refuse to load from `file://`.

## Files

| File | Contains |
| --- | --- |
| `css/tokens.css` | Every color, type, spacing, radius, and motion token. The only file with literal values. |
| `css/base.css` | Reset, page ground, and the three typographic roles (`.t-*`). |
| `css/sections.css` | The two section wrappers, plus `.panel`, `.plate`, `.glass`. |
| `css/components.css` | Nav, button, mark, route line, voucher, pricing row, gift steps, spec sheet, fleet, quotes. |
| `js/route-line.js` | The route line component. |
| `js/voucher.js` | Voucher settle and cursor tilt. |
| `js/apex.js` | Mounts both. |
| `index.html` | The Apex Driver page, assembled entirely from the system. Doubles as the reference for every component. |
| `serve.js` | Static file server for local preview. |

## The rules the system enforces

**Six colors, no seventh.** Graphite (page ground), Slate (raised panels),
Chalk (primary text and button fill), Granite (secondary text and labels),
Viola (the voucher only), and Glass (nav and voucher only). Scrims and tints
are these colors at opacity, never new hues — `--graphite-rgb`, `--chalk-rgb`,
and `--viola-rgb` exist so that stays true. All remaining color on the page
arrives inside the photographs.

There is no accent color and no hover color. The button gives feedback by
deepening its notch instead, so the brightest thing on screen is always a
photograph or the Chalk primary action, never a UI hue.

**Three faces, three jobs.** Sora is display — headlines, package names,
prices, and the 12px tracked-caps labels. Newsreader appears italic only, for
the recipient's name on the voucher and the pull quotes. Chivo Mono is fleet
specs and the voucher serial. The `.t-quote` / `.t-name` / `.t-mono` classes
are the only sanctioned way to reach either restricted face.

**4px is a Paper-section property.** `.section--paper` sets `--radius: 4px`;
`.section--green` sets `--radius: 0`. Components read `var(--radius)` and never
hard-code a corner. The button, the nav bar, the voucher, and the route line
opt out entirely with a literal `border-radius: 0`, because the notch and the
hairline are their identity rather than a corner treatment.

**Numbered markers appear in one section.** `.giftstep__num` is the only
numbered marker in the system, and `list-style: none` is global. Package tiers
carry roman numerals inside their names, which is naming, not numbering.

**The motion budget is one object.** The voucher settles once on load, then
tilts toward the cursor. Nothing else on the page moves. Under
`prefers-reduced-motion` it does neither.

## Section types

Every section is one of two things.

```html
<section class="section section--green">
  <video class="section__media" autoplay muted loop playsinline></video>
  <div class="section__scrim"></div>
  <div class="section__inner"> ... </div>
</section>

<section class="section section--paper">
  <div class="section__inner">
    <div class="section-head">
      <h2 class="section-head__label t-label">Packages</h2>
      <span class="section-head__line"></span>
    </div>
    ...
  </div>
</section>
```

**Green** is photography and atmosphere: full-bleed media, display type, glass
permitted, no radius, and no hairlines — `.section--green` hides `hr` and
`.panel` outright, and the route line is the one line allowed to cross it.

**Paper** is document: solid ground, Slate panels, tracked-caps labels, mono
spec rows, 4px corners. Nothing bleeds and nothing floats.

On this page the hero is the only Green section, because the spec puts
everything below the fold on solid ground.

## The route line

The signature geometry, built to hold up at four sizes from one point array.
Points are normalised `0..1`; the path is recomputed in element pixel space on
resize, so bend radii and stroke weight stay true instead of being distorted by
a scaled viewBox.

Declarative:

```html
<span class="routeline routeline--diagram"
      data-route=".5,1 .5,.52 .88,.52"
      data-route-scale="diagram"
      data-route-markers="tulip"></span>
```

Programmatic:

```js
import RouteLine from './js/route-line.js';

const road = new RouteLine(el, {
  points: [{x: 0, y: 1}, {x: .4, y: 1}, {x: .4, y: .3}, {x: 1, y: .3}],
  scale: 'page',        // wordmark | voucher | diagram | page
  markers: 'tulip',     // none | nodes | tulip
  draw: 'scroll',       // none | reveal | scroll
});

road.draw(0.5);         // drive progress from anything
road.setPoints('0,1 1,0');
road.setScale('diagram');
road.destroy();
```

`scale` selects stroke weight and bend radius, and both are read from
`--route-stroke-*` / `--route-bend-*` in `tokens.css` — retune the road from the
token layer and every instance follows. `RouteLine.pathData()` exposes the
geometry builder for anything that needs the same road language without a live
instance.

**Drawing is off by default.** `draw: 'reveal'` animates once on entering the
viewport; `draw: 'scroll'` ties progress to the element's travel through the
viewport. Neither is used on this page, because the page's motion belongs to the
voucher. Reduced motion always renders the line complete and static.

The four scales in use: wordmark (under the lockup in the nav and footer),
voucher (inside the glass card), diagram (the tulip in step three), page (the
spine running down the gifting steps).

## Components

**Primary action.** Chalk fill, Graphite text, one notched corner bottom-right.
Appears in the nav, the hero, and the close, and nowhere else.

```html
<a class="btn btn--lg" href="#gift">Gift the Experience</a>
```

**The hairpin-A mark.** An A whose apex is a hairpin — two legs climbing to a
tight 180, crossbar where the road cuts back across itself. Same stroke language
as the route line. Sizes: `.mark--sm`, default, `.mark--lg`.

```html
<svg class="mark" viewBox="0 0 64 72" aria-hidden="true">
  <path d="M8 68 L21 20 A11 11 0 0 1 43 20 L56 68"/>
  <path d="M13 50 H51"/>
</svg>
```

**Pricing row.** Deliberately uniform. There is no `--featured`, no
`--popular`, no raised card, no border, and no badge; adding one would be a
system violation, not a styling choice. The only things that change between
tiers are the indent, which carries the inheritance, and the size, which
carries the accumulation. Prices sit in a common right column with tabular
figures so they align like a spec sheet without borrowing the reserved mono
face. Below 34rem the price moves under its own name and indents with it.

```html
<li class="pricerow pricerow--ii">
  <h3 class="pricerow__name">Apex Driver II</h3>
  <span class="pricerow__price">$795</span>
  <div class="pricerow__lines">
    <span>45 min · extended scenic route</span>
    <span>everything in I</span>
  </div>
</li>
```

**Spec-sheet row.** Label, dotted leader, value.

```html
<dl class="specsheet">
  <div class="specsheet__row">
    <dt class="specsheet__label">Horsepower</dt>
    <span class="specsheet__leader" aria-hidden="true"></span>
    <dd class="specsheet__value">602 HP</dd>
  </div>
</dl>
```

The default is Chivo Mono, for the fleet. `.specsheet--safety` keeps the same
document structure but sets it in Sora at reading size, because the type rules
do not license the mono face outside the fleet and the serial.

**Voucher.** Glass over live footage, violet-tinted, landscape in a page of
portrait plates. `data-voucher` mounts the settle and tilt. `--voucher-tint`
and `--voucher-bloom` are the two knobs to retune once the hero video is shot —
they are currently set to read as tinted glass rather than a violet card, so
footage still comes through.

## Photography

The design rations photography deliberately: the spec gives the page exactly
three photographic slots, and the restraint is what lets a photograph be the
brightest thing on screen. Three images are in, from 18 supplied frames.

| Slot | Source | Why |
| --- | --- | --- |
| Hero | `IMG_7107` | The only frame with both cars whole, both front three-quarter, both headlights lit, at dusk. It answers a gift buyer's first question in one look, it carries the warmth the register needs, and its large quiet foreground is where the scrim is heaviest and the headline lives. |
| Fleet — Viola | `IMG_6500` | Front three-quarter, low angle, clean plaza. No plate, no faces, no third-party signage. |
| Fleet — Verde Mantis | `IMG_6496` | The matched partner: same angle, same low camera, same overcast light, same shoot. |

**Why the fleet plates are three-quarter and not side profiles.** The pure side
profiles (`IMG_6494` and `IMG_6495`) are the better *pair* on paper — identical
camera geometry, only the car changes, which mirrors the logic of the spec rows
underneath them. They were built and shipped first, then pulled after seeing
them at rendered size.

The reason is geometry, not taste. A side-on car is a wide, flat subject. To fit
its full length at ~90% of a 9:16 plate's width it can only occupy about 20% of
the plate's height, so each plate came out roughly four-fifths empty building
and pavement, and the cars read small in a two-column grid. A three-quarter view
is a far more compact subject and fills a portrait plate properly. Anyone
revisiting this should test at plate size before swapping back — the crops
themselves look excellent in isolation, which is exactly the trap.

**Why Viola sits on the left.** The green car faces left in frame and the purple
faces right — true of both the profile pair and the three-quarter pair. Ordered
Verde-then-Viola they point off opposite edges and push the eye out of the
section on both sides. Reversed, they face each other across the gutter and the
pair closes. Their wheel lines also happen to fall at the same height, so the
two plates share a horizon. The intro line still reads "One Verde Mantis. One
Viola" — that is a sentence about the fleet, not a caption order, and each plate
is captioned underneath.

`IMG_6494` and `IMG_6495` remain the best frames in the set for any surface that
is wider than it is tall — a landscape banner, an email header, an OG image.

**Rejected, and why** — worth recording so nobody re-proposes them:

- `IMG_7112` — a legible **Alfa Romeo** temporary tag sits under the Lamborghini
  badge. A competitor's name and a readable plate number.
- `IMG_7096`, `IMG_7106` — a third party's café signage is a major element. The
  hero frame was cropped in from the left for the same reason.
- `IMG_6483`, `IMG_6482` — the symmetrical head-on Viola. Striking, but a lamp
  post grows out of the roof and "30 MINUTE RETAIL PARKING" signs flank the car.
- `IMG_6466` — an identifiable person, cropped mid-body at the frame edge, with
  a hand on the car. Needs a release, and the crop is awkward.
- `IMG_6491`, `IMG_6493`, `IMG_6473` — strong frames, but the rear plate
  `70163K` reads clearly. Usable after a retouch; not shipped as-is.
- `IMG_6487` — a street background of parked cars, a stop sign and power lines
  turns a supercar into a parking-lot photo.
- `IMG_7123` — a weaker duplicate of `IMG_7124`.

**Retouch note.** None of the three shipped images has a readable plate or an
identifiable face. Several held-back frames do, and that is the gate on them.

**Held back, and recommended.** These are strong but have no slot in the spec as
written, so they were not added unilaterally:

- `IMG_7126` — the empty driver's seat, shot through the window. For a gift
  brand this is the most on-message frame in the set: it is literally the seat
  being given. It would earn a place in the gift-givers block.
- `IMG_7125` — the cockpit from the driver's position. The only frame that puts
  the viewer where he will be sitting.
- `IMG_7114` / `IMG_7124` — the carbon V10 cover. Near-monochrome, effectively
  Graphite in photographic form; `7124` carries a wedge of Viola.
- `IMG_7116` + `IMG_7120` — the green and purple wheels, a naturally matched
  detail pair.

**What the real photography changed in the system.** Both edits are recorded in
the CSS with their reasons:

- The Green scrim was tuned against a dark placeholder and a lit Verde Mantis
  burned straight through it. It is now two stacked gradients whose alphas
  multiply, so the copy column sits on near-solid Graphite while the right side
  stays open. Below 60rem the copy runs full width, so it switches to a
  vertical-only scrim.
- The voucher gained a Graphite floor beneath its Viola tint. At
  `rgba(255,255,255,.06)` the glass was transparent enough that the serial
  vanished over a bright car — and it has to hold up over any frame of footage.

**Asset pipeline.** Sources are iPhone frames, natively 9:16 and 3:4. Note that
13 of the supplied files carried a `.DNG` extension but are plain JPEGs, and
`IMG_6455` was supplied twice; the rest are genuine HEIC. Derivatives were
produced with Windows Imaging Component. Total image weight is 843 KB —
acceptable for a full-bleed hero, but the first thing to revisit if the page
needs to get lighter. There are no `srcset` variants yet.

## Voice — warm register

Write like a friend who runs the thing and wants her surprise to go perfectly.
Warm, anticipatory, personal, assured. She is not a customer, she is someone
planning something.

The rule that shapes the markup: **emotion earns its place by being followed
with a fact.** A feeling sentence never stands alone next to a concrete one —
which is why `.hero__lede`, `.giftstep__body`, and every `.prose-block` pair a
claim with a detail. The single exception is the gift-givers block, the one
place the emotion is allowed to run on its own, and the page's one ellipsis
beat. `.givers__beat` exists to hold exactly that line and should not be reused.

Numbers stay bare. Warmth lives in the sentences around the price, never in the
price — `.pricerow__price` carries no adjectives, badges, or framing.

Never: "unleash," "adrenaline junkie," "bucket list," "elevate," "world-class"
outside the package list, or any exclamation mark.

### Calls to action

One primary, never varied — including in the nav, which is why the lockup drops
to the mark alone below 30rem rather than the button shortening.

| Role | Copy | Component |
| --- | --- | --- |
| Primary | Gift the Experience | `.btn` |
| Secondary | Meet the cars · See how it works · What he can expect | `.link` |
| Confirmation | It's on its way | — |
| Email subject | His gift is ready | — |

### Errors and empty states

Warm is not apologetic: say what happened, then what to do. `.notice` has no
red, because the system has no accent color — an error earns a Chalk edge
(`.notice--error`), an empty state is simply quieter.

```html
<p class="notice notice--error">That card number doesn't match our records. Give the digits another look.</p>
<p class="notice">Nothing here yet. Pick a package and we'll get his card in the mail.</p>
```

Approved strings:

- `That card number doesn't match our records. Give the digits another look.`
- `Payment didn't go through, and your card wasn't charged. Try again or give us a call.`
- `We'll need an email to send his digital card to.`
- `Nothing here yet. Pick a package and we'll get his card in the mail.`
- `Nothing open in the next two weeks. Call us and we'll find him a day.`

Never `Oops!`.

## Notes on the brief

Two points in the build list disagreed with the design spec, and you chose the
spec on both:

- **Typefaces.** Built on Sora / Newsreader / Chivo Mono per the spec, not
  Newsreader / Hanken Grotesk / Martian Mono.
- **Section names.** The wrappers keep the names `.section--green` and
  `.section--paper`, defined by Apex Driver's actual page — Green is
  photography and atmosphere, Paper is the document. No green ground was
  introduced, which would have meant a seventh color.

Two smaller conflicts I resolved in the spec's favour and am flagging rather
than burying:

- The build list asks for a **flat mono price**, but the type rules reserve
  Chivo Mono for fleet specs and the serial, and list prices under Sora. Prices
  are therefore Sora with tabular figures — flat and column-aligned, no mono.
- The build list asks for a **spec-sheet row for safety info**, while the spec
  sets safety as two-column prose. Both exist: the prose block is the primary
  treatment, with `.specsheet--safety` carrying the at-a-glance facts beneath
  it.

The route line is described in the build list as the signature element and in
the spec as an element that must not move, since motion is budgeted to the
voucher. It is built with full draw-on-scroll capability, defaulted off.

## Still to come

All of it is marked in `index.html` by the `DEMO SCAFFOLDING` style block, which
carries the two placeholder treatments and should be deleted once the real
assets and copy land.

**The hero video.** The spec calls for driving footage, full bleed. Every
supplied frame is a parked car in a plaza, so the hero currently runs a still
(`img/hero.jpg`) in the video's place. The markup keeps the `<video>` swap one
line away, `serve.js` already carries the `.mov` mime type, and the still
doubles as the poster frame. Nothing in the set shows a car moving, or a person
driving one — that is the gap worth shooting.

`T3_1_prob3.mov` in the source folder is not it: 720x1280, 15.3s, warm-toned
throughout, and effectively zero green or purple pixels in any sampled frame, so
neither Huracán appears in it. Left untouched.

**Photography for the held-back slots**, if you want the empty seat and the
cockpit placed — see the Photography section above.

**Three pieces of copy**, each rendered as a `.todo` block — deliberately ugly
so a placeholder cannot ship by accident:

- The safety paragraph, to run verbatim, under *Is it safe?*
- The refund and expiry policy, under *What if he can't use it?*
- Two testimonial pull quotes. The warm-register deck did not include any, so
  nothing is invented there. This section is Newsreader's only licensed use
  besides the recipient's name — cut it and the face appears on the voucher
  alone.

Everything else on the page is production markup carrying your copy.
