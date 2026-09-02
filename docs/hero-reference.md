> **Superseded.** This describes the earlier grayscale build. The page now follows Apex Driver Brand System v3 (see README.md); where this file disagrees with the brand system, the brand system wins.

# Apex Driver — Hero Reference

Reference for the full-bleed homepage hero. Written to be handed to a design
tool or another agent as context: what the hero is now, the numbers behind it,
and the calls that are already settled so they don't get re-litigated from a
blank slate.

Companion to `voice-guide.md`, which governs the copy. Source of truth is
always `index.html` and `styles.css`; this file explains them.

---

## What it is

The photograph is the section, not a card inside it.

It used to be a two-column split — copy left, a 4:3 photo card right. Now the
photograph fills the viewport below the sticky nav and the copy rests on it,
bottom-left, over a scrim.

```
<section class="hero">
  <div class="hero__media"> <picture> … </picture> </div>   ← z −2
                                                            ← z −1  .hero::after (scrim)
  <div class="hero__copy">  h1 / p / a.btn        </div>    ← z auto
</section>
```

Media comes first in the DOM, so the copy needs no positioning of its own to
sit above it. The section sets `isolation: isolate`, which keeps the negative
z-indices local — without it they escape behind the page background.

---

## Layers

| z | Element | What it does |
|---|---|---|
| −2 | `.hero__media` | Absolute, `inset: 0`, filled with void black so the frame holds while the photo decodes. Wraps the `<picture>`, requested at `sizes="100vw"`. |
| −1 | `.hero::after` | The scrim. Two stacked gradients. |
| auto | `.hero__copy` | In normal flow, capped at `--max-width` and centred, so it lines up with every other section while the photo runs edge to edge. |

The scrim's only job is carrying the copy. It is not a mood filter — pushing it
darker for atmosphere costs the photograph, which is the one thing on the page
with any colour in it.

---

## Geometry

| Property | Value |
|---|---|
| Height | `min-height: calc(100svh - var(--nav-height))` |
| Padding | `clamp(96px, 14vw, 180px) var(--pad-x) clamp(56px, 7vw, 88px)` |
| Alignment | `display: grid; align-items: end` |
| Content width | `--max-width: 1400px`, `--pad-x: clamp(20px, 5vw, 64px)` → 1272px usable at the cap |
| Crop | `object-fit: cover; object-position: 50% 62%` |

**On `svh`.** An identical `100vh` line precedes it as a fallback. The `svh`
unit is the whole point: with `vh`, collapsing mobile browser chrome makes the
hero jump on scroll.

**On `--nav-height`.** `calc(20px * 2 + 26px + 1px)` = 67px, derived rather than
measured. It also feeds `scroll-padding-top`, so changing nav padding without
going through this token silently breaks every anchor offset on the page.

**On the top padding.** Deliberately large. It pushes the copy into the bottom
third and keeps it clear of the car's face.

**On the crop.** 62% down the frame is the anchor the photos were originally
built to — it centres the car without clipping the roof. This overrides
`.photo`'s fixed 4:3, which still governs the fleet cards.

---

## Type

One superfamily at two widths. Archivo's `wdth` axis runs 62–125; the display
sits at the expanded end and labels at the default, so the width jump — not a
second typeface — is what separates them.

At width 125, **"THE WHEEL." sets at 7.9× the font size.** Every size below is
solved against that ratio.

| Role | Spec |
|---|---|
| Headline | Archivo, `wdth 125`, `wght 700`, tracking `-0.005em`, `clamp(36px, 7.4vw, 104px)`, line-height `0.96`, uppercase |
| Subhead | IBM Plex Sans, `clamp(16px, 1.6vw, 19px)`, line-height `1.5`, `#D8D9DB`, max-width `480px`, 24px below the headline |
| Button | Archivo, `wdth 100`, `wght 600`, tracking `0.06em`, paper-white fill on void-black text, square corners, 32px below the subhead |

At the 104px cap the headline measures ~822px, inside the 1272px content box;
7.4vw stays clear of the gutters all the way down to 320px.

