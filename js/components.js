/**
 * SOLARNA — components.js  (Farsi RTL)
 * Injects: navbar · footer · WhatsApp float
 */

function initComponents() {
  injectNavbar();
  injectFooter();
  injectWhatsApp();
  initNavbarBehavior();
  setActivePage();
}

/* ── NAVBAR ─────────────────────────────── */
function injectNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'منوی اصلی');
  nav.innerHTML = `
    <div class="nav__inner container">
      <a href="index.html" class="nav__logo" aria-label="سولارنا - صفحه اصلی">
        <span class="nav__logo-mark" aria-hidden="true"></span>
        سولارنا
      </a>
      <ul class="nav__links" role="list">
        <li><a href="index.html"   data-page="index">خانه</a></li>
        <li><a href="pricing.html" data-page="pricing">محاسبه‌گر</a></li>
        <li><a href="contact.html" data-page="contact">تماس</a></li>
      </ul>
      <a href="contact.html" class="nav__cta">
        مشاوره رایگان
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M10 7H2m4-4L2 7l4 4" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <button class="nav__burger" aria-label="باز/بسته کردن منو" aria-expanded="false">
        <span></span><span></span>
      </button>
    </div>`;
  document.body.prepend(nav);
}

/* ── FOOTER ─────────────────────────────── */
function injectFooter() {
  const f = document.createElement('footer');
  f.className = 'footer';
  f.setAttribute('role', 'contentinfo');
  f.innerHTML = `
    <div class="footer__inner container">
      <div class="footer__top">
        <div class="footer__brand">
          <span class="footer__logo">سولارنا</span>
          <p>راه‌حل‌های انرژی خورشیدی.<br>کاهش هزینه. آینده‌ای پایدار.</p>
        </div>
        <nav class="footer__nav" aria-label="لینک‌های سایت">
          <a href="index.html">صفحه اصلی</a>
          <a href="pricing.html">محاسبه‌گر</a>
          <a href="contact.html">تماس با ما</a>
        </nav>
        <div class="footer__contact">
          <a href="tel:+989333588420">09333588420</a>
          <a href="mailto:info@solarna.ir">info@solarna.ir</a>
          <a href="https://wa.me/989333588420" target="_blank" rel="noopener">واتساپ</a>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© ۱۴۰۵ سولارنا. تمامی حقوق محفوظ است.</span>
        <span>مشهد چراغچی 64</span>
      </div>
    </div>`;
  document.body.append(f);
}

/* ── WHATSAPP ───────────────────────────── */
function injectWhatsApp() {
  const wa = document.createElement('a');
  wa.href = "https://wa.me/98333588420?text=سلام،%20مشاوره%20رایگان%20می‌خواهم";
  wa.className = 'wa-float';
  wa.setAttribute('aria-label', 'چت در واتساپ');
  wa.setAttribute('rel', 'noopener noreferrer');
  wa.setAttribute('target', '_blank');
  wa.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.547 4.07 1.503 5.779L.057 23.077a.75.75 0 00.921.921l5.34-1.462A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 01-4.964-1.364l-.356-.212-3.695 1.013 1.027-3.604-.232-.368A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>`;
  document.body.append(wa);
}

/* ── NAVBAR BEHAVIOR ────────────────────── */
function initNavbarBehavior() {
  const nav    = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const links  = document.querySelector('.nav__links');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('nav--scrolled', y > 60);
    nav.classList.toggle('nav--hidden',  y > lastY + 8 && y > 120);
    nav.classList.toggle('nav--visible', y < lastY - 8);
    lastY = y;
  }, { passive: true });

  burger?.addEventListener('click', () => {
    const open = links.classList.toggle('nav__links--open');
    burger.classList.toggle('nav__burger--open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('nav__links--open');
    burger?.classList.remove('nav__burger--open');
    burger?.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  }));
}

/* ── ACTIVE PAGE ────────────────────────── */
function setActivePage() {
  const page = location.pathname.split('/').pop().replace('.html','') || 'index';
  document.querySelectorAll('.nav__links a[data-page]').forEach(a =>
    a.classList.toggle('active', a.dataset.page === page));
}
