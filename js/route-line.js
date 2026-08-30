/* ==========================================================================
   APEX DRIVER — ROUTE LINE
   --------------------------------------------------------------------------
   A road, drawn as one continuous stroke that bends at its nodes.

   Built as a component rather than a decoration because it has to hold up at
   four very different sizes, from the same source geometry:

     wordmark  ~16-32px    sits under the mark in the lockup
     voucher   ~120px      inside the glass card
     diagram   ~200-400px  tulip diagrams in the gifting steps
     page      ~900px+     the spine that runs down a section

   Geometry is normalised (0..1), so one point array serves every scale. The
   path is recomputed in element pixel space on resize, which keeps bend radii
   and stroke weight true instead of scaling a viewBox and distorting them.

   MOTION NOTE: draw-on-scroll is a capability, not a default. The Apex Driver
   page budgets its motion for the voucher alone, so instances there are left
   at draw:'none'. Reduced-motion always renders the line complete and static.
   ========================================================================== */

const SVG_NS = 'http://www.w3.org/2000/svg';

/* Stroke and bend are owned by the token layer (--route-stroke-*, --route-bend-*
   in tokens.css) and read off the element at construction. The values here are
   the fallback for when the stylesheet has not loaded, and they must stay in
   step with it. Node and arrow sizes are geometry rather than design tokens, so
   they live only here. */
const SCALES = {
  wordmark: { stroke: 1.25, bend: 4,  node: 2,   arrow: 5  },
  voucher:  { stroke: 1.5,  bend: 8,  node: 2.5, arrow: 6  },
  diagram:  { stroke: 2,    bend: 14, node: 4,   arrow: 9  },
  page:     { stroke: 3,    bend: 28, node: 5.5, arrow: 13 },
};

/* Read a px-valued custom property off an element, falling back if unset. */
function tokenPx(el, name, fallback) {
  const raw = getComputedStyle(el).getPropertyValue(name);
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

const DEFAULTS = {
  points: [],          // [{x,y}] normalised 0..1, or "x,y x,y ..."
  scale: 'diagram',    // wordmark | voucher | diagram | page
  stroke: null,        // px override
  bend: null,          // px override; 0 gives mitred corners
  draw: 'none',        // none | reveal | scroll
  markers: 'none',     // none | nodes | tulip
  cap: 'round',        // butt | round | square
  dash: null,          // e.g. "6 5" for a dotted planning line
  label: null,         // accessible name; null renders aria-hidden
};

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Object.assign happily copies an explicit `undefined` over a default, which
   would quietly strip draw:'none' and markers:'none' off every declaratively
   mounted instance. Drop the absent keys before merging. */
function given(options) {
  const out = {};
  if (!options) return out;
  for (const key of Object.keys(options)) {
    if (options[key] !== undefined) out[key] = options[key];
  }
  return out;
}

function parsePoints(input) {
  if (typeof input !== 'string') return input || [];
  return input
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const parts = pair.split(',').map(Number);
      return { x: parts[0], y: parts[1] };
    })
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
}

/* Build an SVG path running through `pts` (pixel space), rounding each
   interior node by up to `bend`. The radius at any node is capped at half the
   shorter adjoining segment, so tight nodes stay legible instead of
   overshooting into each other. A 180-degree node with a short segment either
   side is how the hairpin gets made. */
function pathData(pts, bend) {
  const r = bend || 0;
  if (!pts.length) return '';
  if (pts.length === 1) return 'M ' + pts[0].x + ' ' + pts[0].y;

  const n2 = (v) => Math.round(v * 100) / 100;
  let d = 'M ' + n2(pts[0].x) + ' ' + n2(pts[0].y);

  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const next = pts[i + 1];

    const inLen = Math.hypot(cur.x - prev.x, cur.y - prev.y);
    const outLen = Math.hypot(next.x - cur.x, next.y - cur.y);
    if (!inLen || !outLen) continue;

    const rad = Math.min(r, inLen / 2, outLen / 2);

    if (rad <= 0.01) {
      d += ' L ' + n2(cur.x) + ' ' + n2(cur.y);
      continue;
    }

    const ax = cur.x + ((prev.x - cur.x) / inLen) * rad;
    const ay = cur.y + ((prev.y - cur.y) / inLen) * rad;
    const bx = cur.x + ((next.x - cur.x) / outLen) * rad;
    const by = cur.y + ((next.y - cur.y) / outLen) * rad;

    d += ' L ' + n2(ax) + ' ' + n2(ay) +
         ' Q ' + n2(cur.x) + ' ' + n2(cur.y) + ' ' + n2(bx) + ' ' + n2(by);
  }

  const last = pts[pts.length - 1];
  d += ' L ' + n2(last.x) + ' ' + n2(last.y);
  return d;
}