The headline occupies **~63% of the content width on desktop and ~65% in
portrait.** If a revision changes that ratio much in either direction, the
hero stops looking like this one.

Nothing on this site is rounded.

---

## The scrim

Two gradients, both load-bearing. Every stop is `rgba(10, 10, 11, α)` — void
black at opacity, never a separate grey.

```css
background:
  linear-gradient(to top,
    rgba(10, 10, 11, 0.92) 0%,
    rgba(10, 10, 11, 0.78) 24%,
    rgba(10, 10, 11, 0.30) 58%,
    rgba(10, 10, 11, 0.10) 78%,
    rgba(10, 10, 11, 0.45) 100%),
  linear-gradient(to right,
    rgba(10, 10, 11, 0.55) 0%,
    rgba(10, 10, 11, 0.20) 45%,
    rgba(10, 10, 11, 0) 75%);
```

**Vertical pass** carries the copy. The `0.45` at the top is a wash that keeps
the nav hairline legible against a bright sky.

**Horizontal pass** exists only because on wide screens the copy column sits
over the brightest part of the frame. Left-weighted, and fully clear by
three-quarters across, so the car is never veiled.

---

## Tokens the hero uses

All defined in `:root` in `styles.css`. The palette is seven greys.

```
--void-black   #0A0A0B   hero ground, scrim base, button text
--asphalt-alt  #1C1D1F   image placeholder while decoding
--graphite     #4B4D52   dashed hairlines
--steel        #8A8D93   muted labels
--chrome       #D8D9DB   subhead
--paper-white  #F7F7F5   headline, button fill

--font-display      Archivo, "Arial Narrow", sans-serif
--font-ui           Archivo, "Helvetica Neue", Arial, sans-serif
--font-body         "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif
--display-width     125%
--display-weight    700
--display-tracking  -0.005em
--label-weight      600

--max-width   1400px
--pad-x       clamp(20px, 5vw, 64px)
--nav-height  calc(20px * 2 + 26px + 1px)
```

---

## Settled

Things already decided. Changing one of these is a real decision, not a tweak.

### Zooming the portrait crop — tried, reverted

In portrait, `cover` crops the source's *width* rather than its height, so the
whole 4:3 frame shows and the car reads small under a stretch of dark building.
A `transform: scale(1.4)` anchored on the car was tried and removed: it cropped
the headlights and the car's face out of frame, which is worse than the dead
space.

If this is worth solving, the fix is a portrait crop generated from the
original in `tools/build-photos.js` — not CSS.

### The photograph is the only colour — hold

The palette is seven greys. The car's purple is the single chromatic event on
the page, and that is deliberate. An accent hue introduced anywhere would
compete with it.

### No motion in the hero — hold

The page has exactly one orchestrated moment: the How It Works route line
drawing itself once on scroll, armed by a small script in `<head>` and gated on
`prefers-reduced-motion`. Parallax or a Ken Burns drift in the hero would take
that moment's place rather than add to it.

### EXIF is stripped — constraint

These are personal phone photos, and the originals carried GPS coordinates. The
published files do not. Any regenerated asset has to keep that true.

### Two cars, not a fleet — constraint

There are genuinely two Huracáns. The hero is one of them shot head-on; the
fleet section shows both at three-quarter. Nothing should imply a larger
inventory.

### No build step — constraint

Static HTML and CSS, no dependencies. The only JavaScript on the page is the
route-line observer. `sharp` is used to regenerate photos and is not a project
dependency.

---

## Files

| Path | What's in it |
|---|---|
| `index.html` | The hero is section 2, between the nav and How It Works |
| `styles.css` | Tokens in `:root`, then sections in page order; the hero block follows the nav |
| `assets/photos/` | WebP with a JPEG fallback, two widths each; the hero pair is 800w / 1600w at 4:3 |
| `tools/build-photos.js` | Regenerates the crops with sharp |
| `docs/voice-guide.md` | The copy rules the headline and subhead answer to |

Hero photograph: purple Huracán, head-on, headlights lit, dark slatted building
behind. Cropped from a portrait phone original at 62% down the frame.
