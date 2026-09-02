/* Apex Driver — the page's three behaviours.
   1. Nav current-item rule follows the section in view (state, not motion, so
      it runs regardless of the reduced-motion setting).
   2. Sections reveal once, per section, never per element.
   3. The circuit draws itself once. The page's one long moment.
   The head script only adds .ad-motion when reduced motion is off and
   IntersectionObserver exists; 2 and 3 are gated on that class. */
(function () {
  var root = document.documentElement;
  var hasIO = 'IntersectionObserver' in window;

  /* 1 — current nav item */
  if (hasIO) {
    var links = {};
    document.querySelectorAll('.nav__links a[data-spy]').forEach(function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(function (id) { links[id].classList.remove('on'); });
        links[e.target.id].classList.add('on');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    Object.keys(links).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  if (!root.classList.contains('ad-motion')) return;

  /* 2 — section reveals: 12px rise, 380ms, fired once when the section's top
     crosses 85% of the viewport. Threshold alone never fires on a section
     taller than the viewport. */
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      reveal.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -15% 0px', threshold: 0 });
  document.querySelectorAll('.ad-reveal').forEach(function (el) { reveal.observe(el); });

  /* 3 — the circuit. Measure the real path so the dash matches exactly; the
     token file's 926 is only a fallback. Observe the <svg>, not the path. */
  var path = document.querySelector('.ad-draw');
  if (path) {
    path.style.setProperty('--path-length', Math.ceil(path.getTotalLength()));
    var draw = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        path.classList.add('is-in');
        draw.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    draw.observe(path.ownerSVGElement);
  }
})();
