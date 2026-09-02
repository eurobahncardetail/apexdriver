/* Apex Driver — page behaviour.
   1. Nav: transparent over the hero, paper after; current item follows scroll.
   2. Hero load sequence and per-section reveals (gated on html.ad-motion).
   3. The route diagram: one path, drawn as far as the chosen tier reaches.
   4. Book links preselect the tier; the form composes an email. */
(function () {
  var root = document.documentElement;
  var motion = root.classList.contains('ad-motion');
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- 1. nav ---------- */
  var nav = document.getElementById('nav');
  var hero = document.querySelector('.hero');
  function setNav() {
    nav.classList.toggle('nav--solid', window.scrollY > hero.offsetHeight - 80);
  }
  setNav();
  window.addEventListener('scroll', setNav, { passive: true });

  if (hasIO) {
    var links = {};
    document.querySelectorAll('.nav__links a[data-spy]').forEach(function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(function (id) { links[id].classList.remove('on'); });
        if (links[e.target.id]) links[e.target.id].classList.add('on');
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    Object.keys(links).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- 2. reveals ---------- */
  if (motion) {
    document.querySelectorAll('.seq').forEach(function (el) { el.classList.add('is-in'); });
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        reveal.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
    document.querySelectorAll('.ad-reveal').forEach(function (el) { reveal.observe(el); });
  }

  /* ---------- 3. the route ---------- */
  var path = document.getElementById('routePath');
  var svg = path && path.ownerSVGElement;
  var tiers = Array.prototype.slice.call(document.querySelectorAll('.tier'));
  var milesEl = document.getElementById('routeMiles');
  var minsEl = document.getElementById('routeMins');
  var marks = Array.prototype.slice.call(document.querySelectorAll('.route__mark'));
  var labels = Array.prototype.slice.call(document.querySelectorAll('.route__label[data-tier]'));
  var gap = document.querySelector('.route__gap');
  var armed = false;

  if (path && svg) {
    var L = path.getTotalLength();
    [path, gap].forEach(function (p) {
      p.style.strokeDasharray = L;
      p.style.strokeDashoffset = L;
    });
    marks.forEach(function (m) {
      var pt = path.getPointAtLength(L * parseFloat(m.getAttribute('data-at')));
      m.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
    });

    var selected = tiers.filter(function (t) { return t.getAttribute('aria-checked') === 'true'; })[0] || tiers[1];

    function swapNumber(el, value) {
      if (el.textContent === value) return;
      var n = el.parentNode;
      n.classList.add('is-swap');
      setTimeout(function () { el.textContent = value; n.classList.remove('is-swap'); }, motion ? 120 : 0);
    }

    function drawTo(tier) {
      if (!armed) return;
      var at = parseFloat(tier.getAttribute('data-at'));
      var n = parseInt(tier.getAttribute('data-tier'), 10);
      path.style.strokeDashoffset = L * (1 - at);
      gap.style.strokeDashoffset = L * (1 - at);
      marks.forEach(function (m) {
        m.classList.toggle('is-on', parseFloat(m.getAttribute('data-at')) <= at + 0.001);
      });
      labels.forEach(function (l) {
        l.classList.toggle('is-on', parseInt(l.getAttribute('data-tier'), 10) <= n);
      });
      swapNumber(milesEl, tier.getAttribute('data-miles'));
      swapNumber(minsEl, tier.getAttribute('data-mins'));
    }

    function select(tier) {
      selected = tier;
      tiers.forEach(function (t) { t.setAttribute('aria-checked', t === tier ? 'true' : 'false'); });
      drawTo(tier);
    }

    tiers.forEach(function (t, i) {
      t.addEventListener('click', function (e) {
        if (e.target.closest('a')) return; /* the book button is its own action */
        select(t);
      });
      t.addEventListener('mouseenter', function () { drawTo(t); });
      t.addEventListener('mouseleave', function () { drawTo(selected); });
      t.addEventListener('focus', function () { drawTo(t); });
      t.addEventListener('blur', function () { drawTo(selected); });
      t.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); select(t); }
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); var nx = tiers[(i + 1) % tiers.length]; nx.focus(); select(nx); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); var pv = tiers[(i - 1 + tiers.length) % tiers.length]; pv.focus(); select(pv); }
      });
    });

    /* Draw once the diagram is on screen. Without motion, draw immediately. */
    function arm() { armed = true; drawTo(selected); }
    if (motion && hasIO) {
      var once = new IntersectionObserver(function (entries) {
        if (!entries.some(function (e) { return e.isIntersecting; })) return;
        arm();
        once.disconnect();
      }, { threshold: 0.35 });
      once.observe(svg);
    } else {
      [path, gap].forEach(function (p) { p.style.transition = 'none'; });
      marks.forEach(function (m) { m.style.transition = 'none'; });
      arm();
    }
  }

  /* ---------- 4. booking ---------- */
  var tierSelect = document.getElementById('f-tier');
  document.querySelectorAll('[data-book]').forEach(function (a) {
    a.addEventListener('click', function () {
      var want = a.getAttribute('data-book');
      Array.prototype.forEach.call(tierSelect.options, function (o) {
        if (o.text.indexOf(want + ' ') === 0) tierSelect.value = o.value;
      });
    });
  });

  var form = document.getElementById('bookForm');
  var err = document.getElementById('formError');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name, email = form.email;
    var ok = true;
    [name, email].forEach(function (f) { f.classList.remove('is-invalid'); });
    if (!name.value.trim()) { name.classList.add('is-invalid'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add('is-invalid'); ok = false; }
    err.hidden = ok;
    if (!ok) { (name.classList.contains('is-invalid') ? name : email).focus(); return; }

    var lines = [
      'Name: ' + name.value.trim(),
      'Email: ' + email.value.trim(),
      'Drive: ' + form.tier.value,
      'Car: ' + form.car.value,
      'Preferred date: ' + (form.date.value || 'flexible'),
      '',
      form.note.value.trim()
    ];
    /* PLACEHOLDER address until the booking mechanism is chosen. */
    window.location.href = 'mailto:hello@apexdriver.com'
      + '?subject=' + encodeURIComponent('Booking request: ' + form.tier.value)
      + '&body=' + encodeURIComponent(lines.join('\n'));
  });
})();
