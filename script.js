/* Apex Driver v3 — page behaviour.
   1. Nav: glass over the hero, darker glass after; current item follows scroll.
   2. Load sequence and section reveals (gated on html.ad-motion).
   3. Ambient video: lazy, plays only while on screen, only when motion is wanted.
   4. Booking: drive links preselect the tier; the form composes an email. */
(function () {
  var root = document.documentElement;
  var motion = root.classList.contains('ad-motion');
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- 1. nav ---------- */
  var nav = document.getElementById('nav');
  var hero = document.querySelector('.hero');
  if (hasIO && hero) {
    new IntersectionObserver(function (entries) {
      nav.classList.toggle('nav--solid', !entries[0].isIntersecting);
    }, { rootMargin: '-96px 0px 0px 0px', threshold: 0 }).observe(hero);
  } else {
    nav.classList.add('nav--solid');
  }

  if (hasIO) {
    var links = {};
    document.querySelectorAll('.nav__link[data-spy]').forEach(function (a) {
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

  /* ---------- 2. sequence + reveals ---------- */
  if (motion) {
    requestAnimationFrame(function () {
      document.querySelectorAll('.seq').forEach(function (el) { el.classList.add('is-in'); });
    });
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        reveal.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) { reveal.observe(el); });
  }

  /* ---------- 3. ambient video ---------- */
  var videos = Array.prototype.slice.call(document.querySelectorAll('video.ambient'));
  var saveData = navigator.connection && navigator.connection.saveData;
  if (motion && hasIO && !saveData) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src) {
            v.src = v.getAttribute('data-src');
            v.addEventListener('playing', function () { v.classList.add('is-playing'); }, { once: true });
            v.addEventListener('error', function () { v.remove(); }, { once: true });
          }
          var p = v.play();
          if (p && p.catch) p.catch(function () { /* autoplay refused: the poster stays */ });
        } else if (v.src) {
          v.pause();
        }
      });
    }, { rootMargin: '120px 0px', threshold: 0.05 });
    videos.forEach(function (v) { vio.observe(v); });
  } else {
    videos.forEach(function (v) { v.remove(); });
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
      'Gift: ' + form.gift.value,
      '',
      form.note.value.trim()
    ];
    /* PLACEHOLDER address until the booking mechanism is chosen. */
    window.location.href = 'mailto:hello@apexdriver.com'
      + '?subject=' + encodeURIComponent('Booking request: ' + form.tier.value)
      + '&body=' + encodeURIComponent(lines.join('\n'));
    document.getElementById('formDone').hidden = false;
  });
})();
