/**
 * SOLARNA — main.js  (Farsi RTL)
 * Scroll reveal · Counters · Cursor · Calculator · Carousel · Contact → Google Sheets
 */

document.addEventListener('DOMContentLoaded', () => {
  initComponents();
  initReveal();
  initCounters();
  initCursor();
  initCalculator();
  initCarousel();
  initContactForm();
  initSmoothScroll();
});

/* ── REVEAL ──────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: '0px 0px -44px 0px' }
  );
  els.forEach(el => io.observe(el));
}

/* ── COUNTERS ────────────────────────────────────────── */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix || '';
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1600, 1);
        el.textContent = Math.round(p * target).toLocaleString('fa-IR') + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* ── CURSOR ──────────────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.append(dot);
  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  const tick = () => {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    dot.style.transform = `translate(${cx}px,${cy}px)`;
    requestAnimationFrame(tick);
  };
  tick();
  document.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('cursor-dot--grow'));
    el.addEventListener('mouseleave', () => dot.classList.remove('cursor-dot--grow'));
  });
}

/* ── CALCULATOR ──────────────────────────────────────── */
function initCalculator() {
  const billIn    = document.getElementById('billInput');
  const billSlide = document.getElementById('billSlider');
  const regionSel = document.getElementById('region');
  const resultEl  = document.getElementById('calcResult');
  if (!billIn || !resultEl) return;

  const irr = { tehran:5.2, isfahan:5.8, shiraz:6.1, mashhad:5.5, tabriz:4.9, ahvaz:6.4, other:5.3 };

  const sync = fromSlider => {
    if (fromSlider) billIn.value = billSlide.value;
    else billSlide.value = Math.min(+billIn.value || 0, +billSlide.max);
    compute();
  };
  billSlide.addEventListener('input', () => sync(true));
  billIn.addEventListener('input', () => sync(false));
  regionSel?.addEventListener('change', compute);

  function compute() {
    const bill = +billIn.value || 0;
    if (bill < 100000) { resultEl.classList.remove('calc-result--show'); return; }
    const h    = irr[regionSel?.value] || 5.3;
    const kwh  = bill / 3500;
    const kw   = Math.ceil(kwh / (h * 30 * 0.80) * 2) / 2;
    const cost = kw * 30_000_000;
    const save = bill * 0.85;
    const pb   = (cost / save / 12).toFixed(1);
    const fmt  = v => v >= 1e6 ? (v/1e6).toFixed(1) + ' میلیون' : Math.round(v).toLocaleString('fa-IR');

    document.getElementById('rSize').textContent    = kw.toFixed(1) + ' kW';
    document.getElementById('rSaveM').textContent   = fmt(save) + ' ت';
    document.getElementById('rSaveY').textContent   = fmt(save * 12) + ' ت';
    document.getElementById('rCost').textContent    = fmt(cost) + ' ت';
    document.getElementById('rPayback').textContent = pb + ' سال';
    resultEl.classList.add('calc-result--show');
  }
}

/* ── CAROUSEL ────────────────────────────────────────── */
function initCarousel() {
  const track = document.querySelector('.carousel__track');
  if (!track) return;
  const slides = [...track.children];
  const total  = slides.length;
  let idx = 0, autoplay;
  const dots = [...(document.querySelector('.carousel__dots')?.children || [])];

  function goTo(n) {
    slides[idx].classList.remove('carousel__slide--active');
    dots[idx]?.classList.remove('carousel__dot--active');
    idx = (n + total) % total;
    slides[idx].classList.add('carousel__slide--active');
    dots[idx]?.classList.add('carousel__dot--active');
  }
  document.querySelector('.carousel__prev')?.addEventListener('click', () => { goTo(idx - 1); reset(); });
  document.querySelector('.carousel__next')?.addEventListener('click', () => { goTo(idx + 1); reset(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); reset(); }));

  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) { goTo(dx < 0 ? idx + 1 : idx - 1); reset(); }
  });
  function reset() { clearInterval(autoplay); autoplay = setInterval(() => goTo(idx + 1), 5200); }
  goTo(0); reset();
}

/* ── CONTACT FORM → GOOGLE SHEETS ───────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const msgEl = form.querySelector('.form__msg');
  const btn   = form.querySelector('[type=submit]');

  /*
   * ⚙️  SETUP:
   * 1. Open Google Sheets → Extensions → Apps Script
   * 2. Paste the doPost() script (see README or docs)
   * 3. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone
   * 4. Copy the /exec URL and replace SHEET_URL below
   */
  const SHEET_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const data = {
      name:      form.querySelector('[name=name]')?.value.trim(),
      phone:     form.querySelector('[name=phone]')?.value.trim(),
      email:     form.querySelector('[name=email]')?.value.trim(),
      subject:   form.querySelector('[name=subject]')?.value,
      message:   form.querySelector('[name=message]')?.value.trim(),
      timestamp: new Date().toLocaleString('fa-IR'),
      source:    'solarna.ir'
    };

    if (!data.name || !data.phone || !data.message) {
      show('لطفاً فیلدهای ضروری را پر کنید.', 'error'); return;
    }
    if (!/^(\+98|0)?9\d{9}$/.test(data.phone.replace(/[\s-]/g, ''))) {
      show('شماره موبایل وارد شده معتبر نیست.', 'error'); return;
    }

    btn.classList.add('btn--loading');
    btn.disabled = true;

    try {
      /* Google Apps Script only accepts no-cors from browser,
         so we use a Form-encoded POST which works cross-origin */
      const body = new URLSearchParams(data);
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',       // GAS requires no-cors
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
      /* no-cors means we can't read the response — assume success */
      form.reset();
      show('✓ پیام شما ارسال شد. به زودی با شما تماس می‌گیریم.', 'ok');
    } catch (err) {
      show('خطا در ارسال. لطفاً از طریق واتساپ تماس بگیرید.', 'error');
    } finally {
      btn.classList.remove('btn--loading');
      btn.disabled = false;
    }
  });

  function show(txt, type) {
    if (!msgEl) return;
    msgEl.textContent = txt;
    msgEl.className = `form__msg form__msg--${type} form__msg--show`;
    setTimeout(() => msgEl.classList.remove('form__msg--show'), 6000);
  }
}

/* ── SMOOTH SCROLL ───────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a =>
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return; e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
  );
}
