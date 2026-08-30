/* ==========================================================================
   APEX DRIVER — VOUCHER
   --------------------------------------------------------------------------
   The signature element, and the page's entire motion budget.

     1. It settles once on load — a single arrival, then it is done.
     2. Thereafter it tilts slightly toward the cursor.

   Nothing else on the page moves. Under prefers-reduced-motion it does
   neither: it is simply present, level, and legible.
   ========================================================================== */

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export class Voucher {
  constructor(el, options) {
    const opts = options || {};
    this.el = el;
    this.plane = el.querySelector('.voucher__plane') || el;
    this.maxTilt = opts.maxTilt || null;   // null = read --tilt-max from CSS
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._settle();
    if (!this.reduced) this._bindTilt();
  }

  /* One arrival on load. The class flip is all it takes — the transition
     itself is declared in CSS so the timing stays in the token layer. */
  _settle() {
    if (this.reduced) {
      this.el.classList.add('is-settled');
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.el.classList.add('is-settled'));
    });
  }

  _tiltMax() {
    if (this.maxTilt != null) return this.maxTilt;
    const raw = getComputedStyle(this.el).getPropertyValue('--tilt-max');
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : 6;
  }

  _bindTilt() {
    const target = { rx: 0, ry: 0 };
    let raf = null;

    const apply = () => {
      raf = null;
      this.plane.style.setProperty('--rx', target.rx.toFixed(2) + 'deg');
      this.plane.style.setProperty('--ry', target.ry.toFixed(2) + 'deg');
    };
    const schedule = () => {
      if (raf == null) raf = requestAnimationFrame(apply);
    };

    // Tracked against the viewport rather than the card, so the tilt keeps
    // responding as the cursor approaches instead of snapping on hover.
    this._onMove = (e) => {
      const rect = this.el.getBoundingClientRect();
      if (!rect.width) return;
      const max = this._tiltMax();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const reach = Math.max(rect.width, rect.height) * 1.6;

      const dx = clamp((e.clientX - cx) / reach, -1, 1);
      const dy = clamp((e.clientY - cy) / reach, -1, 1);

      target.ry = dx * max;
      target.rx = -dy * max;
      schedule();
    };

    this._onLeave = () => {
      target.rx = 0;
      target.ry = 0;
      schedule();
    };

    window.addEventListener('pointermove', this._onMove, { passive: true });
    window.addEventListener('pointerleave', this._onLeave, { passive: true });
    window.addEventListener('blur', this._onLeave);
    this._cancelRaf = () => { if (raf != null) cancelAnimationFrame(raf); };
  }

  destroy() {
    window.removeEventListener('pointermove', this._onMove);
    window.removeEventListener('pointerleave', this._onLeave);
    window.removeEventListener('blur', this._onLeave);
    if (this._cancelRaf) this._cancelRaf();
  }

  static mount(root) {
    const scope = root || document;
    const els = Array.prototype.slice.call(scope.querySelectorAll('[data-voucher]'));
    return els.map((el) => new Voucher(el));
  }
}

export default Voucher;
