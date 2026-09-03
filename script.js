/* Apex Driver v3 — page behaviour.
   1. Nav: glass over the hero, darker glass after; current item follows scroll;
      the phone menu sheet; the phone booking bar.
   2. Section reveals (gated on html.ad-motion and html.ad-js). The hero load
      sequence is pure CSS, see styles.css, so it never depends on this file.
   3. Ambient video: lazy, plays only while on screen, only when motion is wanted.
   4. Hero sun rays: a stack of light-only layers scrubbed by the scroll position.
   5. Booking: drive links preselect the tier; the form composes an email. */
(function () {
  var root = document.documentElement;
  var motion = root.classList.contains('ad-motion');
  var hasIO = 'IntersectionObserver' in window;
  var phone = matchMedia('(max-width: 640px)');
  if (motion) root.classList.add('ad-js');

  /* ---------- 1. nav ---------- */
  var nav = document.getElementById('nav');
  var hero = document.querySelector('.hero');
  if (hasIO && hero) {
    new IntersectionObserver(function (entries) {
      var past = !entries[0].isIntersecting;
      nav.classList.toggle('nav--solid', past);
      root.classList.toggle('is-past', past);
    }, { rootMargin: '-96px 0px 0px 0px', threshold: 0 }).observe(hero);
  } else {
    nav.classList.add('nav--solid');
    root.classList.add('is-past');
  }

  /* The booking bar steps aside while the form or the footer is on screen. */
  if (hasIO) {
    var onScreen = [];
    var bookIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var i = onScreen.indexOf(e.target);
        if (e.isIntersecting && i < 0) onScreen.push(e.target);
        if (!e.isIntersecting && i >= 0) onScreen.splice(i, 1);
      });
      root.classList.toggle('is-booking', onScreen.length > 0);
    }, { threshold: 0 });
    ['#book', '.footer'].forEach(function (s) {
      var el = document.querySelector(s);
      if (el) bookIO.observe(el);
    });
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

  /* Phone menu sheet. */
  var menuBtn = document.querySelector('.nav__menu');
  var sheet = document.getElementById('sheet');
  if (menuBtn && sheet) {
    var lastFocus = null;
    var openSheet = function () {
      lastFocus = document.activeElement;
      sheet.hidden = false;
      root.classList.add('sheet-open');
      menuBtn.setAttribute('aria-expanded', 'true');
      sheet.querySelector('.sheet__link').focus();
    };
    var closeSheet = function () {
      sheet.hidden = true;
      root.classList.remove('sheet-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    menuBtn.addEventListener('click', function () { sheet.hidden ? openSheet() : closeSheet(); });
    sheet.querySelector('.sheet__close').addEventListener('click', closeSheet);
    sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeSheet); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });
  }

  /* ---------- 2. reveals ---------- */
  if (motion) {
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
  /* The hero and closer loops are 16:9; phones get a portrait still instead,
     so the loop would not match its poster there. */
  if (phone.matches) {
    videos = videos.filter(function (v) {
      var tall = v.parentNode.querySelector('source[media]');
      if (tall) { v.remove(); return false; }
      return true;
    });
  }
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

  /* ---------- 4. hero sun rays ----------
     assets/v3/rays/rNN.webp are "light only" frames (each is a Kling frame minus
     the darkest plate, see tools/build-rays.js). Drawn additively over the still,
     so the photograph itself is never resampled. The frame index follows the
     scroll through the hero, eased, and nothing moves while the page is still.
     Off on phones (portrait still), under reduced motion, and on saveData. */
  var rays = document.querySelector('.hero .rays');
  if (rays && motion && !saveData && !phone.matches && rays.getContext) {
    var base = rays.getAttribute('data-rays');
    var count = parseInt(rays.getAttribute('data-count'), 10) || 0;
    var frames = [], loaded = 0, ready = false;
    var ctx = rays.getContext('2d');
    var target = 0, shown = -1, current = 0, raf = 0;

    /* The sun sits at 74% across and 17% down the frame; the beams pivot there.
       As the scroll runs 0 to 1 the layer index follows it (front-loaded, since the
       render's light settles early), and the whole light layer swings about two
       degrees around the sun and out again, the way beams cross a windshield.
       At 0 it is layer 0, unrotated: exactly the photograph. */
    var SUN_X = 0.74, SUN_Y = 0.17;
    var draw = function () {
      raf = 0;
      var d = target - current;
      if (Math.abs(d) < 0.0005) current = target; else current += d * 0.1;
      if (current === shown) return;
      shown = current;
      var p = current;
      var f = Math.pow(p, 0.6) * (count - 1);
      var i = Math.floor(f), t = f - i;
      var a = frames[Math.min(i, count - 1)], b = frames[Math.min(i + 1, count - 1)];
      var W = rays.width, H = rays.height;
      var ang = Math.sin(p * Math.PI) * (3 * Math.PI / 180);
      var sc = 1 + 0.06 * p;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);
      ctx.translate(SUN_X * W, SUN_Y * H);
      ctx.rotate(ang);
      ctx.scale(sc, sc);
      ctx.translate(-SUN_X * W, -SUN_Y * H);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 1 - t; ctx.drawImage(a, 0, 0, W, H);
      ctx.globalAlpha = t; ctx.drawImage(b, 0, 0, W, H);
      ctx.globalAlpha = 1;
      if (current !== target) raf = requestAnimationFrame(draw);
    };
    var onScroll = function () {
      if (!ready) return;
      /* Progress through the hero: 0 at the top, 1 once it has scrolled away. */
      var h = hero.offsetHeight - window.innerHeight * 0.5;
      var p = Math.max(0, Math.min(1, window.scrollY / Math.max(1, h)));
      target = p;
      if (!raf) raf = requestAnimationFrame(draw);
    };
    var start = function () {
      for (var k = 0; k < count; k++) {
        var img = new Image();
        img.decoding = 'async';
        img.onload = function () {
          loaded++;
          if (loaded === count) {
            rays.width = frames[0].naturalWidth; rays.height = frames[0].naturalHeight;
            ready = true;
            rays.classList.add('is-ready');
            onScroll();
          }
        };
        img.onerror = function () { rays.remove(); ready = false; };
        img.src = base + 'r' + (k < 10 ? '0' + k : k) + '.webp';
        frames.push(img);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    };
    /* After the page has loaded, so the layers never compete with the still. */
    if (document.readyState === 'complete') setTimeout(start, 400);
    else window.addEventListener('load', function () { setTimeout(start, 400); });
  } else if (rays) {
    rays.remove();
  }

  /* ---------- 5. booking ---------- */
  var tierSelect = document.getElementById('f-tier');
  document.querySelectorAll('[data-book]').forEach(function (a) {
    a.addEventListener('click', function () {
      var want = a.getAttribute('data-book');
      Array.prototype.forEach.call(tierSelect.options, function (o) {
        if (o.text.indexOf(want + ' ') === 0) tierSelect.value = o.value;
      });
    });
  });

  var dateInput = document.getElementById('f-date');
  if (dateInput) {
    var t = new Date();
    dateInput.min = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
  }

  var form = document.getElementById('bookForm');
  var err = document.getElementById('formError');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name, email = form.email, tier = form.tier;
    var bad = [];
    [name, email, tier].forEach(function (f) { f.classList.remove('is-invalid'); f.removeAttribute('aria-invalid'); });
    if (!name.value.trim()) bad.push(name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) bad.push(email);
    if (!tier.value) bad.push(tier);
    bad.forEach(function (f) { f.classList.add('is-invalid'); f.setAttribute('aria-invalid', 'true'); });
    err.hidden = bad.length === 0;
    if (bad.length) { bad[0].focus(); return; }

    var lines = [
      'Name: ' + name.value.trim(),
      'Email: ' + email.value.trim(),
      'Drive: ' + tier.value,
      'Car: ' + form.car.value,
      'Preferred date: ' + (form.date.value || 'flexible'),
      'Gift: ' + form.gift.value,
      '',
      form.note.value.trim()
    ];
    /* PLACEHOLDER address until the booking mechanism is chosen. */
    window.location.href = 'mailto:hello@apexdriver.com'
      + '?subject=' + encodeURIComponent('Booking request: ' + tier.value)
      + '&body=' + encodeURIComponent(lines.join('\n'));
    document.getElementById('formDone').hidden = false;
  });
})();
