/* ==========================================================================
   APEX DRIVER — entry point
   Mounts the two components that need JavaScript. Everything else in the
   system is CSS.
   ========================================================================== */

import RouteLine from './route-line.js';
import Voucher from './voucher.js';

function boot() {
  RouteLine.mount(document);
  Voucher.mount(document);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

// Re-measure once webfonts land, so route lines sized against text metrics
// settle on final geometry rather than fallback metrics.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    document.querySelectorAll('[data-route]').forEach((el) => {
      if (el.__route) el.__route.render();
    });
  });
}

export { RouteLine, Voucher };
