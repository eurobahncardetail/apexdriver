# Apex Driver — v2

Second build of the landing site for Apex Driver, a supercar driving-experience
company in Frederick, MD. One page: hero, the drive, pricing with the route
diagram, the fleet, how it works, know before you book, FAQ, booking form.

The v1 page lives on the `full-bleed-hero` branch. The brand handoff is outside
the repo at `../../design_handoff_landing_page/`. v2 keeps its type, colour and
motion tokens but breaks two of its rules on purpose: the page is photography-led
and dark in the hero and the closing screen, and the road-paint yellow
(`--paint` in `styles.css`) is a fifth colour, used only for the route line.

## Stack

Static HTML, CSS and vanilla JS. No build step, no dependencies.

```bash
node .claude/dev-server.js
```

Then open <http://localhost:4173>. Node 24 is installed at
`C:\Program Files\nodejs`; `.claude/launch.json` points at it by full path.

## What is here

| Path | What it is |
| --- | --- |
| `index.html` | The page. Placeholders are marked in HTML comments |
| `styles.css` | Page styles; values come from `tokens/*.css` |
| `script.js` | Nav state, section reveals, the route diagram, the booking form |
| `tokens/*.css` | Brand System v3 custom properties, copied from the handoff |
| `assets/photos/` | Client photography plus generated backroad shots, WebP with JPEG fallback |
| `docs/competitor-research.md` | Research on seven competitor sites, 2026-09-02 |
| `tools/build-photos.js` | Regenerates the client photo crops with sharp |

## Photography

`hero-huracan`, `huracan-01`, `huracan-02` are the client's own photos.
Everything else in `assets/photos/` was generated on 2026-09-02 with
Nano Banana Pro, using the client photos as references for the two Huracáns.
The three "Next in the fleet" cars are invented placeholders.

## Still placeholder, waiting on the client

- Route names are real Frederick County roads; the mileage per tier is a guess.
- The legal line items (age, licence, deductible, refund window) need sign-off.
- The booking form composes an email to `hello@apexdriver.com`, which does not
  exist yet. Swap for the real booking widget when chosen.
- Cars 03 to 05 (make, spec, photo).
- Reviews: none on the page yet. Add a ratings strip once there are numbers.