export class RouteLine {
  constructor(el, options) {
    this.el = el;
    this.opts = Object.assign({}, DEFAULTS, given(options));
    this.opts.points = parsePoints(this.opts.points);

    this.preset = SCALES[this.opts.scale] || SCALES.diagram;
    this._readScaleTokens();

    this._build();
    this._observeSize();
    this._observeScroll();
  }

  /* Explicit options win; otherwise the scale preset comes from the tokens. */
  _readScaleTokens() {
    const name = SCALES[this.opts.scale] ? this.opts.scale : 'diagram';
    this.strokeW = this.opts.stroke == null
      ? tokenPx(this.el, '--route-stroke-' + name, this.preset.stroke)
      : this.opts.stroke;
    this.bend = this.opts.bend == null
      ? tokenPx(this.el, '--route-bend-' + name, this.preset.bend)
      : this.opts.bend;
  }

  /* ------------------------------------------------------------------ DOM */
  _build() {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'routeline__svg');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('preserveAspectRatio', 'none');
    if (this.opts.label) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', this.opts.label);
    } else {
      svg.setAttribute('aria-hidden', 'true');
    }

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('class', 'routeline__path');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', this.strokeW);
    path.setAttribute('stroke-linecap', this.opts.cap);
    path.setAttribute('stroke-linejoin', 'round');
    if (this.opts.dash) path.setAttribute('stroke-dasharray', this.opts.dash);
    svg.appendChild(path);

    const marks = document.createElementNS(SVG_NS, 'g');
    marks.setAttribute('class', 'routeline__marks');
    svg.appendChild(marks);

    this.el.classList.add('routeline');
    this.el.appendChild(svg);

    this.svg = svg;
    this.path = path;
    this.marks = marks;
  }

  /* ------------------------------------------------------------- GEOMETRY */
  render() {
    const rect = this.el.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (!w || !h) return;

    // Inset so the stroke and any marker sit fully inside the box.
    const pad = this.strokeW / 2 +
      (this.opts.markers === 'none' ? 0 : this.preset.node);
    const iw = Math.max(w - pad * 2, 1);
    const ih = Math.max(h - pad * 2, 1);

    this.pts = this.opts.points.map((p) => ({
      x: pad + clamp(p.x, 0, 1) * iw,
      y: pad + clamp(p.y, 0, 1) * ih,
    }));

    // viewBox only. Setting width/height attributes would give the SVG an
    // intrinsic size, which in a shrink-to-fit parent feeds back through the
    // ResizeObserver and ratchets the element wider on every pass.
    this.svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    this.path.setAttribute('d', pathData(this.pts, this.bend));

    this.length = this.path.getTotalLength();
    this._renderMarkers();

    const animates = this.opts.draw === 'reveal' || this.opts.draw === 'scroll';
    if (reduced() || !animates) {
      this._setDash(1);                       // complete and static
    } else if (this.opts.draw === 'scroll') {
      this._onScroll();
    } else {
      this._setDash(this.drawn ? 1 : 0);
    }
  }

  _renderMarkers() {
    this.marks.replaceChildren();
    const mode = this.opts.markers;
    if (mode === 'none' || !this.pts || !this.pts.length) return;

    // Tulip convention: a filled dot where the driver enters, an arrowhead
    // where they exit. Interior nodes stay unmarked — the bend is the
    // instruction.
    const nodes = mode === 'tulip' ? [this.pts[0]] : this.pts;

    for (const p of nodes) {
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', p.x);
      dot.setAttribute('cy', p.y);
      dot.setAttribute('r', this.preset.node);
      dot.setAttribute('fill', 'currentColor');
      this.marks.appendChild(dot);
    }

    if (mode === 'tulip' && this.pts.length > 1) {
      const end = this.pts[this.pts.length - 1];
      const before = this.pts[this.pts.length - 2];
      const angle = Math.atan2(end.y - before.y, end.x - before.x) * 180 / Math.PI;
      const a = this.preset.arrow;
      const head = document.createElementNS(SVG_NS, 'path');
      head.setAttribute('d',
        'M 0 0 L ' + (-a) + ' ' + (-a * 0.55) + ' L ' + (-a) + ' ' + (a * 0.55) + ' Z');
      head.setAttribute('fill', 'currentColor');
      head.setAttribute('transform',
        'translate(' + end.x + ' ' + end.y + ') rotate(' + angle + ')');
      this.marks.appendChild(head);
    }
  }

  /* ----------------------------------------------------------------- DRAW */
  _setDash(progress) {
    if (this.opts.dash) return;   // a dashed planning line cannot also draw
    const len = this.length || 0;
    this.path.style.strokeDasharray = String(len);
    this.path.style.strokeDashoffset = String(len * (1 - clamp(progress, 0, 1)));
  }

  /* Draw the line to `progress` (0..1). Public, so the road can be driven by
     anything: a slider, a step change, a media timestamp. */
  draw(progress) {
    this.path.style.transition = 'none';
    this._setDash(progress);
  }

  _observeSize() {
    this._ro = new ResizeObserver(() => this.render());
    this._ro.observe(this.el);
    this.render();
  }

  _observeScroll() {
    const animates = this.opts.draw === 'reveal' || this.opts.draw === 'scroll';
    if (!animates || reduced()) return;

    if (this.opts.draw === 'reveal') {
      this.path.style.transition =
        'stroke-dashoffset var(--dur-draw) var(--ease-draw)';
      this._io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          this.drawn = true;
          this._setDash(1);
          this._io.disconnect();
        }
      }, { threshold: 0.25 });
      this._io.observe(this.el);
      return;
    }

    // scroll: progress tracks the element's travel through the viewport, so
    // the road unrolls at the reader's own pace.
    this._tick = () => {
      this._raf = null;
      this._onScroll();
    };
    this._onFrame = () => {
      if (this._raf == null) this._raf = requestAnimationFrame(this._tick);
    };
    window.addEventListener('scroll', this._onFrame, { passive: true });
    window.addEventListener('resize', this._onFrame, { passive: true });
    this._onScroll();
  }

  _onScroll() {
    const rect = this.el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const start = vh * 0.85;   // begins as the head enters the lower viewport
    const end = vh * 0.25;     // completes as the tail clears the upper third
    const span = rect.height + (start - end);
    const p = span > 0 ? (start - rect.top) / span : 1;
    this._setDash(p);
  }

  /* ------------------------------------------------------------- LIFECYCLE */
  setPoints(points) {
    this.opts.points = parsePoints(points);
    this.render();
  }

  setScale(name) {
    const preset = SCALES[name];
    if (!preset) return;
    this.preset = preset;
    this.opts.scale = name;
    this._readScaleTokens();
    this.path.setAttribute('stroke-width', this.strokeW);
    this.render();
  }

  destroy() {
    if (this._ro) this._ro.disconnect();
    if (this._io) this._io.disconnect();
    if (this._onFrame) {
      window.removeEventListener('scroll', this._onFrame);
      window.removeEventListener('resize', this._onFrame);
    }
    if (this._raf) cancelAnimationFrame(this._raf);
    this.svg.remove();
    this.el.classList.remove('routeline');
  }

  /* Geometry helper, exposed so anything needing the same road language
     without a live instance (static marks, exported SVG, print) can share it. */
  static pathData(points, config) {
    const cfg = config || {};
    const pad = cfg.pad || 0;
    const pts = parsePoints(points).map((p) => ({
      x: pad + clamp(p.x, 0, 1) * (cfg.width - pad * 2),
      y: pad + clamp(p.y, 0, 1) * (cfg.height - pad * 2),
    }));
    return pathData(pts, cfg.bend || 0);
  }

  /* Declarative mounting:
       <div data-route=".02,.98 .35,.98 .35,.35 .98,.35"
            data-route-scale="diagram"
            data-route-markers="tulip"
            data-route-draw="reveal"></div> */
  static mount(root) {
    const scope = root || document;
    const els = Array.prototype.slice.call(scope.querySelectorAll('[data-route]'));
    return els.map((el) => {
      if (el.__route) return el.__route;
      const instance = new RouteLine(el, {
        points: el.dataset.route,
        scale: el.dataset.routeScale || undefined,
        markers: el.dataset.routeMarkers || undefined,
        draw: el.dataset.routeDraw || undefined,
        dash: el.dataset.routeDash || undefined,
        cap: el.dataset.routeCap || undefined,
        stroke: el.dataset.routeStroke ? Number(el.dataset.routeStroke) : null,
        bend: el.dataset.routeBend ? Number(el.dataset.routeBend) : null,
        label: el.dataset.routeLabel || null,
      });
      el.__route = instance;
      return instance;
    });
  }
}

export default RouteLine;
